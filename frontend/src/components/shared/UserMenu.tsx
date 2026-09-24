"use client";

import React, { useState, useRef, useEffect } from "react";
import { UserRole, USER_ROLES } from "@/lib/roles";
import { createClient } from "@/lib/supabase/client";
import { LogOut, ChevronDown, Shield, Check } from "lucide-react";
import { RoleBadge } from "./RoleBadge";

interface UserMenuProps {
  userEmail?: string;
  userName?: string;
  activeRole: UserRole;
  onRoleChange?: (newRole: UserRole) => void;
}

export function UserMenu({
  userEmail = "admin@skillsync.ai",
  userName = "System Administrator",
  activeRole,
  onRoleChange,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // In case client is in offline/demo mode
    }
    window.location.href = "/login";
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-1.5 pr-3 text-left transition-colors hover:bg-slate-50 focus:outline-none"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2744] text-xs font-semibold text-white">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-slate-800 leading-tight">
            {userName}
          </p>
          <p className="text-[11px] text-slate-500 line-clamp-1">{userEmail}</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border border-slate-200 bg-white py-2 shadow-lg z-50 animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Signed in as
            </p>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {userEmail}
            </p>
            <div className="mt-2">
              <RoleBadge role={activeRole} size="sm" />
            </div>
          </div>

          {/* Quick Role Switcher for Hackathon Evaluation */}
          <div className="py-2 border-b border-slate-100">
            <div className="px-3 pb-1 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Shield className="h-3 w-3" /> Switch Persona
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1">Demo Mode</span>
            </div>
            {Object.values(USER_ROLES).map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onRoleChange?.(r.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>{r.label}</span>
                {activeRole === r.id && (
                  <Check className="h-3.5 w-3.5 text-[#0284c7]" />
                )}
              </button>
            ))}
          </div>

          <div className="py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
