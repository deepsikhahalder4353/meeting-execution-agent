import { ArrowUpRight, CheckCircle2, Clock3, ListTodo, Plus, Sparkles, TimerReset, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useGetDashboard, useListActivity, useListTasks, useListProjects } from "@workspace/api-client-react";
import { Card, PageTitle, QueryState, Button, Avatar, StatusDot } from "../components/ui-primitives";
import { TaskRow } from "../components/task-row";

function Stat({ label, value, detail, icon: Icon, accent }: { label: string; value: string | number; detail: string; icon: typeof ListTodo; accent?: string }) {
  return <Card tilt className={`stat-card ${accent || ""}`}><div className="flex items-center justify-between"><span className="stat-icon"><Icon size={17} /></span><span className="stat-detail">{detail}</span></div><p className="stat-value">{value}</p><p className="stat-label">{label}</p></Card>;
}

export default function Overview() {
  const dashboard = useGetDashboard();
  const tasks = useListTasks({ status: "in_progress" });
  const activity = useListActivity();
  const projects = useListProjects();
  const projectName = projects.data?.find(project => project.id === dashboard.data?.currentProjectId)?.name || "your workspace";
  return <div className="page-container">
    <PageTitle eyebrow="Tuesday, October 15" title="Good morning, Ari." description={`Here’s the pulse of ${projectName}. Keep the next clear step moving.`} action={<Link href="/inbox" className="me-button primary" data-testid="link-ingest-conversation"><Plus size={16} />Capture a conversation</Link>} />
    <QueryState loading={dashboard.isLoading} error={dashboard.isError} onRetry={() => dashboard.refetch()}>{dashboard.data ? <div className="stats-grid mb-8">
      <Stat label="Active tasks" value={dashboard.data.activeTasks} detail={`${dashboard.data.delegatedCount} delegated`} icon={ListTodo} />
      <Stat label="Due this week" value={dashboard.data.dueSoon} detail="Needs a look" icon={TimerReset} accent="stat-warm" />
      <Stat label="Completed this week" value={dashboard.data.completedThisWeek} detail={`${dashboard.data.completionRate}% completion`} icon={CheckCircle2} accent="stat-green" />
      <Stat label="Hours logged" value={dashboard.data.hoursLogged.toFixed(1)} detail="Across active work" icon={Clock3} accent="stat-blue" />
    </div> : null}</QueryState>
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr]">
      <Card className="p-0 overflow-hidden">
        <div className="section-header"><div><p className="eyebrow">Keep momentum</p><h2 className="section-title">Your active work</h2></div><Link href="/projects" className="text-link" data-testid="link-view-projects">View projects <ArrowUpRight size={14} /></Link></div>
        <QueryState loading={tasks.isLoading} error={tasks.isError} empty={!tasks.data?.length} onRetry={() => tasks.refetch()}><div>{tasks.data?.slice(0, 5).map(task => <TaskRow task={task} compact key={task.id} />)}</div></QueryState>
      </Card>
      <Card className="p-0 overflow-hidden">
        <div className="section-header"><div><p className="eyebrow">Team signal</p><h2 className="section-title">Recent activity</h2></div><TrendingUp size={18} className="text-muted-foreground" /></div>
        <QueryState loading={activity.isLoading} error={activity.isError} empty={!activity.data?.length} onRetry={() => activity.refetch()}><div className="activity-list">{activity.data?.slice(0, 5).map(item => <div className="activity-item" key={item.id} data-testid={`activity-${item.id}`}><Avatar initials={item.actorInitials} /><div className="min-w-0"><p className="text-sm"><strong>{item.actorName}</strong> {item.action}</p><p className="text-xs text-muted-foreground truncate">{item.detail}</p><time>{new Date(item.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</time></div><StatusDot tone={item.tone === "green" ? "green" : item.tone === "amber" ? "yellow" : item.tone === "purple" ? "blue" : "blue"} /></div>)}</div></QueryState>
      </Card>
    </div>
    <Card className="momentum-card mt-6"><div className="momentum-orb"><Sparkles size={22} /></div><div><p className="eyebrow">A small nudge</p><h2 className="font-display text-xl">One clear next step beats a perfect plan.</h2><p className="text-sm text-muted-foreground mt-1">Turn the next conversation into accountable work while it’s still fresh.</p></div><Link href="/inbox" className="me-button secondary ml-auto" data-testid="link-nudge-inbox">Open inbox</Link></Card>
  </div>;
}
