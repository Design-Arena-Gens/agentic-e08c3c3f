"use client";

import type { SchedulerOutputMetrics } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

type NumericMetricKey = Exclude<keyof SchedulerOutputMetrics, "algorithm">;

interface MetricCardsProps {
  metrics: SchedulerOutputMetrics | null;
}

const metricsConfig: Array<{
  key: NumericMetricKey;
  label: string;
  suffix?: string;
}> = [
  { key: "averageWaitingTime", label: "Avg Waiting", suffix: " units" },
  { key: "averageTurnaroundTime", label: "Avg Turnaround", suffix: " units" },
  { key: "averageResponseTime", label: "Avg Response", suffix: " units" },
  { key: "throughput", label: "Throughput", suffix: " jobs/unit" },
  { key: "cpuUtilization", label: "CPU Utilization", suffix: "%" }
];

const MetricCards = ({ metrics }: MetricCardsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {metricsConfig.map(({ key, label, suffix }) => (
        <div
          key={key}
          className="rounded-3xl border border-slate-700/70 bg-slate-900/60 p-4 shadow-lg backdrop-blur"
        >
          <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {metrics ? `${formatNumber(metrics[key])}${suffix ?? ""}` : "—"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
