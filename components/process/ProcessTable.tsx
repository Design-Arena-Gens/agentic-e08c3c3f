"use client";

import type { ProcessDescriptor, ProcessSummary } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface ProcessTableProps {
  processes: ProcessDescriptor[];
  summaries: ProcessSummary[];
  onRemove: (processId: string) => void;
}

const headers = [
  "Process",
  "Arrival",
  "Burst",
  "Priority",
  "IO Factor",
  "Memory",
  "Pred. Burst",
  "Pred. Priority",
  "Pred. Quantum",
  "Waiting",
  "Turnaround",
  "Response",
  ""
];

const ProcessTable = ({ processes, summaries, onRemove }: ProcessTableProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/70 backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700/70">
          <thead className="bg-slate-900/80">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {processes.map((process) => {
              const summary = summaries.find((item) => item.processId === process.id);
              return (
                <tr key={process.id} className="hover:bg-slate-800/40">
                  <td className="whitespace-nowrap px-3 py-3 text-sm font-semibold text-slate-100">
                    {process.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-200">
                    {process.arrivalTime}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-200">
                    {formatNumber(process.burstTime)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-200">
                    {formatNumber(process.priority)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-200">
                    {formatNumber(process.ioBoundFactor)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-200">
                    {formatNumber(process.memoryFootprint)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-blue-300">
                    {process.predicted?.burstTime ? formatNumber(process.predicted.burstTime) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-blue-300">
                    {process.predicted?.priority ? formatNumber(process.predicted.priority) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-blue-300">
                    {process.predicted?.quantum ? formatNumber(process.predicted.quantum) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-emerald-300">
                    {summary ? formatNumber(summary.waitingTime) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-emerald-300">
                    {summary ? formatNumber(summary.turnaroundTime) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-emerald-300">
                    {summary ? formatNumber(summary.responseTime) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-sm">
                    <button
                      type="button"
                      onClick={() => onRemove(process.id)}
                      className="rounded-full border border-red-500/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300 transition hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessTable;
