"use client";

import { memo, useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { TimelineSlot } from "@/lib/types";
import { gradientForAlgorithm } from "@/lib/utils";

interface ScheduleTimelineProps {
  timeline: TimelineSlot[];
  algorithm: string;
}

interface TimelineEntry {
  label: string;
  start: number;
  duration: number;
  processId: string;
}

const colors = [
  "#60a5fa",
  "#f472b6",
  "#34d399",
  "#fbbf24",
  "#38bdf8",
  "#a855f7",
  "#fb7185",
  "#bef264",
  "#f97316",
  "#22d3ee"
];

const ScheduleTimeline = memo(({ timeline, algorithm }: ScheduleTimelineProps) => {
  const data = useMemo(() => {
    return timeline.map((slot, index) => ({
      label: `${slot.processId} #${index + 1}`,
      start: slot.start,
      duration: slot.end - slot.start,
      processId: slot.processId
    }));
  }, [timeline]);

  const domain = useMemo(() => {
    if (!timeline.length) return [0, 10];
    const max = Math.max(...timeline.map((slot) => slot.end));
    return [0, Math.ceil(max * 1.05)];
  }, [timeline]);

  return (
    <div className="rounded-3xl border border-slate-700/70 bg-slate-900/60 p-6 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Execution Timeline</p>
          <h3 className="text-lg font-semibold text-slate-100">Gantt Visualization</h3>
        </div>
        <span
          className={`rounded-full bg-gradient-to-r ${gradientForAlgorithm(
            algorithm
          )} px-4 py-1 text-xs font-semibold text-slate-900 shadow-lg`}
        >
          {algorithm}
        </span>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 40, bottom: 10 }}
            barSize={20}
          >
            <XAxis type="number" domain={domain} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis
              dataKey="label"
              type="category"
              tick={{ fill: "#cbd5f5", fontSize: 11 }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.05)" }}
              contentStyle={{
                background: "rgba(15, 23, 42, 0.92)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: 12,
                color: "#e2e8f0"
              }}
              formatter={(value, key, payload) => {
                if (key === "duration") {
                  return [`${value} units`, "Duration"];
                }
                if (key === "start") {
                  return [`${value}`, "Start Time"];
                }
                return [value, key];
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconSize={12}
              formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
            />
            <ReferenceLine x={0} stroke="rgba(148, 163, 184, 0.3)" />
            <Bar
              dataKey="start"
              stackId="a"
              style={{ fill: "transparent" }}
              isAnimationActive={false}
            />
            <Bar dataKey="duration" stackId="a" radius={[0, 12, 12, 0]} fillOpacity={0.9}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.label}`}
                  cursor="pointer"
                  fill={colors[index % colors.length]}
                  className="drop-shadow-lg"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

ScheduleTimeline.displayName = "ScheduleTimeline";

export default ScheduleTimeline;
