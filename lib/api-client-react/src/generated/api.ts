import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  Task,
  Project,
  ProjectDetail,
  Notification,
  WorkloadRow,
  TimeEntry,
  IngestionResult,
  Dashboard,
  Activity
} from "./api.schemas";

// --- Mock Data for Query Views ---

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Northstar Mobile App",
    description: "Next-generation mobile companion for field teams and live sync.",
    memberCount: 4,
    taskCount: 8,
    updatedAt: new Date().toISOString(),
    members: [
      { id: "mem-1", name: "Ari Mendoza", initials: "AM", role: "Team Lead" },
      { id: "mem-2", name: "Elena Rostova", initials: "ER", role: "Product Designer" },
      { id: "mem-3", name: "Marcus Chen", initials: "MC", role: "Fullstack Engineer" },
      { id: "mem-4", name: "Sarah Jenkins", initials: "SJ", role: "QA Engineer" }
    ]
  },
  {
    id: "proj-2",
    name: "AI Dispatch Pipeline",
    description: "Automated routing and priority assignment from customer call transcripts.",
    memberCount: 3,
    taskCount: 5,
    updatedAt: new Date().toISOString(),
    members: [
      { id: "mem-1", name: "Ari Mendoza", initials: "AM", role: "Team Lead" },
      { id: "mem-3", name: "Marcus Chen", initials: "MC", role: "Fullstack Engineer" }
    ]
  }
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    projectId: "proj-1",
    title: "Finalize offline sync conflict resolution spec",
    description: "Define fallback UI when two team members edit task status simultaneously in offline mode.",
    status: "in_progress",
    priority: "urgent",
    assigneeId: "mem-1",
    assigneeName: "Ari Mendoza",
    assigneeInitials: "AM",
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    sourceLabel: "Meeting transcript: Sync Architecture",
    source: "Sync Architecture",
    tags: ["architecture", "spec", "v1.2"],
    createdAt: new Date().toISOString()
  },
  {
    id: "task-2",
    projectId: "proj-1",
    title: "Review mobile navigation redesign with Elena",
    description: "Walk through bottom sheet navigation patterns and accessibility contrasts.",
    status: "todo",
    priority: "high",
    assigneeId: "mem-2",
    assigneeName: "Elena Rostova",
    assigneeInitials: "ER",
    deadline: new Date(Date.now() + 86400000 * 4).toISOString(),
    sourceLabel: "Design Review",
    tags: ["design", "ui"],
    createdAt: new Date().toISOString()
  },
  {
    id: "task-3",
    projectId: "proj-2",
    title: "Benchmark Groq Llama 3 70B extraction latency",
    description: "Verify processing time under 1.5s for audio meeting transcripts over 20 minutes.",
    status: "in_progress",
    priority: "medium",
    assigneeId: "mem-3",
    assigneeName: "Marcus Chen",
    assigneeInitials: "MC",
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    sourceLabel: "Standup Call",
    tags: ["ai", "performance"],
    createdAt: new Date().toISOString()
  },
  {
    id: "task-4",
    projectId: "proj-1",
    title: "Deploy staging build for QA smoke test",
    description: "Verify staging environment end-to-end task creation and status changes.",
    status: "done",
    priority: "low",
    assigneeId: "mem-4",
    assigneeName: "Sarah Jenkins",
    assigneeInitials: "SJ",
    sourceLabel: "Sprint backlog",
    tags: ["qa", "release"],
    createdAt: new Date().toISOString()
  }
];

export const mockDashboard: Dashboard = {
  currentProjectId: "proj-1",
  activeTasks: 6,
  delegatedCount: 3,
  dueSoon: 2,
  completedThisWeek: 4,
  completionRate: 67,
  hoursLogged: 14.5
};

