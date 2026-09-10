export interface Task {
  id: string;
  projectId?: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "urgent" | "high" | "medium" | "low";
  assigneeId?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  deadline?: string;
  sourceLabel?: string;
  source?: string;
  tags?: string[];
  createdAt?: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  initials: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  taskCount: number;
  updatedAt: string;
  members?: ProjectMember[];
}

export interface ProjectDetail extends Project {}

export interface Notification {
  id: string;
  read: boolean;
  kind: "deadline" | "unresolved" | "simulated" | string;
  title: string;
  detail: string;
  createdAt: string;
}

export interface WorkloadRow {
  memberId: string;
  memberName: string;
  initials: string;
  activeTasks: number;
  urgentTasks: number;
  afterHoursTasks: number;
  hoursLogged: number;
}

export interface TimeEntry {
  id: string;
  active: boolean;
  durationMinutes: number;
  taskTitle: string;
  memberName: string;
  startedAt: string;
  taskId?: string;
}

export interface IngestedTask {
  id: string;
  title: string;
  priority: string;
  assigneeName: string;
}

export interface IngestionResult {
  title: string;
  detectedLanguage: string;
  durationLabel: string;
  processedAt: string;
  decisions: string[];
  tasks: IngestedTask[];
  unresolvedQuestions: string[];
  transcript?: string;
}

export interface Dashboard {
  currentProjectId?: string;
  activeTasks: number;
  delegatedCount: number;
  dueSoon: number;
  completedThisWeek: number;
  completionRate: number;
  hoursLogged: number;
}

export interface Activity {
  id: string;
  actorName: string;
  actorInitials: string;
  action: string;
  detail: string;
  timestamp: string;
  tone: "green" | "amber" | "purple" | string;
}
