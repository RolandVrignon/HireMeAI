"use client";

import React, { useRef, useState, useEffect } from "react";
import { Tilt } from "../ui/tilt";

interface ContributionDay {
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  date: string;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface GitHubActivityProps {
  data: {
    totalContributions: number;
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalRepos: number;
    weeks: Week[];
  };
}

const levelColors: Record<string, string> = {
  NONE: "bg-white/5",
  FIRST_QUARTILE: "bg-green-900",
  SECOND_QUARTILE: "bg-green-700",
  THIRD_QUARTILE: "bg-green-500",
  FOURTH_QUARTILE: "bg-green-400",
};

const legendLevels = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
];

export const GitHubActivity: React.FC<GitHubActivityProps> = ({ data }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(0);

  if (!data?.weeks) return null;

  const {
    weeks,
    totalContributions,
    totalCommits,
    totalPRs,
    totalIssues,
    totalRepos,
  } = data;
  const numWeeks = weeks.length;
  const gap = 2;
  const dayLabelWidth = 28;

  // Build month labels from the actual week data
  const monthLabels: { label: string; startCol: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date).getMonth();
    if (month !== lastMonth) {
      monthLabels.push({
        label: new Date(firstDay.date).toLocaleString("default", {
          month: "short",
        }),
        startCol: i,
      });
      lastMonth = month;
    }
  });

  useEffect(() => {
    const update = () => {
      if (!gridRef.current) return;
      const available = gridRef.current.offsetWidth - dayLabelWidth;
      const size = (available - (numWeeks - 1) * gap) / numWeeks;
      setCellSize(Math.max(3, size));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [numWeeks]);

  const colStep = cellSize + gap;

  return (
    <Tilt className="flex flex-col gap-3 bg-black/5 dark:bg-white/5 text-gray-700 dark:text-white rounded-xl p-4 overflow-hidden">
      {/* Header */}
      <div className="text-sm font-bold">
        {totalContributions.toLocaleString()} contributions in the last 6 months
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
        <span>{totalCommits} commits</span>
        <span>{totalPRs} PRs</span>
        <span>{totalIssues} issues</span>
        <span>{totalRepos} repos</span>
      </div>

      {/* Grid container */}
      <div ref={gridRef} className="w-full overflow-hidden">
        {cellSize > 0 && (
          <>
            {/* Month labels */}
            <div
              className="relative mb-1"
              style={{ height: 14, marginLeft: `${dayLabelWidth}px` }}
            >
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="absolute text-[10px] text-gray-500 dark:text-gray-400"
                  style={{ left: `${m.startCol * colStep}px` }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="flex" style={{ gap: `${gap}px` }}>
              {/* Day labels */}
              <div
                className="flex flex-col shrink-0"
                style={{ width: `${dayLabelWidth - gap}px`, gap: `${gap}px` }}
              >
                {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-gray-500 dark:text-gray-400 text-right"
                    style={{
                      height: `${cellSize}px`,
                      lineHeight: `${cellSize}px`,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Weeks */}
              {weeks.map((week, wi) => (
                <div
                  key={wi}
                  className="flex flex-col"
                  style={{ gap: `${gap}px` }}
                >
                  {week.contributionDays.map((day, di) => (
                    <div
                      key={di}
                      className={`rounded-[2px] ${levelColors[day.contributionLevel]}`}
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                      }}
                      title={`${day.contributionCount} contributions on ${day.date}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500 dark:text-gray-400">
        <span>Less</span>
        {legendLevels.map((level) => (
          <div
            key={level}
            className={`w-[11px] h-[11px] rounded-sm ${levelColors[level]}`}
          />
        ))}
        <span>More</span>
      </div>
    </Tilt>
  );
};

export default GitHubActivity;