export const mockActivity: Activity[] = [
  {
    id: "act-1",
    actorName: "Ari Mendoza",
    actorInitials: "AM",
    action: "started session on",
    detail: "Finalize offline sync conflict resolution spec",
    timestamp: new Date().toISOString(),
    tone: "green"
  },
  {
    id: "act-2",
    actorName: "Marcus Chen",
    actorInitials: "MC",
    action: "completed task",
    detail: "Setup Whisper transcription endpoint",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    tone: "purple"
  },
  {
    id: "act-3",
    actorName: "Elena Rostova",
    actorInitials: "ER",
    action: "commented on",
    detail: "Mobile navigation patterns",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    tone: "amber"
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    read: false,
    kind: "deadline",
    title: "Offline sync spec due in 2 days",
    detail: "Assigned to Ari Mendoza on Northstar Mobile App",
    createdAt: new Date().toISOString()
  },
  {
    id: "notif-2",
    read: false,
    kind: "unresolved",
    title: "Unresolved decision: SQLite vs IndexedDB fallback",
    detail: "Mentioned in sync architecture notes without owner consensus.",
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "notif-3",
    read: true,
    kind: "simulated",
    title: "Morning check-in: 2 urgent tasks in progress",
    detail: "High team focus reported this sprint.",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const mockWorkload: WorkloadRow[] = [
  {
    memberId: "mem-1",
    memberName: "Ari Mendoza",
    initials: "AM",
    activeTasks: 3,
    urgentTasks: 1,
    afterHoursTasks: 0,
    hoursLogged: 8.5
  },
  {
    memberId: "mem-2",
    memberName: "Elena Rostova",
    initials: "ER",
    activeTasks: 2,
    urgentTasks: 1,
    afterHoursTasks: 0,
    hoursLogged: 4.0
  },
  {
    memberId: "mem-3",
    memberName: "Marcus Chen",
    initials: "MC",
    activeTasks: 2,
    urgentTasks: 0,
    afterHoursTasks: 1,
    hoursLogged: 6.5
  }
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: "time-1",
    active: false,
    durationMinutes: 45,
    taskTitle: "Finalize offline sync conflict resolution spec",
    memberName: "Ari Mendoza",
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    taskId: "task-1"
  },
  {
    id: "time-2",
    active: false,
    durationMinutes: 90,
    taskTitle: "Benchmark Groq Llama 3 70B extraction latency",
    memberName: "Marcus Chen",
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    taskId: "task-3"
  }
];

// --- Query Keys ---

export const getListNotificationsQueryKey = () => ["/api/notifications"];
export const getGetProjectQueryKey = (projectId: string) => ["/api/projects", projectId];
export const getListTasksQueryKey = (params?: { projectId?: string; status?: string }) => ["/api/tasks", params];
export const getListTimeEntriesQueryKey = () => ["/api/time-entries"];

// --- Query Hooks ---

export function useListProjects(options?: any) {
  return useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => mockProjects,
    ...options?.query
  });
}

export function useGetProject(projectId: string, options?: any) {
  return useQuery<ProjectDetail>({
    queryKey: getGetProjectQueryKey(projectId),
    queryFn: async () => {
      const found = mockProjects.find((p) => p.id === projectId);
      return found || {
        id: projectId,
        name: "Project " + projectId,
        description: "Workspace project details",
        memberCount: 2,
        taskCount: 3,
        updatedAt: new Date().toISOString(),
        members: [
          { id: "mem-1", name: "Ari Mendoza", initials: "AM", role: "Team Lead" },
          { id: "mem-2", name: "Elena Rostova", initials: "ER", role: "Product Designer" }
        ]
      };
    },
    ...options?.query
  });
}

export function useListTasks(params?: { projectId?: string; status?: string }, options?: any) {
  return useQuery<Task[]>({
    queryKey: getListTasksQueryKey(params),
    queryFn: async () => {
      let result = [...mockTasks];
      if (params?.projectId) {
        result = result.filter((t) => t.projectId === params.projectId);
      }
      if (params?.status) {
        result = result.filter((t) => t.status === params.status);
      }
      return result;
    },
    ...options?.query
  });
}

export function useGetDashboard(options?: any) {
  return useQuery<Dashboard>({
    queryKey: ["/api/dashboard"],
    queryFn: async () => mockDashboard,
    ...options?.query
  });
}

export function useListActivity(options?: any) {
  return useQuery<Activity[]>({
    queryKey: ["/api/activity"],
    queryFn: async () => mockActivity,
    ...options?.query
  });
}

export function useListNotifications(options?: any) {
  return useQuery<Notification[]>({
    queryKey: getListNotificationsQueryKey(),
    queryFn: async () => mockNotifications,
    ...options?.query
  });
}

export function useGetWorkload(params?: { projectId?: string }, options?: any) {
  return useQuery<WorkloadRow[]>({
    queryKey: ["/api/workload", params],
    queryFn: async () => mockWorkload,
    ...options?.query
  });
}

