import React from "react";
import Link from "next/link";
import { Layers } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f2744] text-white">
              <Layers className="h-5 w-5 text-[#38bdf8]" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block leading-tight">
                Skill Sync AI
              </span>
              <span className="text-[10px] text-slate-500 font-medium block leading-none">
                Bridging Industry Demand and Workforce Skills
              </span>
            </div>
          </Link>
          <div className="text-xs text-slate-500">
            Enterprise & Government Portal
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        Skill Sync AI &bull; Bridging Industry Demand and Workforce Skills &bull; Enterprise Edition
      </footer>
    </div>
  );
}
