"use client";

import { useEffect, useMemo, useState } from "react";
import AddProcessForm from "@/components/process/AddProcessForm";
import ProcessTable from "@/components/process/ProcessTable";
import MetricCards from "@/components/metrics/MetricCards";
import ScheduleTimeline from "@/components/charts/ScheduleTimeline";
import AlgorithmRadar from "@/components/charts/AlgorithmRadar";
import type {
  HistoricalRecord,
  ProcessDescriptor,
  SchedulerSimulation,
  SchedulingAlgorithm
} from "@/lib/types";
import { buildModels, predictAttributes, type AIModelBundle } from "@/lib/ai/predictor";
import { runScheduler } from "@/lib/scheduling";
import { uid } from "@/lib/utils";

const algorithms: SchedulingAlgorithm[] = ["FCFS", "SJF", "RR", "PRIORITY", "HYBRID"];

const schedulerTitle = {
  FCFS: "First Come First Served",
  SJF: "Shortest Job First",
  RR: "Round Robin",
  PRIORITY: "Dynamic Priority Queue",
  HYBRID: "AI-Driven Hybrid"
};

const SchedulerDashboard = () => {
  const [historicalRecords, setHistoricalRecords] = useState<HistoricalRecord[]>([]);
  const [models, setModels] = useState<AIModelBundle | null>(null);
  const [processes, setProcesses] = useState<ProcessDescriptor[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SchedulingAlgorithm>("HYBRID");
  const [quantum, setQuantum] = useState(8);
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const response = await fetch("/data/historical_jobs.json");
        if (!response.ok) {
          throw new Error(`Unable to read historical dataset (${response.status})`);
        }
        const data: HistoricalRecord[] = await response.json();
        setHistoricalRecords(data);
        setProcesses(
          data.slice(0, 6).map((record, index) => ({
            id: uid("H"),
            name: `Job-${index + 1}`,
            arrivalTime: record.arrivalTime,
            burstTime: record.cpuBurst,
            priority: record.priority,
            ioBoundFactor: record.ioBoundFactor,
            memoryFootprint: record.memoryFootprint,
            quantum: record.observedQuantum
          }))
        );
      } catch (cause) {
        setError((cause as Error).message);
      }
    };

    void loadRecords();
  }, []);

  const trainModels = () => {
    if (!historicalRecords.length) {
      setError("Historical dataset not loaded yet.");
      return;
    }
    try {
      setError(null);
      setIsTraining(true);
      const bundle = buildModels(historicalRecords);
      setModels(bundle);
      setProcesses((prev) =>
        prev.map((process) => {
          const predicted = predictAttributes(process, bundle);
          return {
            ...process,
            burstTime: (process.burstTime * 0.5 + predicted.burstTime * 0.5),
            priority: (process.priority * 0.4 + predicted.priority * 0.6),
            quantum: predicted.quantum,
            memoryFootprint: predicted.memoryFootprint,
            predicted
          };
        })
      );
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setIsTraining(false);
    }
  };

  const handleAddProcess = (process: ProcessDescriptor) => {
    if (models) {
      const predicted = predictAttributes(process, models);
      setProcesses((prev) => [
        ...prev,
        {
          ...process,
          burstTime: (process.burstTime * 0.5 + predicted.burstTime * 0.5),
          priority: (process.priority * 0.4 + predicted.priority * 0.6),
          quantum: predicted.quantum,
          memoryFootprint: predicted.memoryFootprint,
          predicted
        }
      ]);
    } else {
      setProcesses((prev) => [...prev, process]);
    }
  };

  const handleRemoveProcess = (processId: string) => {
    setProcesses((prev) => prev.filter((process) => process.id !== processId));
  };

  const simulations = useMemo(() => {
    if (!processes.length) return {} as Record<SchedulingAlgorithm, SchedulerSimulation>;
    return algorithms.reduce((accumulator, algorithm) => {
      accumulator[algorithm] = runScheduler(processes, algorithm, { quantum });
      return accumulator;
    }, {} as Record<SchedulingAlgorithm, SchedulerSimulation>);
  }, [processes, quantum]);

  const activeSimulation = simulations[selectedAlgorithm] ?? null;

  return (
    <div className="flex flex-col gap-10 py-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-blue-400">
          Agentic Operating System Scheduler
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-50">
          AI-Augmented CPU Scheduling Workbench
        </h1>
        <p className="max-w-3xl text-base text-slate-300">
          Combine classic CPU scheduling strategies with machine-learning intelligence that adapts
          to workload volatility. Train predictive models from historical traces, generate burst-time
          forecasts, and compare strategies through interactive metrics and timeline analytics.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/70 p-6 backdrop-blur">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Scheduler Mode</p>
              <h2 className="text-2xl font-semibold text-slate-100">{schedulerTitle[selectedAlgorithm]}</h2>
            </div>
            <div className="flex gap-2">
              {algorithms.map((algorithm) => (
                <button
                  key={algorithm}
                  type="button"
                  onClick={() => setSelectedAlgorithm(algorithm)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                    selectedAlgorithm === algorithm
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/40"
                      : "border border-slate-600/70 text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  {algorithm}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Quantum</p>
              <div className="mt-2 flex items-center gap-4">
                <input
                  type="range"
                  min={2}
                  max={20}
                  value={quantum}
                  onChange={(event) => setQuantum(Number(event.target.value))}
                  className="w-full accent-blue-500"
                />
                <span className="w-12 rounded-full bg-slate-800/70 py-1 text-center text-sm font-semibold text-blue-300">
                  {quantum}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button
                type="button"
                onClick={trainModels}
                disabled={isTraining}
                className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-slate-900 shadow-lg shadow-blue-500/30 transition hover:shadow-blue-400/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isTraining ? "Training models..." : "Train AI models"}
              </button>
              {error && <p className="mt-2 text-xs font-semibold text-rose-300">⚠ {error}</p>}
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-slate-900 p-6 text-slate-100 shadow-lg shadow-blue-500/20">
          <h3 className="text-lg font-semibold">AI Inference Snapshot</h3>
          <p className="mt-2 text-sm text-slate-200/80">
            Models leverage Random Forest regressors trained on execution traces to infer realistic burst durations,
            priority boosts, time-slice quantums, and memory footprints. Predictions blend with user-provided hints to create a resilient execution plan.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            <li>• Ensemble depth-adaptive regression for burst predictions</li>
            <li>• Dynamic priority shaping informed by IO-boundedness</li>
            <li>• Adaptive quantum sizing for fairness under load</li>
            <li>• Continuous feedback loop through historical trace enrichment</li>
          </ul>
        </div>
      </div>

      <AddProcessForm onAdd={handleAddProcess} />

      {activeSimulation ? (
        <>
          <MetricCards metrics={activeSimulation.metrics} />
          <ScheduleTimeline timeline={activeSimulation.timeline} algorithm={selectedAlgorithm} />
        </>
      ) : (
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/60 p-10 text-center text-slate-300">
          <p>Feed the scheduler with processes to visualise execution analytics.</p>
        </div>
      )}

      <AlgorithmRadar simulations={simulations} />

      <ProcessTable
        processes={processes}
        summaries={activeSimulation?.processes ?? []}
        onRemove={handleRemoveProcess}
      />
    </div>
  );
};

export default SchedulerDashboard;