export function useListTimeEntries(options?: any) {
  return useQuery<TimeEntry[]>({
    queryKey: getListTimeEntriesQueryKey(),
    queryFn: async () => mockTimeEntries,
    ...options?.query
  });
}

// --- Mutation Hooks ---

export function useCreateTask(options?: any) {
  return useMutation<{ id: string; [key: string]: any }, Error, { data: any }>({
    mutationFn: async (variables) => {
      const newTask = {
        ...variables.data,
        id: "task-" + Date.now()
      };
      mockTasks.unshift(newTask);
      return newTask;
    },
    ...options?.mutation
  });
}

export function useUpdateTask(options?: any) {
  return useMutation<any, Error, { taskId: string; data: any }>({
    mutationFn: async ({ taskId, data }) => {
      const task = mockTasks.find((t) => t.id === taskId);
      if (task) {
        Object.assign(task, data);
      }
      return { taskId, data };
    },
    ...options?.mutation
  });
}

export function useDelegateTask(options?: any) {
  return useMutation<any, Error, { taskId: string; data: { assigneeId: string } }>({
    mutationFn: async ({ taskId, data }) => {
      const task = mockTasks.find((t) => t.id === taskId);
      if (task) {
        task.assigneeId = data.assigneeId;
      }
      return { taskId, data };
    },
    ...options?.mutation
  });
}

export function useMarkNotificationRead(options?: any) {
  return useMutation<any, Error, { notificationId: string }>({
    mutationFn: async ({ notificationId }) => {
      const notif = mockNotifications.find((n) => n.id === notificationId);
      if (notif) {
        notif.read = true;
      }
      return { notificationId };
    },
    ...options?.mutation
  });
}

export function useStartTimeEntry(options?: any) {
  return useMutation<any, Error, { data: { taskId: string; memberId: string } }>({
    mutationFn: async ({ data }) => {
      const task = mockTasks.find((t) => t.id === data.taskId);
      const newEntry: TimeEntry = {
        id: "time-" + Date.now(),
        active: true,
        durationMinutes: 0,
        taskTitle: task ? task.title : "Active Task",
        memberName: "Ari Mendoza",
        startedAt: new Date().toISOString(),
        taskId: data.taskId
      };
      mockTimeEntries.unshift(newEntry);
      return newEntry;
    },
    ...options?.mutation
  });
}

export function useStopTimeEntry(options?: any) {
  return useMutation<any, Error, { entryId: string }>({
    mutationFn: async ({ entryId }) => {
      const entry = mockTimeEntries.find((e) => e.id === entryId);
      if (entry) {
        entry.active = false;
      }
      return { entryId };
    },
    ...options?.mutation
  });
}

// Helper to detect if a sentence is a greeting, filler, or test recording intro
function isFillerOrGreeting(sentence: string): boolean {
  const s = sentence.trim();
  if (s.length === 0) return true;

  // Very short non-action conversational tokens
  if (/^(ok|okay|right|cool|yeah|yep|yes|sure|great|sounds good|thank you|thanks|bye|cheers)[.!?]?$/i.test(s)) {
    return true;
  }

  // Greetings & welcome messages without substantive actions
  if (/^(hello|hi|hey|good morning|good afternoon|good evening|welcome everyone|welcome team|welcome back|greetings)\b/i.test(s)) {
    if (!/\b(will|needs? to|should|must|handle|action|task)\b/i.test(s) || s.split(" ").length <= 8) {
      return true;
    }
  }

  // Test recording / mic check phrases
  if (/\b(this is a test|test recording|testing 1 2 3|sound check|mic check|audio check|checking the audio|test audio|testing the microphone|sample recording)\b/i.test(s)) {
    return true;
  }

  // Conversational wrap-up / meeting logistics without actions
  if (/^(can everyone hear me|can you hear me|let's get started|let us begin|thanks for joining|thank you for coming|that's all for today|have a great day|see you later)\b/i.test(s)) {
    return true;
  }

  return false;
}

const ACTION_VERBS = "handle|take care of|work on|deploy|review|update|create|build|implement|prepare|send|write|fix|test|finalize|coordinate|organize|schedule|investigate|deliver|ship|reach out to|follow up with|audit|verify|setup|set up|design|draft|refactor|clean up|analyze|benchmark|do|lead|manage|conduct|execute|run";

