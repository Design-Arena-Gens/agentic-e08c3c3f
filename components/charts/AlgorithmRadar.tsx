"use client";

import { memo, useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import type { SchedulerSimulation, SchedulingAlgorithm } from "@/lib/types";

interface AlgorithmRadarProps {
  simulations: Partial<Record<SchedulingAlgorithm, SchedulerSimulation>>;
}

const metrics: Array<{ key: keyof SchedulerSimulation["metrics"]; label: string }> = [
  { key: "averageWaitingTime", label: "Waiting" },
  { key: "averageTurnaroundTime", label: "Turnaround" },
  { key: "averageResponseTime", label: "Response" },
  { key: "throughput", label: "Throughput" },
  { key: "cpuUtilization", label: "CPU Util." }
];

const AlgorithmRadar = memo(({ simulations }: AlgorithmRadarProps) => {
  const data = useMemo(() => {
    const algorithms = Object.keys(simulations) as SchedulingAlgorithm[];
    if (!algorithms.length) return [];
    return metrics.map((metric) => {
      const entry: Record<string, number | string> = { metric: metric.label };
      algorithms.forEach((algorithm) => {
        const simulation = simulations[algorithm];
        if (simulation) {
          entry[algorithm] = simulation.metrics[metric.key];
        }
      });
      return entry;
    });
  }, [simulations]);

  if (!data.length) {
    return null;
  }

  const algorithms = Object.keys(simulations) as SchedulingAlgorithm[];

  const palette = ["#60a5fa", "#e879f9", "#34d399", "#fbbf24", "#a855f7"];

  return (
    <div className="rounded-3xl border border-slate-700/70 bg-slate-900/70 p-6 backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Algorithm Comparison</p>
          <h3 className="text-lg font-semibold text-slate-100">
            Multi-Objective Performance Radar
          </h3>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer>
          <RadarChart data={data} margin={{ top: 20, bottom: 20, left: 10, right: 10 }}>
            <PolarGrid stroke="rgba(148, 163, 184, 0.4)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#cbd5f5", fontSize: 12 }} />
            <PolarRadiusAxis tick={{ fill: "#94a3b8", fontSize: 10 }} stroke="rgba(148, 163, 184, 0.2)" />
            {algorithms.map((algorithm, index) => (
              <Radar
                key={algorithm}
                name={algorithm}
                dataKey={algorithm}
                stroke={palette[index % palette.length]}
                fill={palette[index % palette.length]}
                fillOpacity={0.2}
              />
            ))}
            <Tooltip
              wrapperStyle={{ outline: "none" }}
              contentStyle={{
                background: "rgba(15,23,42,0.92)",
                border: "1px solid rgba(148, 163, 184, 0.3)",
                borderRadius: 14,
                color: "#e2e8f0"
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

AlgorithmRadar.displayName = "AlgorithmRadar";

export default AlgorithmRadar;
