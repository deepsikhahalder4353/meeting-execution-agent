import { ArrowLeft, ChevronRight, Filter, MessageSquareText, Plus, UsersRound } from "lucide-react";
import { Link, useParams } from "wouter";
import { useMemo, useState } from "react";
import { getGetProjectQueryKey, getListTasksQueryKey, useCreateTask, useDelegateTask, useGetProject, useListTasks, useUpdateTask } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, Input, PageTitle, QueryState, Select, Textarea, Avatar } from "../components/ui-primitives";
import { TaskRow } from "../components/task-row";

export default function ProjectDetailPage() {
  const { projectId = "" } = useParams<{ projectId: string }>();
  const client = useQueryClient();
  const project = useGetProject(projectId, { query: { queryKey: getGetProjectQueryKey(projectId), enabled: !!projectId } });
  const tasks = useListTasks({ projectId });
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const delegate = useDelegateTask();
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const visible = useMemo(() => tasks.data?.filter(task => filter === "all" || task.status === filter), [tasks.data, filter]);
  const refresh = () => { client.invalidateQueries({ queryKey: getListTasksQueryKey({ projectId }) }); client.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) }); };
  const patchStatus = (taskId: string, status: "todo" | "in_progress" | "done") => updateTask.mutate({ taskId, data: { status } }, { onSuccess: refresh });
  const patchAssignee = (taskId: string, assigneeId: string) => delegate.mutate({ taskId, data: { assigneeId } }, { onSuccess: refresh });
  const submit = () => { if (!title.trim()) return; createTask.mutate({ data: { projectId, title, description, status: "todo", priority: "medium", assigneeId: project.data?.members?.[0]?.id || "", tags: [] } }, { onSuccess: () => { setTitle(""); setDescription(""); setShowForm(false); refresh(); } }); };
  return <div className="page-container"><Link href="/projects" className="back-link mb-5" data-testid="link-back-projects"><ArrowLeft size={15} />All projects</Link>
    <QueryState loading={project.isLoading} error={project.isError} onRetry={() => project.refetch()}>{project.data ? <PageTitle eyebrow="Project workspace" title={project.data.name} description={project.data.description} action={<Button onClick={() => setShowForm(!showForm)} data-testid="button-add-task"><Plus size={16} />Add task</Button>} /> : null}</QueryState>
    {showForm ? <Card className="task-form mb-6"><p className="eyebrow">New commitment</p><div className="grid gap-3 sm:grid-cols-[1fr_0.7fr]"><Input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to happen?" data-testid="input-new-task-title" /><Select data-testid="select-new-task-assignee"><option>Assign after creating</option></Select></div><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add context, links, or the definition of done…" className="mt-3" data-testid="input-new-task-description" /><div className="flex justify-end gap-2 mt-3"><Button className="secondary" onClick={() => setShowForm(false)} data-testid="button-cancel-task">Cancel</Button><Button onClick={submit} loading={createTask.isPending} data-testid="button-save-task">Save task</Button></div></Card> : null}
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <Card className="p-0 overflow-hidden"><div className="section-header"><div><p className="eyebrow">Execution board</p><h2 className="section-title">{visible?.length || 0} tasks in motion</h2></div><div className="filter-wrap"><Filter size={14} /><Select value={filter} onChange={e => setFilter(e.target.value)} data-testid="select-task-filter"><option value="all">All tasks</option><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></Select></div></div><QueryState loading={tasks.isLoading} error={tasks.isError} empty={!visible?.length} onRetry={() => tasks.refetch()}><div>{visible?.map(task => <TaskRow key={task.id} task={task} members={project.data?.members} onStatus={status => patchStatus(task.id, status)} onDelegate={id => patchAssignee(task.id, id)} />)}</div></QueryState></Card>
      <div className="space-y-6"><Card><div className="flex items-center justify-between mb-5"><div><p className="eyebrow">Team context</p><h2 className="section-title">People in this room</h2></div><UsersRound size={18} className="text-muted-foreground" /></div><div className="space-y-4">{project.data?.members?.map(member => <div className="flex items-center gap-3" key={member.id} data-testid={`member-${member.id}`}><Avatar initials={member.initials} /><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{member.name}</p><p className="text-xs text-muted-foreground truncate">{member.role}</p></div><span className="presence-dot" /></div>)}</div></Card><Card className="context-card"><MessageSquareText size={20} /><p className="eyebrow mt-5">Source trail</p><h3>Work carries its why.</h3><p>Tasks extracted from conversations keep a link back to the moment they were agreed.</p><Link href="/inbox" className="text-link mt-4" data-testid="link-project-inbox">Review conversation inbox <ChevronRight size={14} /></Link></Card></div>
    </div>
  </div>;
}