function splitIntoSentences(text: string): string[] {
  const lines = text.split(/[\r\n;]+/);
  const sentences: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Strip leading bullet marks (- * •) or list numbers (1. 2.)
    const cleanLine = trimmed.replace(/^(?:[-*•]\s+|\d+[\.)]\s+)/, "");
    // Split on terminal punctuation followed by whitespace
    const parts = cleanLine.split(/(?<=[.?!])\s+/);
    for (const p of parts) {
      const pTrim = p.trim();
      if (pTrim) sentences.push(pTrim);
    }
  }

  return sentences;
}

function splitCompoundSentence(sentence: string): string[] {
  // Split on clause separators:
  // 1. Semicolons
  // 2. ", and " or ", while " or ", but " or ", so "
  // 3. " and <Name> (will|needs|should|must|is|has|takes|agreed|can|shall|to)"
  // 4. ", <Name> (will|needs|should|must|is|has|takes|agreed|can|shall|to)"
  // 5. " and we (decided|agreed)" or ", and we (decided|agreed)"
  const regex = /(?:;\s*|,\s*(?:and|while|but|so)\s+|\s+(?:and|so|while|but)\s+(?=[A-Z][a-z]+\s+(?:will|needs?|should|must|is|has|takes?|agreed|can|shall|to))\s*|,\s*(?=[A-Z][a-z]+\s+(?:will|needs?|should|must|is|has|takes?|agreed|can|shall|to))\s*|\s+and\s+we\s+(?:agreed|decided)\s*)/i;
  return sentence.split(regex).map((s) => s.trim()).filter(Boolean);
}

interface ExtractedTaskCandidate {
  title: string;
  assigneeName: string;
  priority: "urgent" | "high" | "medium" | "low";
}

