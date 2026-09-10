import { AlertTriangle, BarChart3, Info, UsersRound } from "lucide-react";
import { useGetWorkload, useListProjects } from "@workspace/api-client-react";
import { Card, PageTitle, QueryState, Select, Avatar, StatusDot } from "../components/ui-primitives";
import { useState } from "react";

export default function Workload() {
  const [projectId, setProjectId] = useState("");
  const projects = useListProjects();
  const workload = useGetWorkload(projectId ? { projectId } : undefined);
  const total = workload.data?.reduce((sum, row) => sum + row.activeTasks, 0) || 0;
  const hours = workload.data?.reduce((sum, row) => sum + row.hoursLogged, 0) || 0;
  return <div className="page-container"><PageTitle eyebrow="Team lead view" title="Workload, without the leaderboard." description="See where the team needs clarity or cover. This view is about balance, not comparison." action={<Select value={projectId} onChange={e => setProjectId(e.target.value)} aria-label="Filter workload by project" data-testid="select-workload-project"><option value="">All projects</option>{projects.data?.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}</Select>} />
    <div className="workload-summary"><Card tilt><span className="stat-icon"><UsersRound size={17} /></span><p className="stat-value">{workload.data?.length || 0}</p><p className="stat-label">People in motion</p></Card><Card tilt><span className="stat-icon warm"><BarChart3 size={17} /></span><p className="stat-value">{total}</p><p className="stat-label">Active commitments</p></Card><Card tilt><span className="stat-icon blue"><Info size={17} /></span><p className="stat-value">{hours.toFixed(1)}</p><p className="stat-label">Hours logged this period</p></Card></div>
    <Card className="mt-6 p-0 overflow-hidden"><div className="section-header"><div><p className="eyebrow">Capacity signals</p><h2 className="section-title">The shape of the work</h2></div><span className="text-xs text-muted-foreground flex gap-2 items-center"><StatusDot tone="green" />Aggregated view</span></div><QueryState loading={workload.isLoading} error={workload.isError} empty={!workload.data?.length} onRetry={() => workload.refetch()}><div className="workload-table"><div className="workload-row table-head"><span>Team member</span><span>Active</span><span>Urgent</span><span>After hours</span><span>Logged</span></div>{workload.data?.map(row => <div className="workload-row" key={row.memberId} data-testid={`row-workload-${row.memberId}`}><span className="flex items-center gap-3 font-semibold"><Avatar initials={row.initials} />{row.memberName}</span><span>{row.activeTasks}</span><span className={row.urgentTasks ? "number-alert" : ""}>{row.urgentTasks ? <AlertTriangle size={13} /> : null}{row.urgentTasks}</span><span className={row.afterHoursTasks ? "number-alert" : ""}>{row.afterHoursTasks}</span><span className="font-mono text-sm">{row.hoursLogged.toFixed(1)}h</span></div>)}</div></QueryState></Card>
  </div>;
}
