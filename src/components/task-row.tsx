import { CalendarDays, Check, Circle, Clock3, MoreHorizontal, Play, UserRound } from "lucide-react";
import { useState } from "react";
import type { Task } from "@workspace/api-client-react";
import { Avatar, Button, Select, StatusDot } from "./ui-primitives";

const priorityTone: Record<string, string> = { urgent: "priority-urgent", high: "priority-high", medium: "priority-medium", low: "priority-low" };
const statusLabel: Record<string, string> = { todo: "To do", in_progress: "In progress", done: "Done" };

export function TaskRow({ task, members, onStatus, onDelegate, onStart, compact = false }: { task: Task; members?: { id: string; name: string; initials: string }[]; onStatus?: (status: "todo" | "in_progress" | "done") => void; onDelegate?: (id: string) => void; onStart?: () => void; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return <div className={`task-row ${task.status === "done" ? "is-done" : ""} ${compact ? "compact" : ""}`} data-testid={`row-task-${task.id}`}>
    <button className="task-check" onClick={() => onStatus?.(task.status === "done" ? "todo" : "done")} aria-label={`Mark ${task.title} ${task.status === "done" ? "to do" : "done"}`} data-testid={`button-toggle-task-${task.id}`}>{task.status === "done" ? <Check size={14} /> : <Circle size={15} />}</button>
    <div className="min-w-0 flex-1">
      <div className="flex items-start gap-2 flex-wrap">
        <button className="task-title text-left" onClick={() => setExpanded(!expanded)} data-testid={`button-expand-task-${task.id}`}>{task.title}</button>
        <span className={`priority-pill ${priorityTone[task.priority]}`}><StatusDot tone={task.priority === "urgent" ? "red" : task.priority === "high" ? "yellow" : "blue"} />{task.priority}</span>
      </div>
      <div className="task-meta">
        <span><UserRound size={12} />{task.assigneeName}</span>
        {task.deadline ? <span className={new Date(task.deadline) < new Date() && task.status !== "done" ? "text-destructive" : ""}><CalendarDays size={12} />{new Date(task.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span> : null}
        <span className="source-label">{task.sourceLabel || task.source}</span>
      </div>
      {expanded ? <div className="task-detail"><p>{task.description || "No additional context was added."}</p>{task.tags?.length ? <div className="flex flex-wrap gap-1 mt-3">{task.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div> : null}</div> : null}
    </div>
    {!compact ? <div className="hidden sm:flex items-center gap-2">
      {members?.length ? <Select value={task.assigneeId} onChange={e => onDelegate?.(e.target.value)} className="task-assignee-select" aria-label="Assign task" data-testid={`select-assignee-${task.id}`}>{members.map(member => <option value={member.id} key={member.id}>{member.name}</option>)}</Select> : <Avatar initials={task.assigneeInitials} />}
      <Select value={task.status} onChange={e => onStatus?.(e.target.value as "todo" | "in_progress" | "done")} className="task-status-select" aria-label="Task status" data-testid={`select-status-${task.id}`}>{Object.entries(statusLabel).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Select>
      {onStart ? <Button className="icon-button subtle" onClick={onStart} title="Start timer" data-testid={`button-start-task-${task.id}`}><Play size={13} /></Button> : null}
    </div> : <div className="task-compact-state">{task.status === "done" ? "Done" : task.status === "in_progress" ? <><Clock3 size={12} />Active</> : "Open"}</div>}
    {!compact ? <button className="icon-button subtle hidden sm:block" onClick={() => setExpanded(!expanded)} data-testid={`button-task-menu-${task.id}`}><MoreHorizontal size={16} /></button> : null}
  </div>;
}