function parseTaskCandidate(sentence: string, knownProjectMembers: Array<{ name: string }>): ExtractedTaskCandidate | null {
  const s = sentence.trim();

  // Exclude filler, greetings, and questions
  if (isFillerOrGreeting(s) || s.endsWith("?") || /^(what|why|how|when|where|who|is it|are there|can we|could we)\b/i.test(s)) {
    return null;
  }

  // Pattern 1: <Owner> (will|needs to|should|must|has agreed to|is going to|can|shall|to) <action>
  // e.g. "Priya will handle the backend testing"
  const modalRegex = new RegExp(
    `\\b([A-Z][a-z]+|I)\\s+(?:will(?:\\s+be)?|needs?\\s+to|should|must|has\\s+agreed\\s+to|is\\s+going\\s+to|can|shall|to)\\s+(${ACTION_VERBS})\\b([^.]*)`,
    "i"
  );
  const match1 = s.match(modalRegex);
  if (match1) {
    const rawOwner = match1[1];
    const verb = match1[2];
    const rest = (match1[3] || "").trim();

    // Filter out non-person words that happen to be capitalized
    if (/^(this|there|here|what|it|that|everyone|everybody|nobody|someone|something|nothing|today|tomorrow|yesterday|welcome|thanks|meeting|project|audio|video|transcript|status)$/i.test(rawOwner)) {
      return null;
    }

    const assignee = rawOwner.toLowerCase() === "i" ? "Me" : rawOwner;
    let taskTitle = rest ? `${verb} ${rest}` : verb;
    taskTitle = taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1);
    taskTitle = taskTitle.replace(/[.,;:]+$/, "");

    let priority: "urgent" | "high" | "medium" | "low" = "medium";
    if (/\b(urgent|today|asap|critical|immediately)\b/i.test(s)) {
      priority = "urgent";
    } else if (/\b(tomorrow|friday|monday|soon|by end of day|eod)\b/i.test(s)) {
      priority = "high";
    }

    return { title: taskTitle, assigneeName: assignee, priority };
  }

  // Pattern 1b: <Owner> (is handling|is responsible for|takes ownership of|takes care of|is in charge of) <work/topic>
  const responsibilityRegex = /\b([A-Z][a-z]+|I)\s+(?:is\s+handling|is\s+responsible\s+for|takes?\s+ownership\s+of|takes?\s+care\s+of|is\s+in\s+charge\s+of)\s+([^.]+)/i;
  const matchResp = s.match(responsibilityRegex);
  if (matchResp) {
    const rawOwner = matchResp[1];
    const rest = (matchResp[2] || "").trim();
    if (!/^(this|there|here|what|it|that|everyone|everybody|nobody|someone|something|nothing|today|tomorrow|yesterday|welcome|thanks|meeting|project|audio|video|transcript|status)$/i.test(rawOwner)) {
      const assignee = rawOwner.toLowerCase() === "i" ? "Me" : rawOwner;
      let taskTitle = "";
      if (new RegExp(`^(?:${ACTION_VERBS})\\b`, "i").test(rest)) {
        taskTitle = rest;
      } else {
        const cleanRest = rest.replace(/^(?:the\s+)/i, "");
        taskTitle = `Handle ${cleanRest}`;
      }
      taskTitle = taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1);
      taskTitle = taskTitle.replace(/[.,;:]+$/, "");

      let priority: "urgent" | "high" | "medium" | "low" = "medium";
      if (/\b(urgent|today|asap|critical|immediately)\b/i.test(s)) {
        priority = "urgent";
      } else if (/\b(tomorrow|friday|monday|soon|by end of day|eod)\b/i.test(s)) {
        priority = "high";
      }

      return { title: taskTitle, assigneeName: assignee, priority };
    }
  }

  // Pattern 2: "Let's assign / have / ask <Owner> to <action>"
  const assignRegex = new RegExp(
    `\\b(?:assign|delegate|have|ask)\\s+([A-Z][a-z]+)\\s+to\\s+(${ACTION_VERBS})\\b([^.]*)`,
    "i"
  );
  const match2 = s.match(assignRegex);
  if (match2) {
    const rawOwner = match2[1];
    const verb = match2[2];
    const rest = (match2[3] || "").trim();

    if (/^(this|there|here|what|it|that|everyone|nobody)$/i.test(rawOwner)) {
      return null;
    }

    let taskTitle = rest ? `${verb} ${rest}` : verb;
    taskTitle = taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1);
    taskTitle = taskTitle.replace(/[.,;:]+$/, "");

    let priority: "urgent" | "high" | "medium" | "low" = "medium";
    if (/\b(urgent|today|asap|critical|immediately)\b/i.test(s)) {
      priority = "urgent";
    } else if (/\b(tomorrow|friday|soon)\b/i.test(s)) {
      priority = "high";
    }

    return { title: taskTitle, assigneeName: rawOwner, priority };
  }

  // Pattern 3: Direct address to a known team member: "<Name>, please <action>" or "<Name> to <action>"
  for (const member of knownProjectMembers) {
    const memberRegex = new RegExp(
      `\\b${member.name}\\b[,:]?\\s+(?:please\\s+)?(?:to\\s+)?(${ACTION_VERBS})\\b([^.]*)`,
      "i"
    );
    const matchMember = s.match(memberRegex);
    if (matchMember) {
      const verb = matchMember[1];
      const rest = (matchMember[2] || "").trim();
      let taskTitle = rest ? `${verb} ${rest}` : verb;
      taskTitle = taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1);
      taskTitle = taskTitle.replace(/[.,;:]+$/, "");

      return {
        title: taskTitle,
        assigneeName: member.name,
        priority: /\b(urgent|today|asap)\b/i.test(s) ? "urgent" : /\b(tomorrow|friday)\b/i.test(s) ? "high" : "medium"
      };
    }
  }

  // No clear action + owner -> NOT a task
  return null;
}

