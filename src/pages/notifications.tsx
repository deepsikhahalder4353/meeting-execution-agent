import { Bell, Check, Clock3, MessageCircleQuestion, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListNotificationsQueryKey, useListNotifications, useMarkNotificationRead } from "@workspace/api-client-react";
import { Card, PageTitle, QueryState, Button, StatusDot } from "../components/ui-primitives";

const kindCopy: Record<string, { label: string; icon: typeof Bell; tone: "yellow" | "red" | "blue" }> = { deadline: { label: "Deadline", icon: Clock3, tone: "yellow" }, unresolved: { label: "Needs an answer", icon: MessageCircleQuestion, tone: "red" }, simulated: { label: "Reminder", icon: Sparkles, tone: "blue" } };

export default function Notifications() {
  const client = useQueryClient();
  const notifications = useListNotifications();
  const markRead = useMarkNotificationRead();
  const mark = (id: string) => markRead.mutate({ notificationId: id }, { onSuccess: () => client.invalidateQueries({ queryKey: getListNotificationsQueryKey() }) });
  const unread = notifications.data?.filter(item => !item.read).length || 0;
  return <div className="page-container"><PageTitle eyebrow="Your space" title="Notifications" description={`${unread ? `${unread} things` : "Nothing"} worth your attention right now.`} action={unread ? <Button className="secondary" onClick={() => notifications.data?.filter(item => !item.read).forEach(item => mark(item.id))} data-testid="button-mark-all-read"><Check size={15} />Mark all read</Button> : undefined} />
    <Card className="p-0 overflow-hidden"><div className="section-header"><div><p className="eyebrow">Reminder log</p><h2 className="section-title">A little signal, at the right time</h2></div><Bell size={18} className="text-muted-foreground" /></div><QueryState loading={notifications.isLoading} error={notifications.isError} empty={!notifications.data?.length} onRetry={() => notifications.refetch()}><div>{notifications.data?.map(item => { const meta = kindCopy[item.kind] || kindCopy.simulated; const Icon = meta.icon; return <div className={`notification-row ${item.read ? "is-read" : ""}`} key={item.id} data-testid={`notification-${item.id}`}><span className="notification-icon"><Icon size={16} /></span><div className="min-w-0 flex-1"><div className="flex gap-2 items-center"><span className="eyebrow">{meta.label}</span>{!item.read ? <StatusDot tone={meta.tone} /> : null}</div><p className="text-sm font-semibold mt-1">{item.title}</p><p className="text-sm text-muted-foreground mt-1">{item.detail}</p><time>{new Date(item.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time></div>{!item.read ? <button className="read-button" onClick={() => mark(item.id)} disabled={markRead.isPending} data-testid={`button-read-notification-${item.id}`}>Mark read</button> : <span className="read-label">Read</span>}</div>})}</div></QueryState></Card>
  </div>;
}
