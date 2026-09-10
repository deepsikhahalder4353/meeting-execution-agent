import { Bell, BriefcaseBusiness, CheckSquare2, ChevronDown, Clock3, Command, FileInput, LayoutDashboard, Menu, Settings2, UsersRound, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Avatar } from "./ui-primitives";

const nav = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/inbox", label: "Conversation inbox", icon: FileInput },
  { href: "/workload", label: "Team workload", icon: UsersRound },
  { href: "/time", label: "Time", icon: Clock3 },
];
const lower = [
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  return <div className="min-h-[100dvh] bg-background">
    <aside className={`me-sidebar ${open ? "is-open" : ""}`}>
      <div className="flex items-center justify-between mb-10">
        <Link href="/" className="flex items-center gap-3" data-testid="link-brand">
          <span className="brand-mark">↗</span>
          <span className="font-display text-[15px] tracking-tight">meeting<span className="text-accent">.</span></span>
        </Link>
        <button className="md:hidden text-sidebar-foreground" onClick={() => setOpen(false)} data-testid="button-close-menu"><X size={18} /></button>
      </div>
      <div className="mb-7 px-1">
        <p className="sidebar-label">Workspace</p>
        <button className="workspace-switch" data-testid="button-workspace-switch">
          <span className="workspace-avatar">N</span><span className="truncate">Northstar studio</span><ChevronDown size={14} className="ml-auto opacity-60" />
        </button>
      </div>
      <nav className="space-y-1" aria-label="Primary navigation">
        {nav.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`nav-item ${location === item.href || (item.href === "/app" && (location === "/app" || location === "/overview")) || (item.href !== "/app" && location.startsWith(item.href)) ? "active" : ""}`} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(" ", "-")}`}><item.icon size={17} /><span>{item.label}</span>{item.href === "/inbox" ? <span className="nav-count">3</span> : null}</Link>)}
      </nav>
      <div className="mt-auto space-y-1">
        <p className="sidebar-label px-3 mb-2">Your space</p>
        {lower.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`nav-item ${location === item.href ? "active" : ""}`} data-testid={`link-nav-${item.label.toLowerCase()}`}><item.icon size={17} /><span>{item.label}</span>{item.href === "/notifications" ? <span className="nav-count soft">2</span> : null}</Link>)}
        <div className="sidebar-profile mt-5">
          <Avatar initials="AM" />
          <div className="min-w-0"><p className="text-sm font-semibold truncate">Ari Mendoza</p><p className="text-[11px] opacity-60 truncate">Team lead</p></div>
          <Command size={15} className="ml-auto opacity-50" />
        </div>
      </div>
    </aside>
    <button className="mobile-menu-button md:hidden" onClick={() => setOpen(true)} data-testid="button-open-menu"><Menu size={21} /></button>
    <main className="me-main">{children}</main>
  </div>;
}
