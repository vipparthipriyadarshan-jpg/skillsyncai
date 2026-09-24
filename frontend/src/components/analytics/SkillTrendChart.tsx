"use client";

import React, { useState } from "react";
import { TimeSeriesPoint } from "@/lib/analytics/radar-service";

interface SkillTrendChartProps {
  data: TimeSeriesPoint[];
  trajectory?: "emerging" | "growing" | "stable" | "declining" | "insufficient_data";
  title?: string;
  height?: number;
  showLabels?: boolean;
}

export function SkillTrendChart({
  data,
  trajectory = "growing",
  title,
  height = 200,
  showLabels = true,
}: SkillTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
        No time-series observations available
      </div>
    );
  }

  // Determine line color and gradient based on trajectory
  let strokeColor = "#0284c7"; // Sky Blue
  let gradientStart = "rgba(2, 132, 199, 0.25)";
  let gradientEnd = "rgba(2, 132, 199, 0.0)";

  if (trajectory === "emerging") {
    strokeColor = "#059669"; // Emerald Green
    gradientStart = "rgba(5, 150, 105, 0.3)";
    gradientEnd = "rgba(5, 150, 105, 0.0)";
  } else if (trajectory === "declining") {
    strokeColor = "#e11d48"; // Rose / Red
    gradientStart = "rgba(225, 29, 72, 0.25)";
    gradientEnd = "rgba(225, 29, 72, 0.0)";
  } else if (trajectory === "stable") {
    strokeColor = "#64748b"; // Slate
    gradientStart = "rgba(100, 116, 139, 0.2)";
    gradientEnd = "rgba(100, 116, 139, 0.0)";
  }

  const maxVal = Math.max(...data.map((d) => d.vacancies), 5);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  // Chart coordinates
  const svgWidth = 600;
  const svgHeight = height;
  const paddingLeft = showLabels ? 45 : 10;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = showLabels ? 35 : 10;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.vacancies - minVal) / range) * chartHeight;
    return { x, y, data: d, index: i };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    // Smooth bezier curve
    const prev = points[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  // Grid tick marks
  const yTicks = [0, Math.round(maxVal * 0.5), maxVal];

  return (
    <div className="w-full">
      {title && (
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </h4>
          <span className="text-[11px] font-medium text-slate-400">
            Vacancies Over Time
          </span>
        </div>
      )}

      <div className="relative w-full overflow-hidden rounded-lg bg-white">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-${trajectory}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientStart} />
              <stop offset="100%" stopColor={gradientEnd} />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {showLabels &&
            yTicks.map((tick, i) => {
              const y = paddingTop + chartHeight - ((tick - minVal) / range) * chartHeight;
              return (
                <g key={i}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray={i === 0 ? "0" : "3 3"}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

          {/* Area Fill */}
          <path d={areaD} fill={`url(#grad-${trajectory})`} />

          {/* Line Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p) => {
            const isHovered = hoveredIndex === p.index;
            return (
              <g key={p.index}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 3.5}
                  fill="#ffffff"
                  stroke={strokeColor}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(p.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* X Axis Labels */}
                {showLabels && (
                  <text
                    x={p.x}
                    y={svgHeight - 10}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-500 font-medium"
                  >
                    {p.data.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="pointer-events-none absolute -top-1 left-0 z-20 -translate-x-1/2 -translate-y-full rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
            style={{
              left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
              top: `${(points[hoveredIndex].y / svgHeight) * 100}%`,
            }}
          >
            <div className="font-semibold text-slate-200">
              {points[hoveredIndex].data.label}
            </div>
            <div className="text-[11px] text-cyan-400">
              {points[hoveredIndex].data.vacancies} open vacancies
            </div>
            <div className="text-[10px] text-slate-400">
              {points[hoveredIndex].data.postings} job listings
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
