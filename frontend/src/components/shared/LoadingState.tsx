import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export function LoadingState({
  message = "Loading data...",
  description,
  className,
  compact = false,
}: LoadingStateProps) {
  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-slate-500", className)}>
        <Loader2 className="h-4 w-4 animate-spin text-[#0284c7]" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[250px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-[#0284c7] mb-3" />
      <p className="text-sm font-medium text-slate-900">{message}</p>
      {description && (
        <p className="mt-1 text-xs text-slate-500 max-w-xs">{description}</p>
      )}
    </div>
  );
}
