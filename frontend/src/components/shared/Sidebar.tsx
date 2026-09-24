"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV_ITEMS } from "@/types/navigation";
import { UserRole } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { Layers, X, Sparkles } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
}

export function Sidebar({ isOpen, onClose, activeRole }: SidebarProps) {
  const pathname = usePathname();

  // Filter items based on active role if item has role constraints
  const accessibleItems = DASHBOARD_NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(activeRole);
  });

  const categories = [
    { id: "intelligence", label: "Intelligence" },
    { id: "alignment", label: "Alignment" },
    { id: "readiness", label: "Training Readiness" },
    { id: "validation", label: "Validation & Outcomes" },
    { id: "planning", label: "Workforce Planning" },
    { id: "candidate", label: "Candidate" },
    { id: "system", label: "System & Governance" },
  ];

  const renderNavGroup = (categoryId: string, label: string) => {
    const items = accessibleItems.filter((i) => i.category === categoryId);
    if (items.length === 0) return null;

    return (
      <div key={categoryId} className="mb-5">
        <h4 className="px-3 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </h4>
        <div className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-[#0f2744] text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-[#38bdf8]"
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold",
                      isActive
                        ? "bg-[#1e3a60] text-sky-200"
                        : "bg-sky-50 text-sky-700 border border-sky-200"
                    )}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Branding Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f2744] text-white shadow-xs">
              <Layers className="h-5 w-5 text-[#38bdf8]" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-900 block leading-tight">
                Skill Sync AI
              </span>
              <span className="text-[10px] text-slate-500 font-medium block leading-none">
                Bridging Demand & Skills
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3">
          {categories.map((cat) => renderNavGroup(cat.id, cat.label))}
        </div>

        {/* System Footer Tag */}
        <div className="border-t border-slate-100 p-3 bg-slate-50/60 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Platform Edition</span>
            <span className="font-mono text-slate-700 bg-slate-200/70 px-1.5 py-0.5 rounded text-[10px]">v2.4 Enterprise</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Data Pipeline: Live Synchronized</p>
        </div>
      </aside>
    </>
  );
}