function parseDecisionCandidate(clause: string): string | null {
  const s = clause.trim();
  if (isFillerOrGreeting(s) || s.endsWith("?")) {
    return null;
  }

  const decisionRegex = /\b(we agreed|we decided|team decided|agreed that|concluded that|confirmed that|approved the|we'll go with|going forward with|final decision is|agreed to|decided to|officially approved|finalized the|decision:\s*|agreement:\s*|consensus:\s*|settled on|resolved that|voted to)\s+(?:to\s+)?([^.]+)/i;
  const match = s.match(decisionRegex);
  if (match) {
    let cleanDecision = match[2].trim();
    cleanDecision = cleanDecision.replace(/\s+(?:so|and)\s+[A-Z][a-z]+\s+(?:will|should|must|needs).*$/i, "");
    cleanDecision = cleanDecision.charAt(0).toUpperCase() + cleanDecision.slice(1);
    cleanDecision = cleanDecision.replace(/[.,;:]+$/, "");
    return cleanDecision;
  }

  const bulletDecisionRegex = /^(?:decision|agreed|agreement)[:\s]+([^.]+)/i;
  const matchBullet = s.match(bulletDecisionRegex);
  if (matchBullet) {
    let cleanDecision = matchBullet[1].trim();
    cleanDecision = cleanDecision.charAt(0).toUpperCase() + cleanDecision.slice(1);
    cleanDecision = cleanDecision.replace(/[.,;:]+$/, "");
    return cleanDecision;
  }

  return null;
}

function parseQuestionCandidate(sentence: string): string | null {
  const s = sentence.trim();
  if (isFillerOrGreeting(s)) {
    return null;
  }

  if (s.endsWith("?")) {
    if (/^(can you hear me|is this working|any questions|makes sense|right)\??$/i.test(s)) {
      return null;
    }
    return s;
  }

  if (/^(can someone|could someone|did we|do we need to|what should we|how will we|who is going to|who will|when will|is there|are we|should we|shall we)\b/i.test(s)) {
    return s.endsWith("?") ? s : `${s}?`;
  }

  const inquiryRegex = /^(?:open question|question|pending|unresolved|to be determined|tbd|need to confirm|needs? confirmation|need to check|need to find out|need to know|follow up)[:\s]*(.*)/i;
  const matchInquiry = s.match(inquiryRegex);
  if (matchInquiry) {
    const clean = s.replace(/[.,;:]+$/, "");
    return clean.endsWith("?") ? clean : `${clean}?`;
  }

  return null;
}

// Local fallback extraction logic
export function extractLocalFromTranscript(
  transcript: string,
  meta: { fileName?: string | null; detectedLanguage: string; durationLabel: string; projectId: string }
): IngestionResult {
  const clean = transcript.trim();
  const sentences = splitIntoSentences(clean);

  const decisions: string[] = [];
  const tasks: Array<{ id: string; title: string; priority: string; assigneeName: string }> = [];
  const unresolvedQuestions: string[] = [];

  const knownMembers = [
    { name: "Priya", role: "Developer" },
    { name: "Rohan", role: "Product Manager" },
    { name: "Marcus", role: "Fullstack Engineer" },
    { name: "Ari", role: "Team Lead" },
    { name: "Elena", role: "Product Designer" },
    { name: "Sarah", role: "QA Engineer" }
  ];

  sentences.forEach((sentence, idx) => {
    // 1. Check if the whole sentence is an explicit question or open item
    const wholeQuestion = parseQuestionCandidate(sentence);
    if (wholeQuestion) {
      if (!unresolvedQuestions.includes(wholeQuestion)) {
        unresolvedQuestions.push(wholeQuestion);
      }
      return;
    }

    // 2. Split compound sentences into clauses to extract individual items
    const clauses = splitCompoundSentence(sentence);

    clauses.forEach((clause, cIdx) => {
      // Check for question within clause
      const clauseQ = parseQuestionCandidate(clause);
      if (clauseQ && !unresolvedQuestions.includes(clauseQ)) {
        unresolvedQuestions.push(clauseQ);
        return;
      }

      // Check for task candidate
      const taskCandidate = parseTaskCandidate(clause, knownMembers);
      if (taskCandidate) {
        tasks.push({
          id: `task-extracted-${idx + 1}-${cIdx + 1}-${Date.now()}`,
          title: taskCandidate.title,
          priority: taskCandidate.priority,
          assigneeName: taskCandidate.assigneeName
        });
      }

      // Check for decision candidate
      const decision = parseDecisionCandidate(clause);
      if (decision) {
        const isDuplicate = decisions.some(
          (d) =>
            d.toLowerCase() === decision.toLowerCase() ||
            d.toLowerCase().includes(decision.toLowerCase()) ||
            decision.toLowerCase().includes(d.toLowerCase())
        );
        if (!isDuplicate) {
          decisions.push(decision);
        }
      }
    });
  });

  return {
    title: meta.fileName ? `Extracted from ${meta.fileName}` : "Execution Brief",
    detectedLanguage: meta.detectedLanguage,
    durationLabel: meta.durationLabel,
    processedAt: new Date().toISOString(),
    decisions,
    tasks,
    unresolvedQuestions,
    transcript: clean
  };
}

// Extraction logic that accurately parses transcript text into decisions, tasks (with clear action + owner), and unresolved questions
// Uses Groq LLM backend with full output token limit, falling back to local extractor
export async function extractFromTranscript(
  transcript: string,
  meta: { fileName?: string | null; detectedLanguage: string; durationLabel: string; projectId: string }
): Promise<IngestionResult> {
  const clean = transcript.trim();

  // 1. Try calling the backend Groq LLM extraction endpoint first
  try {
    const res = await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: clean,
        projectId: meta.projectId,
        fileName: meta.fileName
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && (Array.isArray(data.decisions) || Array.isArray(data.tasks) || Array.isArray(data.unresolvedQuestions))) {
        const decisions = (data.decisions || []).map((d: any) => typeof d === "string" ? d.trim() : String(d)).filter(Boolean);
        const tasks = (data.tasks || []).map((t: any, i: number) => ({
          id: `task-extracted-${i + 1}-${Date.now()}`,
          title: t.title || "Task item",
          priority: t.priority || "medium",
          assigneeName: t.assigneeName || "Unassigned"
        }));
        const unresolvedQuestions = (data.unresolvedQuestions || []).map((q: any) => typeof q === "string" ? q.trim() : String(q)).filter(Boolean);

        return {
          title: meta.fileName ? `Extracted from ${meta.fileName}` : "Execution Brief",
          detectedLanguage: meta.detectedLanguage,
          durationLabel: meta.durationLabel,
          processedAt: new Date().toISOString(),
          decisions,
          tasks,
          unresolvedQuestions,
          transcript: clean
        };
      }
    }
  } catch (err) {
    console.warn("Backend /api/extract unavailable, using enhanced local extraction fallback:", err);
  }

  // 2. Comprehensive local extraction fallback
  return extractLocalFromTranscript(clean, meta);
}

