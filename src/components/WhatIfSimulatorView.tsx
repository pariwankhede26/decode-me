import React, { useState } from "react";

interface WhatIfSimulatorViewProps {
  onCommitTarget: (minutesReduced: number, allocationMode: "deep_work" | "hybrid" | "sleep" | "free_time") => void;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  onCommitTarget,
}) => {
  const [dailyMinutesReduction, setDailyMinutesReduction] = useState<number>(30);
  const [allocationMode, setAllocationMode] = useState<"deep_work" | "hybrid" | "sleep" | "free_time">("deep_work");
  const [committedFeedback, setCommittedFeedback] = useState<string>("");

  const weeklyRecoveredMinutes = dailyMinutesReduction * 7;
  const weeklyRecoveredHours = (weeklyRecoveredMinutes / 60).toFixed(1);
  const focusSessionCount = Math.floor(weeklyRecoveredMinutes / 45);

  const handleCommit = () => {
    onCommitTarget(dailyMinutesReduction, allocationMode);
    const modeLabel = allocationMode === "deep_work" ? "Deep Work" : allocationMode === "hybrid" ? "Focus + Breaks" : allocationMode === "sleep" ? "Sleep Buffer" : "Free Time";
    setCommittedFeedback(`Target applied: daily screen budget reduced by ${dailyMinutesReduction}m and reallocated to ${modeLabel}.`);
    setTimeout(() => setCommittedFeedback(""), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="gradient-title">Foresight Simulator</h1>
        <p className="text-[var(--muted)] text-[1.02rem] mt-2 mb-6">
          Project the compounding cognitive hours recovered by gently curbing pre-study scrolling.
        </p>
      </div>

      {committedFeedback && (
        <div className="box-desc text-xs font-semibold text-emerald-800 bg-[#E8F8F2] border border-[#BDEBD9]">
          ✨ {committedFeedback}
        </div>
      )}

      {/* Simulator Inputs & Projection */}
      <section className="card-aesthetic space-y-8">
        {/* Slider */}
        <div className="space-y-3 max-w-md">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[var(--muted)]">Daily Screen Habit Reduction</span>
            <span className="font-fraunces text-base font-semibold text-[var(--rose)]">
              -{dailyMinutesReduction} min / day
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="90"
            step="5"
            value={dailyMinutesReduction}
            onChange={(e) => setDailyMinutesReduction(Number(e.target.value))}
            className="w-full accent-[#F472B6] bg-[var(--line)] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Projection Metric */}
        <div className="space-y-1.5">
          <span className="text-xs text-[var(--muted)] font-semibold uppercase tracking-wider block">
            Projected Weekly Recovery
          </span>
          <div className="font-fraunces text-5xl sm:text-6xl font-semibold text-[var(--rose)]">
            +{weeklyRecoveredHours} <span className="font-sans text-base font-normal text-[var(--muted)]">hours reclaimed / week</span>
          </div>
        </div>

        {/* Reallocation Target */}
        <div className="space-y-3 pt-6 border-t border-[var(--line)]">
          <label className="text-xs font-semibold text-[var(--muted)] block">Mindfully Reallocate Toward</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "deep_work" as const, label: "Deep Work Focus" },
              { id: "hybrid" as const, label: "Focus + Breaks" },
              { id: "sleep" as const, label: "Sleep Buffer" },
              { id: "free_time" as const, label: "Open Free Time" },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setAllocationMode(mode.id)}
                className={`dur-btn text-xs ${allocationMode === mode.id ? "on" : ""}`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="box-desc text-xs mt-3 leading-relaxed">
            {allocationMode === "deep_work" && `Creates room for approximately +${focusSessionCount} focused 45-minute study sessions every week.`}
            {allocationMode === "hybrid" && `Accommodates 2 calm study blocks and 2 offline HobbyMate recharge sessions.`}
            {allocationMode === "sleep" && `Protects an extra +${dailyMinutesReduction} minutes of uninterrupted restorative sleep per night.`}
            {allocationMode === "free_time" && `Leaves +${weeklyRecoveredHours} open hours with zero productivity pressure.`}
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={handleCommit}
            className="btn-shimmer text-xs py-3 px-8"
          >
            Apply Target to Daily Plan
          </button>
        </div>
      </section>
    </div>
  );
};
