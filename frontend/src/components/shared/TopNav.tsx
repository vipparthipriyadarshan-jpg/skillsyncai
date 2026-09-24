"use client";

import { Menu, Layers, ShieldCheck } from "lucide-react";
import { UserRole } from "@/lib/roles";
import { UserMenu } from "./UserMenu";

interface TopNavProps {
  onToggleSidebar?: () => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userEmail?: string;
  userName?: string;
}

export function TopNav({
  onToggleSidebar,
  activeRole,
  onRoleChange,
  userEmail,
  userName,
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Small screen logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0f2744] text-white">
            <Layers className="h-4 w-4 text-[#0284c7]" />
          </div>
          <span className="font-bold text-slate-900 text-sm">Skill Sync AI</span>
        </div>

        {/* Product Status & Context */}
        <div className="hidden md:flex items-center gap-2 pl-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            System Status: Operational
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-600 font-semibold tracking-tight">
            Labour Market &amp; Skill Intelligence
          </span>
          <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200">
            Live Feed: Synchronized
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Role Context Indicator */}
        <div className="hidden lg:flex items-center gap-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#0284c7]" />
          <span>Active View:</span>
          <span className="font-semibold text-slate-900 capitalize">{activeRole}</span>
        </div>

        <UserMenu
          activeRole={activeRole}
          onRoleChange={onRoleChange}
          userEmail={userEmail}
          userName={userName}
        />
      </div>
    </header>
  );
}
