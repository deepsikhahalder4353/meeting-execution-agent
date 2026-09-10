import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root, falling back to local .env if present
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Configure multer with memory storage and 25MB max size limit (Groq API limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const groqKey = process.env.GROQ_API_KEY;
  const groqKeyLoaded = Boolean(groqKey && groqKey.trim().length > 0);

  res.json({
    status: "ok",
    groqKeyLoaded,
  });
});

// Audio/video transcription endpoint using Groq Whisper API
app.post("/api/transcribe", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large. Maximum allowed size is 25MB." });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }

    try {
      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey || !groqApiKey.trim()) {
        return res.status(500).json({ error: "GROQ_API_KEY environment variable is not configured." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded. Expected multipart field 'file'." });
      }

      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname || "audio.wav";
      const mimeType = req.file.mimetype || "audio/wav";

      const blob = new Blob([fileBuffer], { type: mimeType });
      const formData = new FormData();
      formData.append("file", blob, fileName);
      formData.append("model", "whisper-large-v3");
      formData.append("response_format", "verbose_json");

      const groqResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: formData,
      });

      if (!groqResponse.ok) {
        const errorBody = await groqResponse.text();
        console.error("Groq Whisper API error:", groqResponse.status, errorBody);
        return res.status(groqResponse.status).json({
          error: `Groq Whisper API returned error (${groqResponse.status}): ${errorBody}`,
        });
      }

      const result = await groqResponse.json();
      return res.json({
        text: (result.text || "").trim(),
        language: result.language || "English",
        duration: result.duration || null,
        segments: result.segments || [],
      });
    } catch (error) {
      console.error("Transcription error:", error);
      return res.status(500).json({
        error: `Transcription failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  });
});

// Extraction endpoint using Groq LLM with exhaustive extraction instructions and generous output token limit
app.post("/api/extract", async (req, res) => {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey || !groqApiKey.trim()) {
      return res.status(500).json({ error: "GROQ_API_KEY environment variable is not configured." });
    }

    const { transcript } = req.body || {};
    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
      return res.status(400).json({ error: "No transcript text provided." });
    }

    const systemPrompt = `You are an expert meeting execution agent.
Extract ALL decisions, ALL action items with owners, and ALL open questions from the provided conversation transcript.

CRITICAL INSTRUCTIONS:
- You must capture EVERY clear decision, EVERY action-item-with-owner, and EVERY explicit open question in the input, regardless of length.
- DO NOT cap, limit, summarize away, or truncate any items.
- Ensure all decisions, tasks, and questions mentioned in the transcript are present in the output.
- For each task, title should be concise and start with an action verb (e.g. "Prepare client demo"). Assignee should be the name of the person responsible. Priority should be "urgent", "high", "medium", or "low".
- For open questions, capture all unresolved questions, pending items, or inquiries needing answers (including statements like "Need to confirm if...").

Respond ONLY with valid JSON in this exact structure:
{
  "decisions": ["string"],
  "tasks": [
    {
      "title": "string",
      "assigneeName": "string",
      "priority": "urgent" | "high" | "medium" | "low"
    }
  ],
  "unresolvedQuestions": ["string"]
}`;

    const models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"];
    let lastError = null;
    let extractedData = null;

    for (const model of models) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: transcript.trim() },
            ],
            response_format: { type: "json_object" },
            max_tokens: 3500,
            temperature: 0.1,
          }),
        });

        if (!groqRes.ok) {
          const errText = await groqRes.text();
          lastError = new Error(`Groq model ${model} error (${groqRes.status}): ${errText}`);
          continue;
        }

        const data = await groqRes.json();
        const rawContent = data.choices?.[0]?.message?.content;
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          if (parsed && typeof parsed === "object") {
            extractedData = {
              decisions: Array.isArray(parsed.decisions)
                ? parsed.decisions.map(String).map((s) => s.trim()).filter(Boolean)
                : [],
              tasks: Array.isArray(parsed.tasks)
                ? parsed.tasks
                    .map((t) => ({
                      title: String(t.title || "").trim(),
                      assigneeName: String(t.assigneeName || "Unassigned").trim(),
                      priority: ["urgent", "high", "medium", "low"].includes(String(t.priority).toLowerCase())
                        ? String(t.priority).toLowerCase()
                        : "medium",
                    }))
                    .filter((t) => t.title.length > 0)
                : [],
              unresolvedQuestions: Array.isArray(parsed.unresolvedQuestions)
                ? parsed.unresolvedQuestions.map(String).map((s) => s.trim()).filter(Boolean)
                : [],
            };
            break;
          }
        }
      } catch (e) {
        lastError = e;
      }
    }

    if (!extractedData) {
      throw lastError || new Error("Failed to extract structured data from transcript.");
    }

    return res.json(extractedData);
  } catch (error) {
    console.error("Extraction error:", error);
    return res.status(500).json({
      error: `Extraction failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Transcribe: POST http://localhost:${PORT}/api/transcribe`);
  console.log(`Extract: POST http://localhost:${PORT}/api/extract`);
  console.log(`GROQ_API_KEY loaded: ${Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0)}`);
});

