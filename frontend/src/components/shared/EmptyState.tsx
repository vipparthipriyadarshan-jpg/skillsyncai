import React from "react";
import { FolderOpen, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FolderOpen,
  action,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center",
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm">{description}</p>
      {action && (
        <div className="mt-5">
          {action.href ? (
            <Button asChild variant="default" size="sm">
              <a href={action.href}>{action.label}</a>
            </Button>
          ) : (
            <Button onClick={action.onClick} variant="default" size="sm">
              {action.label}
            </Button>
          )}
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
