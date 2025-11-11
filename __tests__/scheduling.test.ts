import { runScheduler } from "@/lib/scheduling";
import type { ProcessDescriptor, SchedulingAlgorithm } from "@/lib/types";

const sampleProcesses: ProcessDescriptor[] = [
  {
    id: "P1",
    name: "P1",
    arrivalTime: 0,
    burstTime: 5,
    priority: 3,
    ioBoundFactor: 0.2,
    memoryFootprint: 128
  },
  {
    id: "P2",
    name: "P2",
    arrivalTime: 1,
    burstTime: 3,
    priority: 1,
    ioBoundFactor: 0.4,
    memoryFootprint: 96
  },
  {
    id: "P3",
    name: "P3",
    arrivalTime: 2,
    burstTime: 8,
    priority: 4,
    ioBoundFactor: 0.5,
    memoryFootprint: 200
  }
];

const algorithms: SchedulingAlgorithm[] = ["FCFS", "SJF", "RR", "PRIORITY", "HYBRID"];

describe("runScheduler", () => {
  algorithms.forEach((algorithm) => {
    it(`produces a timeline and metrics for ${algorithm}`, () => {
      const result = runScheduler(sampleProcesses, algorithm, { quantum: 4 });
      expect(result.timeline.length).toBeGreaterThan(0);
      expect(result.metrics.averageWaitingTime).toBeGreaterThanOrEqual(0);
      expect(result.metrics.cpuUtilization).toBeGreaterThanOrEqual(0);
    });
  });

  it("respects quantum parameter for round robin", () => {
    const rr = runScheduler(sampleProcesses, "RR", { quantum: 2 });
    const slicesOfP1 = rr.timeline.filter((slot) => slot.processId === "P1");
    expect(slicesOfP1.length).toBeGreaterThan(1);
  });
});
