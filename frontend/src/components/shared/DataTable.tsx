import React from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "No data is currently available for this view.",
  className,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingState message="Fetching records..." />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={cn("px-4 py-3", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr
                key={keyExtractor(row, idx)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "transition-colors hover:bg-slate-50/80",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-slate-800", col.className)}>
                    {col.render
                      ? col.render(row, idx)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500">
        <span>Showing {data.length} records</span>
      </div>
    </div>
  );
}
