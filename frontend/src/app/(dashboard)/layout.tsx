"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopNav } from "@/components/shared/TopNav";
import { UserRole, DEFAULT_ROLE } from "@/lib/roles";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>(DEFAULT_ROLE);
  const [userEmail, setUserEmail] = useState<string>("admin@skillsync.ai");
  const [userName, setUserName] = useState<string>("System Administrator");

  const supabase = createClient();

  useEffect(() => {
    // Check if real Supabase user session exists
    async function loadUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUserEmail(data.user.email || "admin@skillsync.ai");
          const metadata = data.user.user_metadata;
          if (metadata?.full_name) {
            setUserName(metadata.full_name);
          }
          if (metadata?.role) {
            setActiveRole(metadata.role as UserRole);
          }
        }
      } catch {
        // Fallback to demo default
      }
    }
    loadUser();
  }, [supabase]);

  // Persist role switcher preference in localStorage for seamless evaluation
  useEffect(() => {
    const saved = localStorage.getItem("skill_sync_role");
    if (saved && ["admin", "government", "institution", "employer", "candidate"].includes(saved)) {
      setActiveRole(saved as UserRole);
    }
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    localStorage.setItem("skill_sync_role", role);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeRole={activeRole}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopNav
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
          userEmail={userEmail}
          userName={userName}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