export function useIngestConversation(options?: any) {
  return useMutation<
    IngestionResult,
    Error,
    { data: { projectId: string; inputType: string; transcript?: string; fileName?: string | null; file?: File | null } }
  >({
    mutationFn: async ({ data }) => {
      let rawTranscript = "";
      let detectedLanguage = "English";
      let durationLabel = "Conversation";

      if (data.inputType === "audio" || data.inputType === "video") {
        if (!data.file) {
          throw new Error("No audio or video file was selected. Please select a file to transcribe.");
        }

        const formData = new FormData();
        formData.append("file", data.file);

        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          let errorMsg = `Transcription failed (${res.status})`;
          try {
            const errData = await res.json();
            if (errData.error) errorMsg = errData.error;
          } catch {}
          throw new Error(errorMsg);
        }

        const transcribeData = await res.json();
        rawTranscript = transcribeData.text || "";
        detectedLanguage = transcribeData.language || "English";
        if (transcribeData.duration) {
          const secs = Math.round(transcribeData.duration);
          durationLabel = `${Math.floor(secs / 60)}m ${secs % 60}s`;
        } else {
          durationLabel = "Audio recording";
        }
        if (data.transcript && data.transcript.trim()) {
          rawTranscript = `${rawTranscript}\n\nAdditional notes:\n${data.transcript.trim()}`;
        }
      } else {
        rawTranscript = data.transcript || "";
        detectedLanguage = "English";
        durationLabel = data.inputType === "whatsapp" ? "WhatsApp thread" : data.inputType === "image" ? "Image OCR" : "Meeting notes";
      }

      if (!rawTranscript.trim()) {
        throw new Error("No transcript content was extracted or received.");
      }

      const result = await extractFromTranscript(rawTranscript, {
        fileName: data.fileName,
        detectedLanguage,
        durationLabel,
        projectId: data.projectId
      });

      // Also register extracted tasks into the mock database so they appear in project details and dashboard
      result.tasks.forEach((t) => {
        mockTasks.unshift({
          id: t.id,
          projectId: data.projectId,
          title: t.title,
          status: "todo",
          priority: (t.priority as any) || "medium",
          assigneeName: t.assigneeName,
          sourceLabel: data.fileName ? (data.inputType === "image" ? `Image: ${data.fileName}` : `Audio: ${data.fileName}`) : "Conversation Inbox",
          source: "Inbox",
          createdAt: new Date().toISOString()
        });
      });

      return result;
    },
    ...options?.mutation
  });
}
