import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: {
    value: string | number;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  dataSource?: string;
  className?: string;
  variant?: "default" | "accent" | "warning";
}

export function KpiCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  dataSource,
  className,
  variant = "default",
}: KpiCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-150 hover:border-slate-300 hover:shadow-sm",
        variant === "accent" && "border-l-4 border-l-[#0284c7]",
        variant === "warning" && "border-l-4 border-l-amber-500",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          {Icon && (
            <div className="rounded-md bg-slate-100 p-2 text-slate-700">
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                "inline-flex items-center text-xs font-medium",
                trend.direction === "up" && "text-emerald-700",
                trend.direction === "down" && "text-red-700",
                trend.direction === "neutral" && "text-slate-600"
              )}
            >
              {trend.direction === "up" && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
              {trend.direction === "down" && <ArrowDownRight className="h-3 w-3 mr-0.5" />}
              {trend.direction === "neutral" && <Minus className="h-3 w-3 mr-0.5" />}
              {trend.value}
              {trend.label && <span className="ml-1 text-slate-500">({trend.label})</span>}
            </span>
          )}
        </div>

        {subtext && (
          <p className="mt-1 text-xs text-slate-600 line-clamp-1">{subtext}</p>
        )}

        {dataSource && (
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">
              {dataSource}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
