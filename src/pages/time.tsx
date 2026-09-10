import { Check, Clock3, Pause, Play, TimerReset } from "lucide-react";
import { useState } from "react";
import { getListTimeEntriesQueryKey, useListTasks, useListTimeEntries, useStartTimeEntry, useStopTimeEntry } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, PageTitle, QueryState, Select } from "../components/ui-primitives";

export default function TimePage() {
  const client = useQueryClient();
  const entries = useListTimeEntries();
  const tasks = useListTasks({ status: "in_progress" });
  const start = useStartTimeEntry();
  const stop = useStopTimeEntry();
  const [taskId, setTaskId] = useState("");
  const active = entries.data?.find(entry => entry.active);
  const total = entries.data?.reduce((sum, entry) => sum + entry.durationMinutes, 0) || 0;
  const refresh = () => client.invalidateQueries({ queryKey: getListTimeEntriesQueryKey() });
  const startTimer = () => { if (!taskId) return; start.mutate({ data: { taskId, memberId: "current-member" } }, { onSuccess: refresh }); };
  return <div className="page-container"><PageTitle eyebrow="Time & focus" title="Make the work visible." description="A lightweight record of where your attention went — by task, not by performance." />
    <Card className={`timer-card ${active ? "is-active" : ""}`}><div className="timer-display"><span className="timer-kicker">{active ? "In focus now" : "Ready when you are"}</span><strong>{active ? `${Math.floor(active.durationMinutes / 60).toString().padStart(2, "0")}:${(active.durationMinutes % 60).toString().padStart(2, "0")}` : "00:00"}</strong><span>{active?.taskTitle || "Choose a task to begin a work session"}</span></div><div className="timer-controls">{active ? <Button className="stop-button" onClick={() => stop.mutate({ entryId: active.id }, { onSuccess: refresh })} loading={stop.isPending} data-testid="button-stop-timer"><Pause size={16} />Stop session</Button> : <><Select value={taskId} onChange={e => setTaskId(e.target.value)} aria-label="Select task for timer" data-testid="select-time-task"><option value="">Choose an active task</option>{tasks.data?.map(task => <option key={task.id} value={task.id}>{task.title}</option>)}</Select><Button onClick={startTimer} loading={start.isPending} disabled={!taskId} data-testid="button-start-timer"><Play size={15} />Start session</Button></>}</div></Card>
    <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr] mt-6"><Card><div className="flex items-center gap-3 mb-5"><span className="stat-icon blue"><TimerReset size={17} /></span><div><p className="eyebrow">This period</p><h2 className="section-title">{(total / 60).toFixed(1)} hours logged</h2></div></div><div className="time-bar"><span style={{ width: `${Math.min(100, total / 4)}%` }} /></div><p className="text-xs text-muted-foreground mt-3">Keep a gentle record, not a stopwatch on your day.</p></Card><Card className="p-0 overflow-hidden"><div className="section-header"><div><p className="eyebrow">By task</p><h2 className="section-title">Recent sessions</h2></div><Clock3 size={18} className="text-muted-foreground" /></div><QueryState loading={entries.isLoading} error={entries.isError} empty={!entries.data?.length} onRetry={() => entries.refetch()}><div>{entries.data?.map(entry => <div className="time-entry" key={entry.id} data-testid={`row-time-entry-${entry.id}`}><span className={`entry-state ${entry.active ? "active" : ""}`}>{entry.active ? <Play size={11} /> : <Check size={11} />}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold truncate">{entry.taskTitle}</p><p className="text-xs text-muted-foreground">{entry.memberName} · {new Date(entry.startedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p></div><span className="font-mono text-sm">{Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m</span></div>)}</div></QueryState></Card></div>
  </div>;
}
