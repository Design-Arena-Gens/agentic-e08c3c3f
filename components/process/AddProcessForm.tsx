"use client";

import { useState } from "react";
import type { ProcessDescriptor } from "@/lib/types";
import { uid } from "@/lib/utils";

interface AddProcessFormProps {
  onAdd: (process: ProcessDescriptor) => void;
}

const initialState = {
  name: "",
  arrivalTime: "",
  burstTime: "",
  priority: "",
  ioBoundFactor: "0.5",
  memoryFootprint: "128"
};

const AddProcessForm = ({ onAdd }: AddProcessFormProps) => {
  const [form, setForm] = useState(initialState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const arrivalTime = Number(form.arrivalTime);
    const burstTime = Number(form.burstTime);
    const priority = Number(form.priority);
    const ioBoundFactor = Number(form.ioBoundFactor);
    const memoryFootprint = Number(form.memoryFootprint);

    if (Number.isNaN(arrivalTime) || Number.isNaN(burstTime) || Number.isNaN(priority)) {
      return;
    }

    onAdd({
      id: uid("P"),
      name: form.name || `P-${uid().slice(-3)}`,
      arrivalTime,
      burstTime,
      priority,
      ioBoundFactor,
      memoryFootprint
    });

    setForm(initialState);
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-3xl border border-slate-700/70 bg-slate-900/70 p-6 backdrop-blur lg:grid-cols-3"
    >
      <div className="lg:col-span-3">
        <h3 className="text-lg font-semibold text-slate-100">Inject Process</h3>
        <p className="text-sm text-slate-400">
          Provide process characteristics; AI models will refine burst times, priorities, and time quantums automatically.
        </p>
      </div>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        Name
        <input
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="P11"
          className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-2 text-slate-100 outline-none transition focus:border-blue-500/60 focus:bg-slate-900/80"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        Arrival Time
        <input
          value={form.arrivalTime}
          onChange={(event) => updateField("arrivalTime", event.target.value)}
          placeholder="24"
          type="number"
          className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-2 text-slate-100 outline-none transition focus:border-blue-500/60 focus:bg-slate-900/80"
          required
          min={0}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        Burst Time
        <input
          value={form.burstTime}
          onChange={(event) => updateField("burstTime", event.target.value)}
          placeholder="12"
          type="number"
          className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-2 text-slate-100 outline-none transition focus:border-blue-500/60 focus:bg-slate-900/80"
          required
          min={1}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        Priority
        <input
          value={form.priority}
          onChange={(event) => updateField("priority", event.target.value)}
          placeholder="3"
          type="number"
          className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-2 text-slate-100 outline-none transition focus:border-blue-500/60 focus:bg-slate-900/80"
          required
          min={1}
          max={10}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        I/O Bound Factor
        <input
          value={form.ioBoundFactor}
          onChange={(event) => updateField("ioBoundFactor", event.target.value)}
          placeholder="0.3"
          type="number"
          step="0.1"
          className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-2 text-slate-100 outline-none transition focus:border-blue-500/60 focus:bg-slate-900/80"
          min={0}
          max={1}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        Memory Footprint (MB)
        <input
          value={form.memoryFootprint}
          onChange={(event) => updateField("memoryFootprint", event.target.value)}
          placeholder="128"
          type="number"
          className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-2 text-slate-100 outline-none transition focus:border-blue-500/60 focus:bg-slate-900/80"
          min={16}
        />
      </label>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-400/40 focus-visible:outline-none"
        >
          Add & Predict
        </button>
      </div>
    </form>
  );
};

export default AddProcessForm;
