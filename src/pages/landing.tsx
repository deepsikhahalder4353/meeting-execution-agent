import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Sparkles,
  Mic,
  MessageSquare,
  Video,
  Camera,
  CheckCircle2,
  HelpCircle,
  Zap,
  Play,
  Pause,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  FileText,
  Clock,
  Check,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

type Stage = "input" | "processing" | "brief";

interface InputSample {
  id: string;
  type: "audio" | "chat";
  icon: typeof Mic;
  label: string;
  title: string;
  speakerMeta: string;
  rawText: string;
  detectedItems: {
    decisions: string[];
    tasks: { title: string; owner: string; initials: string; priority: string }[];
    questions: string[];
  };
}

const SAMPLES: InputSample[] = [
  {
    id: "audio-standup",
    type: "audio",
    icon: Mic,
    label: "Voice Note",
    title: "Sprint Sync & Beta Launch",
    speakerMeta: "Standup Recording · 02:45 · 3 speakers",
    rawText:
      "We agreed to launch the beta in November and keep pricing at $29 per month. Priya will handle the client onboarding flow, and Rohan will prepare the client demo slides. What is our target user goal for week one?",
    detectedItems: {
      decisions: [
        "Launch Beta release in November",
        "Maintain base subscription pricing at $29/mo",
      ],
      tasks: [
        {
          title: "Handle client onboarding flow",
          owner: "Priya Mendoza",
          initials: "PM",
          priority: "High Priority",
        },
        {
          title: "Prepare client demo slides",
          owner: "Rohan Kumar",
          initials: "RK",
          priority: "In Progress",
        },
      ],
      questions: ["What is our target user goal for week one?"],
    },
  },
  {
    id: "chat-sync",
    type: "chat",
    icon: MessageSquare,
    label: "WhatsApp Thread",
    title: "Architecture Conflict Review",
    speakerMeta: "Exported Chat · 14 messages · Engineering",
    rawText:
      "Ari confirmed we'll migrate the offline sync spec to SQLite. Marcus Chen will finish the conflict resolution benchmark by Thursday, and Elena will update the mobile navigation patterns.",
    detectedItems: {
      decisions: ["Migrate offline sync specification to SQLite database"],
      tasks: [
        {
          title: "Finish conflict resolution benchmark",
          owner: "Marcus Chen",
          initials: "MC",
          priority: "Urgent",
        },
        {
          title: "Update mobile navigation patterns",
          owner: "Elena Rostova",
          initials: "ER",
          priority: "Active",
        },
      ],
      questions: ["Will SQLite storage limits affect iOS background sync?"],
    },
  },
];

