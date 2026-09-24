import React from "react";
import { UserRole, USER_ROLES } from "@/lib/roles";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
  size?: "sm" | "md";
}

export function RoleBadge({ role, className, size = "md" }: RoleBadgeProps) {
  const config = USER_ROLES[role] || USER_ROLES.government;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        config.badgeBg,
        config.badgeColor,
        config.badgeBorder,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs tracking-wide",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {config.label}
    </span>
  );
}
