import { ArrowUpRight, FolderKanban, Plus, Search, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { useMemo, useState } from "react";
import { useListProjects } from "@workspace/api-client-react";
import { Card, Input, PageTitle, QueryState, Button } from "../components/ui-primitives";

export default function Projects() {
  const projects = useListProjects();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => projects.data?.filter(project => project.name.toLowerCase().includes(query.toLowerCase()) || project.description.toLowerCase().includes(query.toLowerCase())), [projects.data, query]);
  return <div className="page-container"><PageTitle eyebrow="Workspace" title="Projects" description="A clear home for every conversation, commitment, and next step." action={<Button data-testid="button-new-project" disabled><Plus size={16} />New project</Button>} />
    <div className="toolbar mb-6"><div className="search-wrap"><Search size={16} /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a project" aria-label="Find a project" data-testid="input-project-search" /></div><span className="text-xs text-muted-foreground">{projects.data?.length || 0} spaces</span></div>
    <QueryState loading={projects.isLoading} error={projects.isError} empty={!filtered?.length} onRetry={() => projects.refetch()}><div className="project-grid">{filtered?.map((project, index) => <Link href={`/projects/${project.id}`} className={`project-card project-card-${index % 3}`} key={project.id} data-testid={`card-project-${project.id}`}><div className="project-card-top"><span className="project-symbol"><FolderKanban size={18} /></span><ArrowUpRight size={17} className="text-muted-foreground" /></div><h2>{project.name}</h2><p>{project.description}</p><div className="project-card-footer"><span><UsersRound size={14} />{project.memberCount} members</span><span>{project.taskCount} tasks</span><span className="ml-auto">Updated {new Date(project.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span></div></Link>)}</div></QueryState>
  </div>;
}