export default function LandingPage() {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("input");
  const [isPaused, setIsPaused] = useState(false);

  const sample = SAMPLES[activeSampleIndex];

  // Auto-advance loop through stages: input (4s) -> processing (1.6s) -> brief (5.4s)
  useEffect(() => {
    if (isPaused) return;

    let timer: NodeJS.Timeout;
    if (stage === "input") {
      timer = setTimeout(() => setStage("processing"), 4000);
    } else if (stage === "processing") {
      timer = setTimeout(() => setStage("brief"), 1600);
    } else if (stage === "brief") {
      timer = setTimeout(() => {
        setActiveSampleIndex((prev) => (prev + 1) % SAMPLES.length);
        setStage("input");
      }, 5400);
    }

    return () => clearTimeout(timer);
  }, [stage, isPaused]);

  // Subtle 3D tilt tracking on the demo card
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 24, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4.5, -4.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4.5, 4.5]);
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [20, 8]);
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 32px -6px rgba(15, 23, 42, 0.09), 0 0 0 1px rgba(0, 0, 0, 0.05)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="lp-light-root font-sans">
      <style>{`
        .lp-light-root {
          background-color: #faf9f6;
          color: #0f172a;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-x: hidden;
        }

        /* Top Navbar */
        .lp-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(250, 249, 246, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        .lp-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Hero Layout */
        .lp-hero-section {
          padding: 72px 24px 48px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 10;
        }
        .lp-badge-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: #fef9c3;
          border: 1px solid #fde047;
          color: #854d0e;
          font-family: var(--app-font-mono, monospace);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .lp-hero-title {
          font-family: var(--app-font-display, Syne, sans-serif);
          font-size: clamp(2.35rem, 4.5vw, 3.8rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 1.1;
          color: #0f172a;
          max-width: 860px;
        }
        .lp-highlight-yellow {
          background: linear-gradient(120deg, rgba(254, 240, 138, 0) 0%, rgba(254, 240, 138, 0.9) 15%, rgba(253, 224, 71, 0.8) 85%, rgba(254, 240, 138, 0) 100%);
          padding: 0 6px;
          border-radius: 6px;
          color: #0f172a;
        }
        .lp-hero-subtext {
          font-size: 17.5px;
          line-height: 1.6;
          color: #475569;
          max-width: 660px;
        }
        .lp-btn-primary {
          background-color: #f59e0b;
          color: #0f172a;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 12px;
          box-shadow: 0 10px 25px -4px rgba(245, 158, 11, 0.4);
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          font-size: 15px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .lp-btn-primary:hover {
          background-color: #fbbf24;
          box-shadow: 0 14px 30px -4px rgba(245, 158, 11, 0.55);
          transform: translateY(-2px);
        }
        .lp-btn-secondary {
          background-color: #ffffff;
          color: #1e293b;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 24px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          font-size: 15px;
        }
        .lp-btn-secondary:hover {
          background-color: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        /* Demo Section */
        .lp-demo-section {
          padding: 40px 24px 80px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 10;
        }
        .lp-stepper-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .lp-stepper-pills {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px;
          border-radius: 14px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }
        .lp-tab-btn {
          padding: 7px 16px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          background: transparent;
          color: #64748b;
        }
        .lp-tab-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
        }
        .lp-tab-btn.active.tab-accent {
          color: #b45309;
        }
        .lp-tab-btn:hover:not(.active) {
          color: #0f172a;
        }

        /* Light Card */
        .lp-light-card-outer {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(180deg, rgba(251, 191, 36, 0.45) 0%, rgba(226, 232, 240, 0.6) 40%, rgba(226, 232, 240, 0.2) 100%);
        }
        .lp-light-card-inner {
          border-radius: 23px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 22px 24px 18px;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.07);
        }
        .lp-morph-grid {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          align-items: start;
          width: 100%;
          min-height: 290px;
          padding: 16px 0;
        }
        .lp-morph-grid > * {
          grid-row: 1;
          grid-column: 1;
        }

        /* Waveform Animation */
        @keyframes wavePulseLight {
          0%, 100% {
            transform: scaleY(0.45);
          }
          50% {
            transform: scaleY(1);
          }
        }
        .lp-wave-bar-light {
          width: 4px;
          border-radius: 9999px;
          background: linear-gradient(to top, #d97706, #fbbf24);
          opacity: 0.9;
          transform-origin: bottom;
          animation: wavePulseLight 1.2s ease-in-out infinite;
        }

        /* Capture Inputs Grid */
        .lp-inputs-section {
          padding: 60px 24px 80px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 10;
        }
        .lp-inputs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 36px;
        }
        @media (min-width: 640px) {
          .lp-inputs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .lp-inputs-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .lp-input-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .lp-input-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 30px -8px rgba(15, 23, 42, 0.08);
          border-color: rgba(245, 158, 11, 0.35);
        }

        /* Final CTA Banner */
        .lp-cta-section {
          padding: 30px 24px 90px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 10;
        }
        .lp-cta-card {
          background: linear-gradient(135deg, #fef9c3 0%, #fef08a 45%, #fde047 100%);
          border: 1px solid #facc15;
          border-radius: 28px;
          padding: 56px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          box-shadow: 0 25px 50px -15px rgba(234, 179, 8, 0.3);
          position: relative;
          overflow: hidden;
        }
      `}</style>

      {/* Luminous Soft Ambient Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "1000px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(254, 240, 138, 0.35) 0%, rgba(253, 230, 138, 0.15) 50%, transparent 75%)",
            filter: "blur(70px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "35%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(254, 243, 199, 0.35) 0%, rgba(254, 215, 170, 0.12) 50%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "65%",
            left: "-8%",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(254, 240, 138, 0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Top Navbar */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <Link href="/" className="flex items-center gap-3">
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                backgroundColor: "#f59e0b",
                color: "#0f172a",
                fontWeight: 800,
                fontSize: "18px",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 2px 10px rgba(245, 158, 11, 0.4)",
              }}
            >
              ↗
            </span>
            <span style={{ fontFamily: "var(--app-font-display, Syne, sans-serif)", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.02em", color: "#0f172a" }}>
              meeting<span style={{ color: "#f59e0b" }}>.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: "#475569" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 12px",
                borderRadius: "9999px",
                backgroundColor: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                fontSize: "11px",
                fontFamily: "var(--app-font-mono, monospace)",
              }}
            >
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} />
              <span style={{ color: "#065f46", fontWeight: 600 }}>Agent Engine Online</span>
            </div>
            <a href="#demo" style={{ color: "#475569", textDecoration: "none" }} className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#inputs" style={{ color: "#475569", textDecoration: "none" }} className="hover:text-slate-900 transition-colors">Inputs</a>
            <Link href="/inbox" style={{ color: "#475569", textDecoration: "none" }} className="hover:text-slate-900 transition-colors">Inbox</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app"
              data-testid="link-nav-open-app"
              style={{
                backgroundColor: "#f59e0b",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: "13.5px",
                padding: "8px 18px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(245, 158, 11, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <span>Open Dashboard</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Continuous Single-Scroll Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* SECTION 1: HERO */}
        <section className="lp-hero-section">
          {/* Eyebrow Badge */}
          <div className="lp-badge-eyebrow" style={{ marginBottom: "20px" }}>
            <Sparkles size={13} style={{ color: "#d97706" }} />
            <span>Autonomous Meeting-to-Execution Agent</span>
          </div>

          {/* Headline */}
          <h1 className="lp-hero-title" style={{ marginBottom: "20px" }}>
            Turn messy meeting talk into{" "}
            <span className="lp-highlight-yellow">
              crystal-clear execution.
            </span>
          </h1>

          {/* Subtext */}
          <p className="lp-hero-subtext" style={{ marginBottom: "32px" }}>
            Stop losing decisions in voice memos, Slack threads, and unread transcripts.{" "}
            <strong style={{ color: "#0f172a", fontWeight: 600 }}>meeting.</strong> captures raw conversations,
            extracts every agreed decision, assigns clear action items with owners, and builds structured execution briefs in seconds.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", justifyContent: "center", marginBottom: "36px" }}>
            <Link
              href="/app"
              data-testid="link-landing-get-started"
              className="lp-btn-primary"
            >
              <span>Get Started</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/inbox"
              data-testid="link-landing-try-voice"
              className="lp-btn-secondary"
            >
              <Mic size={17} style={{ color: "#d97706" }} />
              <span>Try Ingestion Demo</span>
            </Link>
          </div>

          {/* Feature Badges Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap", maxWidth: "780px" }}>
            {[
              "100% Uncapped Extraction",
              "Multi-Person Task Splitting",
              "Groq Whisper-large-v3",
              "Browser-Native OCR",
            ].map((badge) => (
              <div
                key={badge}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontFamily: "var(--app-font-mono, monospace)",
                  color: "#475569",
                  padding: "5px 12px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
                }}
              >
                <Check size={13} style={{ color: "#16a34a", strokeWidth: 3 }} />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE TABBED DEMO */}
        <section id="demo" className="lp-demo-section">
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--app-font-mono, monospace)", color: "#b45309", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Interactive Storytelling
            </span>
            <h2 style={{ fontFamily: "var(--app-font-display, Syne, sans-serif)", fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 700, color: "#0f172a", margin: "6px 0 8px" }}>
              From chaotic discussion to structured briefs
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", margin: 0, maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
              Click through each phase to inspect how raw conversation is classified, assigned, and structured.
            </p>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="lp-stepper-wrap">
            <div className="lp-stepper-pills">
              {(["input", "processing", "brief"] as Stage[]).map((s, idx) => {
                const titles = ["1. Raw Input", "2. AI Parsing", "3. Execution Brief"];
                const isActive = stage === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      setStage(s);
                      setIsPaused(true);
                    }}
                    className={`lp-tab-btn ${isActive ? "active tab-accent" : ""}`}
                  >
                    {titles[idx]}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsPaused((p) => !p)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                color: "#475569",
                fontSize: "11.5px",
                fontFamily: "var(--app-font-mono, monospace)",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
              }}
              title={isPaused ? "Resume auto-advance" : "Pause auto-advance"}
            >
              {isPaused ? <Play size={11} style={{ color: "#d97706" }} /> : <Pause size={11} />}
              <span>{isPaused ? "Paused" : "Auto-cycle"}</span>
            </button>
          </div>

          {/* Morphing Demo Card with Subtle 3D Tilt */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsPaused(true)}
            style={{
              transformStyle: "preserve-3d",
              transformPerspective: 1000,
              rotateX,
              rotateY,
              boxShadow,
            }}
            className="lp-light-card-outer cursor-default relative"
          >
            <div className="lp-light-card-inner">
              
              {/* Card Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "9px",
                      backgroundColor: "#fef3c7",
                      border: "1px solid #fde68a",
                      color: "#b45309",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <sample.icon size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", fontFamily: "var(--app-font-mono, monospace)", color: "#64748b", margin: 0, lineHeight: 1 }}>
                      {sample.speakerMeta}
                    </p>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", margin: "4px 0 0 0", lineHeight: 1.2 }}>
                      {sample.title}
                    </h3>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "var(--app-font-mono, monospace)",
                      fontWeight: 600,
                      padding: "3px 9px",
                      borderRadius: "9999px",
                      backgroundColor: stage === "brief" ? "#dcfce7" : stage === "processing" ? "#e0f2fe" : "#fef3c7",
                      color: stage === "brief" ? "#166534" : stage === "processing" ? "#0369a1" : "#92400e",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {stage === "input" ? "Unstructured" : stage === "processing" ? "Analyzing" : "Structured"}
                  </span>
                </div>
              </div>

              {/* Animated Card Body with Grid Stacking */}
              <div className="lp-morph-grid">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`${stage}-${activeSampleIndex}`}
                    initial={{ opacity: 0, y: 10, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.99 }}
                    transition={{ duration: 0.25 }}
                    style={{ width: "100%" }}
                  >
                    {/* STAGE 1: RAW INPUT */}
                    {stage === "input" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {/* Audio Waveform Bar */}
                        <div
                          style={{
                            padding: "10px 14px",
                            borderRadius: "12px",
                            backgroundColor: "#fffbeb",
                            border: "1px solid #fef3c7",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              backgroundColor: "#fde68a",
                              color: "#b45309",
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Mic size={14} />
                          </div>
                          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "3px", height: "24px" }}>
                            {[18, 35, 60, 40, 85, 95, 45, 30, 75, 90, 65, 45, 80, 55, 30, 70, 40, 20].map((h, i) => (
                              <span
                                key={i}
                                className="lp-wave-bar-light"
                                style={{
                                  height: `${h}%`,
                                  animationDelay: `${(i * 0.06).toFixed(2)}s`,
                                }}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: "11px", fontFamily: "var(--app-font-mono, monospace)", color: "#b45309", fontWeight: 700, flexShrink: 0 }}>
                            02:14
                          </span>
                        </div>

                        {/* Raw Speech Bubble */}
                        <div
                          style={{
                            padding: "16px",
                            borderRadius: "14px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <p style={{ fontSize: "10.5px", fontFamily: "var(--app-font-mono, monospace)", color: "#64748b", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                            Raw Transcribed Speech:
                          </p>
                          <p style={{ fontSize: "13.5px", color: "#1e293b", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                            &ldquo;{sample.rawText}&rdquo;
                          </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11.5px", color: "#64748b" }}>
                          <span style={{ fontFamily: "var(--app-font-mono, monospace)" }}>Input: High fidelity audio</span>
                          <span style={{ color: "#d97706", display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--app-font-mono, monospace)", fontWeight: 600 }}>
                            Extracting in a moment <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    )}

                    {/* STAGE 2: AI PARSING */}
                    {stage === "processing" && (
                      <div style={{ padding: "8px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "14px",
                            backgroundColor: "#fef3c7",
                            border: "1px solid #fde68a",
                            display: "grid",
                            placeItems: "center",
                            color: "#d97706",
                            boxShadow: "0 4px 14px rgba(245, 158, 11, 0.2)",
                          }}
                        >
                          <Zap size={24} />
                        </div>

                        <div>
                          <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                            Extracting Decisions & Actions
                          </h4>
                          <p style={{ fontSize: "12px", color: "#64748b", fontFamily: "var(--app-font-mono, monospace)", margin: "4px 0 0 0" }}>
                            Classifying intent · Assigning owners · Splitting tasks
                          </p>
                        </div>

                        {/* Pulsing Tag Chips */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "7px", width: "100%", maxWidth: "340px", paddingTop: "6px" }}>
                          <div
                            style={{
                              padding: "7px 12px",
                              borderRadius: "9px",
                              backgroundColor: "#ecfdf5",
                              border: "1px solid #a7f3d0",
                              color: "#065f46",
                              fontSize: "11.5px",
                              fontFamily: "var(--app-font-mono, monospace)",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <CheckCircle2 size={13} style={{ color: "#059669" }} />
                            <span>Decision: Launch Beta in November</span>
                          </div>

                          <div
                            style={{
                              padding: "7px 12px",
                              borderRadius: "9px",
                              backgroundColor: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              color: "#1e40af",
                              fontSize: "11.5px",
                              fontFamily: "var(--app-font-mono, monospace)",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
                            <span>Task: Onboarding flow → Priya</span>
                          </div>

                          <div
                            style={{
                              padding: "7px 12px",
                              borderRadius: "9px",
                              backgroundColor: "#fffbeb",
                              border: "1px solid #fde68a",
                              color: "#92400e",
                              fontSize: "11.5px",
                              fontFamily: "var(--app-font-mono, monospace)",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <HelpCircle size={13} style={{ color: "#d97706" }} />
                            <span>Open Question: Target user goal</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STAGE 3: STRUCTURED EXECUTION BRIEF */}
                    {stage === "brief" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {/* Section 1: Key Decisions */}
                        <div
                          style={{
                            padding: "10px 12px",
                            borderRadius: "11px",
                            backgroundColor: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10.5px", fontFamily: "var(--app-font-mono, monospace)", color: "#166534", fontWeight: 700, textTransform: "uppercase", marginBottom: "5px" }}>
                            <CheckCircle2 size={13} style={{ color: "#16a34a" }} />
                            <span>Key Decisions Made</span>
                          </div>
                          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "3px" }}>
                            {sample.detectedItems.decisions.map((dec, i) => (
                              <li key={i} style={{ fontSize: "12.5px", color: "#0f172a", fontWeight: 500, display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
                                <span>{dec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Section 2: Assigned Action Items */}
                        <div
                          style={{
                            padding: "10px 12px",
                            borderRadius: "11px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10.5px", fontFamily: "var(--app-font-mono, monospace)", color: "#b45309", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
                            <Layers size={13} style={{ color: "#d97706" }} />
                            <span>Assigned Action Items</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            {sample.detectedItems.tasks.map((task, i) => (
                              <div
                                key={i}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "6px 10px",
                                  borderRadius: "8px",
                                  backgroundColor: "#ffffff",
                                  border: "1px solid #e2e8f0",
                                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                                  <span
                                    style={{
                                      width: "22px",
                                      height: "22px",
                                      borderRadius: "6px",
                                      backgroundColor: "#fef3c7",
                                      color: "#b45309",
                                      fontSize: "10px",
                                      fontWeight: 700,
                                      display: "grid",
                                      placeItems: "center",
                                      flexShrink: 0,
                                    }}
                                  >
                                    {task.initials}
                                  </span>
                                  <div style={{ minWidth: 0 }}>
                                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#0f172a", margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                      {task.title}
                                    </p>
                                    <p style={{ fontSize: "10px", color: "#64748b", fontFamily: "var(--app-font-mono, monospace)", margin: 0 }}>
                                      {task.owner}
                                    </p>
                                  </div>
                                </div>
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontFamily: "var(--app-font-mono, monospace)",
                                    padding: "2px 7px",
                                    borderRadius: "9999px",
                                    backgroundColor: "#f1f5f9",
                                    color: "#475569",
                                    fontWeight: 600,
                                    flexShrink: 0,
                                  }}
                                >
                                  {task.priority}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Section 3: Open Question */}
                        {sample.detectedItems.questions.length > 0 && (
                          <div
                            style={{
                              padding: "8px 12px",
                              borderRadius: "11px",
                              backgroundColor: "#fffbeb",
                              border: "1px solid #fde68a",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "8px",
                            }}
                          >
                            <HelpCircle size={14} style={{ color: "#d97706", flexShrink: 0, marginTop: "2px" }} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <span style={{ fontFamily: "var(--app-font-mono, monospace)", fontSize: "10px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", display: "block" }}>
                                Open Question
                              </span>
                              <p style={{ fontSize: "12px", color: "#78350f", margin: "2px 0 0 0", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontWeight: 500 }}>
                                {sample.detectedItems.questions[0]}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Card Footer */}
              <div style={{ paddingTop: "14px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", marginTop: "auto" }}>
                <span style={{ fontSize: "11.5px", fontFamily: "var(--app-font-mono, monospace)", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={14} style={{ color: "#16a34a" }} />
                  <span>Ready for Execution</span>
                </span>

                <Link
                  href="/app"
                  data-testid="link-landing-card-open"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#b45309",
                    textDecoration: "none",
                  }}
                >
                  <span>Explore in App</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>

          <p style={{ textAlign: "center", fontSize: "11.5px", fontFamily: "var(--app-font-mono, monospace)", color: "#94a3b8", marginTop: "16px" }}>
            Hover or move cursor over the card to feel the 3D depth tilt
          </p>
        </section>

        {/* SECTION 3: WHAT IT CAPTURES */}
        <section id="inputs" className="lp-inputs-section">
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--app-font-mono, monospace)", color: "#b45309", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Input Agnostic
            </span>
            <h2 style={{ fontFamily: "var(--app-font-display, Syne, sans-serif)", fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 700, color: "#0f172a", margin: "6px 0 8px" }}>
              Capture conversations from anywhere you work
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", margin: 0, maxWidth: "580px", marginLeft: "auto", marginRight: "auto" }}>
              No bot invites needed. Drop in recorded audio, chat exports, video links, or whiteboard photos.
            </p>
          </div>

          <div className="lp-inputs-grid">
            {/* Input 1: Voice Notes */}
            <div className="lp-input-card">
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: "#fef3c7",
                  border: "1px solid #fde68a",
                  color: "#d97706",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Mic size={20} />
              </div>
              <div>
                <span style={{ fontSize: "10px", fontFamily: "var(--app-font-mono, monospace)", color: "#b45309", fontWeight: 700, textTransform: "uppercase" }}>
                  Groq Whisper v3
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: "4px 0 6px" }}>
                  Voice Memos & Audio
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                  Upload MP3, WAV, or M4A files. Fast speech-to-text handles accents, technical jargon, and multi-speaker pauses.
                </p>
              </div>
            </div>

            {/* Input 2: Chat & WhatsApp */}
            <div className="lp-input-card">
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  color: "#059669",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <MessageSquare size={20} />
              </div>
              <div>
                <span style={{ fontSize: "10px", fontFamily: "var(--app-font-mono, monospace)", color: "#047857", fontWeight: 700, textTransform: "uppercase" }}>
                  Text & Export Logs
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: "4px 0 6px" }}>
                  WhatsApp & Slack Threads
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                  Paste messy multi-person chat logs. Separates simultaneous conversations and attributes actions to each individual.
                </p>
              </div>
            </div>

            {/* Input 3: Video Calls */}
            <div className="lp-input-card">
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  color: "#2563eb",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Video size={20} />
              </div>
              <div>
                <span style={{ fontSize: "10px", fontFamily: "var(--app-font-mono, monospace)", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase" }}>
                  Audio Track Demux
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: "4px 0 6px" }}>
                  Zoom & Meet Videos
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                  Drop MP4 or WebM recordings directly. Extracts the audio channel server-side for lightning-fast Whisper transcription.
                </p>
              </div>
            </div>

            {/* Input 4: Whiteboards & OCR */}
            <div className="lp-input-card">
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: "#f5f3ff",
                  border: "1px solid #ddd6fe",
                  color: "#7c3aed",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Camera size={20} />
              </div>
              <div>
                <span style={{ fontSize: "10px", fontFamily: "var(--app-font-mono, monospace)", color: "#6d28d9", fontWeight: 700, textTransform: "uppercase" }}>
                  Tesseract.js In-Browser
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: "4px 0 6px" }}>
                  Whiteboard Photos & Slides
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                  Upload phone snapshots or screenshots. Client-side OCR reads text and diagrams with zero external API fees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: FINAL CTA BANNER */}
        <section className="lp-cta-section">
          <div className="lp-cta-card">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                fontSize: "11px",
                fontFamily: "var(--app-font-mono, monospace)",
                fontWeight: 700,
                color: "#78350f",
                textTransform: "uppercase",
              }}
            >
              <Sparkles size={12} style={{ color: "#b45309" }} />
              <span>Ready for accountable teams</span>
            </span>

            <h2
              style={{
                fontFamily: "var(--app-font-display, Syne, sans-serif)",
                fontSize: "clamp(2rem, 3.8vw, 3rem)",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                maxWidth: "680px",
              }}
            >
              Turn every meeting into completed work.
            </h2>

            <p style={{ fontSize: "16px", color: "#451a03", maxWidth: "560px", margin: 0, lineHeight: 1.6 }}>
              No more forgotten action items or ambiguous meeting minutes. Start turning your next discussion into structured momentum today.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
              <Link
                href="/app"
                data-testid="link-cta-open-app"
                style={{
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "15px",
                  padding: "13px 28px",
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                  boxShadow: "0 10px 25px -4px rgba(15, 23, 42, 0.25)",
                  transition: "all 0.2s ease",
                }}
                className="hover:bg-slate-800 hover:-translate-y-0.5"
              >
                <span>Open Dashboard</span>
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/inbox"
                data-testid="link-cta-try-inbox"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: "15px",
                  padding: "13px 24px",
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  transition: "all 0.2s ease",
                }}
                className="hover:bg-amber-50 hover:-translate-y-0.5"
              >
                <Mic size={16} style={{ color: "#d97706" }} />
                <span>Launch Ingestion Sandbox</span>
              </Link>
            </div>

            <span style={{ fontSize: "11.5px", fontFamily: "var(--app-font-mono, monospace)", color: "#78350f", opacity: 0.85 }}>
              No credit card required · Free client-side OCR · Groq powered
            </span>
          </div>
        </section>

      </main>

      {/* Clean Minimalist Footer */}
      <footer style={{ borderTop: "1px solid rgba(0, 0, 0, 0.06)", padding: "28px 0", fontSize: "12.5px", color: "#64748b", fontFamily: "var(--app-font-mono, monospace)", backgroundColor: "#f8fafc" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#0f172a", fontWeight: 700, fontFamily: "var(--app-font-display, Syne, sans-serif)", fontSize: "15px" }}>
              meeting<span style={{ color: "#f59e0b" }}>.</span>
            </span>
            <span style={{ color: "rgba(0, 0, 0, 0.15)" }}>|</span>
            <span>Turning messy meeting conversations into accountable work.</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link href="/app" style={{ color: "#475569", textDecoration: "none" }} className="hover:text-slate-900 transition-colors">Overview</Link>
            <Link href="/inbox" style={{ color: "#475569", textDecoration: "none" }} className="hover:text-slate-900 transition-colors">Inbox</Link>
            <Link href="/workload" style={{ color: "#475569", textDecoration: "none" }} className="hover:text-slate-900 transition-colors">Workload</Link>
            <Link href="/time" style={{ color: "#475569", textDecoration: "none" }} className="hover:text-slate-900 transition-colors">Time</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
