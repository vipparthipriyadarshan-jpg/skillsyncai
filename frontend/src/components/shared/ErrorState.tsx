import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Failed to load data",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[250px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50/50 p-8 text-center",
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-red-700 max-w-sm">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-800 hover:bg-red-50"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
