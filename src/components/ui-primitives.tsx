import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from "framer-motion";

export function Button({ children, className = "", loading, "data-testid": testId, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; "data-testid"?: string }) {
  return <button {...props} className={`me-button ${className}`} disabled={loading || props.disabled} data-testid={testId}>
    {loading ? <LoaderCircle size={16} className="animate-spin" /> : null}{children}
  </button>;
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`me-input ${className}`} />;
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`me-input ${className}`} />;
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`me-input resize-none ${className}`} />;
}

export interface TiltCardProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 6,
  style,
  onMouseMove,
  onMouseLeave,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  // Normalized cursor coordinates: -0.5 to 0.5 (0 is center)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth, organic responsiveness without jitter
  const springConfig = { stiffness: 260, damping: 24, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Max ~6deg tilt (subtle, not gimmicky)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Soft dynamic shadow that shifts direction opposite the tilt to fake depth
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [18, 6]);
  const shadowBlur = useTransform(smoothY, (v) => 22 + Math.abs(v) * 6);

  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px ${shadowBlur}px -2px hsl(225 28% 18% / 0.08), 0 2px 6px -1px hsl(225 28% 18% / 0.04)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current || e.currentTarget;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    mouseX.set(0);
    mouseY.set(0);
    onMouseLeave?.(e);
  };

  return (
    <motion.section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
        rotateX,
        rotateY,
        boxShadow,
        willChange: "transform, box-shadow",
        ...style,
      }}
      className={`me-card ${className}`}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  maxTilt?: number;
}

export function Card({ children, className = "", tilt = false, maxTilt = 6, ...props }: CardProps) {
  if (tilt) {
    return (
      <TiltCard className={className} maxTilt={maxTilt} {...(props as HTMLMotionProps<"section">)}>
        {children}
      </TiltCard>
    );
  }
  return <section {...props} className={`me-card ${className}`}>{children}</section>;
}

export function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return <span className={`me-avatar ${className}`} data-testid={`avatar-${initials}`}>{initials}</span>;
}

export function StatusDot({ tone = "yellow" }: { tone?: "yellow" | "green" | "red" | "blue" }) {
  return <span className={`me-dot me-dot-${tone}`} aria-hidden="true" />;
}

export function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
    <div>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="page-title">{title}</h1>
      {description ? <p className="page-description">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`me-skeleton ${className}`} aria-label="Loading" />;
}

export function QueryState({ loading, error, empty, onRetry, children }: { loading?: boolean; error?: boolean; empty?: boolean; onRetry?: () => void; children: ReactNode }) {
  if (loading) return <div className="space-y-3"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-11/12" /><Skeleton className="h-20 w-10/12" /></div>;
  if (error) return <div className="me-empty"><StatusDot tone="red" /><h3>Couldn’t load this view</h3><p>Give it another try. Your workspace is still safe.</p><Button onClick={onRetry} data-testid="button-retry">Retry</Button></div>;
  if (empty) return <div className="me-empty"><div className="me-empty-mark">—</div><h3>Nothing here yet</h3><p>When your team has something to act on, it will show up here.</p></div>;
  return children;
}
