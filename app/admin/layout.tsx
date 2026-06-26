import * as React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, logoutAction } from '@/server/actions/auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import {
  LayoutDashboard,
  FolderKanban,
  Zap,
  Quote,
  BookOpen,
  Settings,
  ShieldCheck,
  LogOut,
  Database,
  User as UserIcon,
  MessageSquare,
  FileText,
  Users,
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Analytics Overview', href: '/admin', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
  { name: 'Projects Manager', href: '/admin/projects', icon: FolderKanban, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
  { name: 'Skills Catalog', href: '/admin/skills', icon: Zap, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Profile Timeline', href: '/admin/profile', icon: FileText, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Quote, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Blog Publisher', href: '/admin/blogs', icon: BookOpen, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
  { name: 'Messages Inbox', href: '/admin/messages', icon: MessageSquare, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
  { name: 'User Accounts', href: '/admin/users', icon: Users, roles: ['SUPER_ADMIN'] },
  { name: 'Security Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck, roles: ['SUPER_ADMIN'] },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const authorizedLinks = sidebarLinks.filter(
    (link) => link.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-200">
      {/* 1. Sidebar */}
      <aside className="w-64 bg-card border-r border-border/40 hidden md:flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-foreground font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/10">
              <Database className="w-5 h-5" />
            </div>
            <span className="tracking-tight font-sans">
              Gbade<span className="text-primary">.admin</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {authorizedLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout button */}
        <div className="space-y-4 pt-4 border-t border-border/20">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="truncate text-xs">
              <h4 className="font-bold text-foreground truncate">{user.name}</h4>
              <span className="text-[10px] text-muted-foreground bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                {user.role}
              </span>
            </div>
          </div>

          <form action={logoutAction} className="w-full">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-4 rounded-xl bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground transition-all duration-200 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-border/40 bg-card/60 backdrop-blur-md px-6 flex items-center justify-between">
          <h2 className="text-sm font-extrabold tracking-tight text-foreground uppercase">Console Panel</h2>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
              View Site
            </Link>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-secondary/5">
          {children}
        </main>
      </div>
    </div>
  );
}
