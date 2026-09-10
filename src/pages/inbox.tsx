import { AudioLines, Check, FileAudio, FileText, Image as ImageIcon, Loader2, MessageSquareText, Play, Send, Sparkles, UploadCloud } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import Tesseract from "tesseract.js";
import { type IngestionResult, useIngestConversation, useListProjects } from "@workspace/api-client-react";
import { Button, Card, PageTitle, Textarea, StatusDot } from "../components/ui-primitives";

const inputTypes = [
  { key: "transcript", label: "Transcript", icon: FileText },
  { key: "whatsapp", label: "WhatsApp text", icon: MessageSquareText },
  { key: "audio", label: "Audio", icon: AudioLines },
  { key: "video", label: "Video", icon: Play },
  { key: "image", label: "Image", icon: ImageIcon }
];

export default function Inbox() {
  const projects = useListProjects();
  const ingest = useIngestConversation();
  const [type, setType] = useState<"transcript" | "whatsapp" | "audio" | "video" | "image">("transcript");
  const [text, setText] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [result, setResult] = useState<IngestionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState("");

  const executeIngestion = (
    transcriptPayload?: string,
    fileLabel?: string | null,
    fileObj?: File | null,
    overrideType?: typeof type
  ) => {
    setError(null);
    ingest.mutate(
      {
        data: {
          projectId,
          inputType: overrideType || type,
          transcript: transcriptPayload,
          fileName: fileLabel || null,
          file: fileObj || null
        }
      },
      {
        onSuccess: (res) => {
          setResult(res);
          setError(null);
        },
        onError: (err: any) => {
          setError(err?.message || "Failed to transcribe or process conversation.");
        }
      }
    );
  };

  const handleImageUpload = async (selectedFile: File, activeProjectId?: string) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError(null);
    setOcrLoading(true);
    setOcrProgress("Reading image…");

    try {
      const ocrRes = await Tesseract.recognize(selectedFile, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const pct = Math.round((m.progress || 0) * 100);
            setOcrProgress(`Reading image… ${pct}%`);
          }
        }
      });

      const extractedText = ocrRes?.data?.text?.trim() || "";
      const alphanumeric = extractedText.replace(/[^a-zA-Z0-9]/g, "");

      if (alphanumeric.length < 5) {
        setError("Couldn't read text from this image");
        setText("");
        setOcrLoading(false);
        setOcrProgress("");
        return;
      }

      setText(extractedText);
      setOcrLoading(false);
      setOcrProgress("");

      const targetProj = activeProjectId || projectId;
      if (targetProj) {
        setError(null);
        ingest.mutate(
          {
            data: {
              projectId: targetProj,
              inputType: "image",
              transcript: extractedText,
              fileName: selectedFile.name,
              file: selectedFile
            }
          },
          {
            onSuccess: (res) => {
              setResult(res);
              setError(null);
            },
            onError: (err: any) => {
              setError(err?.message || "Failed to process image text.");
            }
          }
        );
      }
    } catch (err: any) {
      setError("Couldn't read text from this image");
      setText("");
      setOcrLoading(false);
      setOcrProgress("");
    }
  };

  const canSubmit =
    !!projectId &&
    !ocrLoading &&
    ((type !== "audio" && type !== "video" && type !== "image" && text.trim().length > 20) ||
      ((type === "audio" || type === "video") && !!file) ||
      (type === "image" && !!file && text.trim().length >= 5));

  const process = async () => {
    if (!projectId) {
      setError("Please select a project first.");
      return;
    }

    if (type === "image") {
      if (!file) {
        setError("Please drop or select an image first.");
        return;
      }
      if (ocrLoading) return;
      if (!text || text.replace(/[^a-zA-Z0-9]/g, "").length < 5) {
        await handleImageUpload(file, projectId);
        return;
      }
      executeIngestion(text, fileName, file, "image");
      return;
    }

    const payloadText = type === "audio" || type === "video" ? (notes || undefined) : (text || undefined);
    executeIngestion(payloadText, fileName || null, file || null);
  };

  return (
    <div className="page-container">
      <PageTitle
        eyebrow="Conversation inbox"
        title="Turn talk into traction."
        description="Paste the messy middle. We’ll return the decisions, owners, and open questions worth carrying forward."
        action={<Link href="/projects" className="text-link" data-testid="link-inbox-projects">Choose a project</Link>}
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="inbox-compose">
          <div className="compose-head">
            <div className="inbox-icon"><Sparkles size={18} /></div>
            <div>
              <p className="eyebrow">New capture</p>
              <h2 className="section-title">What happened?</h2>
            </div>
          </div>

          <label className="field-label">
            Project
            <select
              className="me-input mt-2"
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setError(null);
              }}
              data-testid="select-ingest-project"
            >
              <option value="">Select a project</option>
              {projects.data?.map((project) => (
                <option value={project.id} key={project.id}>{project.name}</option>
              ))}
            </select>
          </label>

          <div className="input-type-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
            {inputTypes.map((item) => (
              <button
                key={item.key}
                className={`input-type ${type === item.key ? "selected" : ""}`}
                onClick={() => {
                  setType(item.key as typeof type);
                  setError(null);
                  if (item.key !== type) {
                    setFile(null);
                    setFileName("");
                    setOcrProgress("");
                  }
                }}
                data-testid={`button-input-type-${item.key}`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {type === item.key ? <Check size={14} className="ml-auto" /> : null}
              </button>
            ))}
          </div>

          {type === "audio" || type === "video" || type === "image" ? (
            <label className="file-drop" data-testid="dropzone-input-file">
              {ocrLoading ? (
                <Loader2 size={24} className="animate-spin text-primary" />
              ) : type === "image" ? (
                <ImageIcon size={24} />
              ) : (
                <UploadCloud size={24} />
              )}
              <span>
                {ocrLoading
                  ? (ocrProgress || "Reading image…")
                  : fileName || `Drop a ${type === "image" ? "photo or screenshot" : type + " file"} here`}
              </span>
              <small>
                {type === "image"
                  ? ocrLoading
                    ? "Tesseract.js OCR is reading text from the image..."
                    : "Image will be read using client-side OCR (Tesseract.js)."
                  : "File will be transcribed using Groq Whisper API."}
              </small>
              <input
                type="file"
                className="sr-only"
                accept={type === "image" ? "image/*" : type === "audio" ? "audio/*" : "video/*"}
                onChange={(e) => {
                  const selected = e.target.files?.[0] || null;
                  if (!selected) return;
                  if (type === "image") {
                    handleImageUpload(selected);
                  } else {
                    setFile(selected);
                    setFileName(selected.name);
                    setError(null);
                  }
                }}
                data-testid="input-ingest-file"
              />
            </label>
          ) : (
            <Textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError(null);
              }}
              className="min-h-60 mt-5"
              placeholder={type === "whatsapp" ? "Paste the WhatsApp thread…" : "Paste a transcript, voice note transcription, or meeting notes…"}
              data-testid="input-ingest-transcript"
            />
          )}

          {type === "audio" || type === "video" ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-28 mt-4"
              placeholder="Optional notes or additional context…"
              data-testid="input-ingest-context"
            />
          ) : null}

          {error ? (
            <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium" data-testid="inbox-error">
              {error}
            </div>
          ) : null}

          <div className="flex items-center justify-between mt-5">
            <span className="text-xs text-muted-foreground flex items-center gap-2">
              <StatusDot tone="green" />Private to your workspace
            </span>
            <Button
              onClick={process}
              loading={ocrLoading || ingest.isPending}
              disabled={!canSubmit && !(type === "image" && !!file && !ocrLoading)}
              data-testid="button-process-conversation"
            >
              <Send size={15} />
              {ocrLoading
                ? "Reading image…"
                : ingest.isPending
                ? type === "audio" || type === "video"
                  ? "Transcribing…"
                  : "Extracting…"
                : "Extract work"}
            </Button>
          </div>
        </Card>

        <Card className="inbox-result">
          <div className="section-header px-0 pt-0">
            <div>
              <p className="eyebrow">Execution brief</p>
              <h2 className="section-title">{result?.title || "Your structured signal appears here"}</h2>
            </div>
            {result ? <span className="processed-badge"><Check size={13} />Processed</span> : <FileAudio size={19} className="text-muted-foreground" />}
          </div>

          {!result ? (
            <div className="result-empty">
              <div className="result-lines"><span /><span /><span /></div>
              <h3>Less replay. More follow-through.</h3>
              <p>Decisions, tasks, reminders, and unresolved questions will land here together.</p>
            </div>
          ) : (
            <div className="space-y-6" data-testid="content-ingestion-result">
              <div className="result-meta">
                <span>{result.detectedLanguage}</span>
                <span>{result.durationLabel}</span>
                <span>{new Date(result.processedAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
              </div>

              {result.transcript ? (
                <div>
                  <p className="result-label">Transcript</p>
                  <p className="text-xs text-foreground bg-muted/30 p-3 rounded-md border border-border/50 font-mono leading-relaxed" data-testid="result-transcript">
                    {result.transcript}
                  </p>
                </div>
              ) : null}

              <div>
                <p className="result-label">Decisions</p>
                {result.decisions.length ? (
                  <ul className="result-list">
                    {result.decisions.map((item: string) => (
                      <li key={item}><Check size={14} />{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic py-1">No formal decisions recorded.</p>
                )}
              </div>

              <div>
                <p className="result-label">New tasks <span>{result.tasks.length}</span></p>
                {result.tasks.length ? (
                  <div className="result-task-list">
                    {result.tasks.map((task: IngestionResult["tasks"][number]) => (
                      <div className="result-task" key={task.id}>
                        <StatusDot tone={task.priority === "urgent" ? "red" : task.priority === "high" ? "yellow" : "blue"} />
                        <span>{task.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{task.assigneeName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic py-1">No actionable commitments with owners identified.</p>
                )}
              </div>

              {result.unresolvedQuestions.length ? (
                <div className="unresolved-block">
                  <p className="result-label">Needs an answer</p>
                  {result.unresolvedQuestions.map((item: string) => (
                    <p key={item}>? {item}</p>
                  ))}
                </div>
              ) : null}

              <Link href={`/projects/${projectId}`} className="me-button secondary w-full justify-center" data-testid="link-view-extracted-tasks">
                Review in project
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
