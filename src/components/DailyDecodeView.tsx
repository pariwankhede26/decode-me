import React, { useState } from "react";
import { DailyDecodePlan, ReflectionEntry } from "../types/twin";

interface DailyDecodeViewProps {
  plan: DailyDecodePlan;
  onUpdatePlan: (plan: DailyDecodePlan) => void;
  reflections: ReflectionEntry[];
  onAddReflection: (entry: ReflectionEntry) => void;
}

export const DailyDecodeView: React.FC<DailyDecodeViewProps> = ({
  plan,
  onUpdatePlan,
  reflections,
  onAddReflection,
}) => {
  const [priorityTask, setPriorityTask] = useState(plan.priorityTask);
  const [suggestedFocusWindow, setSuggestedFocusWindow] = useState(plan.suggestedFocusWindow);
  const [digitalBudgetHours, setDigitalBudgetHours] = useState(plan.digitalBudgetHours);
  const [planNotice, setPlanNotice] = useState("");

  const [selectedMood, setSelectedMood] = useState<"great" | "good" | "okay" | "rough">("good");
  const [energyScore, setEnergyScore] = useState<number>(7);
  const [focusScore, setFocusScore] = useState<number>(8);
  const [reflectionNotes, setReflectionNotes] = useState("");
  const [reflectionNotice, setReflectionNotice] = useState("");
  const [showPastReflections, setShowPastReflections] = useState(false);

  const handleSavePlan = () => {
    onUpdatePlan({
      ...plan,
      priorityTask,
      suggestedFocusWindow,
      digitalBudgetHours,
    });
    setPlanNotice("Morning plan updated.");
    setTimeout(() => setPlanNotice(""), 3000);
  };

  const handleSaveReflection = () => {
    if (!reflectionNotes.trim()) return;

    const newEntry: ReflectionEntry = {
      id: "rf-" + Date.now(),
      date: "Today",
      moodRating: selectedMood,
      energyScore,
      focusScore,
      notes: reflectionNotes,
      timestamp: "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    onAddReflection(newEntry);
    setReflectionNotes("");
    setReflectionNotice("Reflection recorded.");
    setTimeout(() => setReflectionNotice(""), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="gradient-title">Today</h1>
        <p className="text-[var(--muted)] text-[1.02rem] mt-2 mb-6">
          Morning intention setting and evening mindful check-in to calibrate your twin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Morning Plan Card */}
        <section className="card-aesthetic space-y-5">
          <div className="border-b border-[var(--line)] pb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--rose)]">Morning Clarity</span>
            <h2 className="font-fraunces text-2xl font-medium text-[var(--text)]">Day's Intention</h2>
          </div>

          {planNotice && (
            <div className="box-desc text-xs font-semibold text-emerald-800 bg-[#E8F8F2] border border-[#BDEBD9]">
              ✨ {planNotice}
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-semibold text-[var(--muted)] mb-1.5 block">Today's Priority Task</label>
              <input
                type="text"
                value={priorityTask}
                onChange={(e) => setPriorityTask(e.target.value)}
                className="input-aesthetic text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--muted)] mb-1.5 block">Suggested Focus Window</label>
              <input
                type="text"
                value={suggestedFocusWindow}
                onChange={(e) => setSuggestedFocusWindow(e.target.value)}
                className="input-aesthetic text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--muted)] mb-1.5 block">Screen Budget (Hours)</label>
              <input
                type="number"
                step="0.5"
                value={digitalBudgetHours}
                onChange={(e) => setDigitalBudgetHours(Number(e.target.value))}
                className="input-aesthetic text-xs"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSavePlan}
            className="btn-shimmer text-xs py-3 px-6 w-full"
          >
            Save Morning Plan
          </button>
        </section>

        {/* Evening Reflection Card */}
        <section className="card-aesthetic space-y-5">
          <div className="border-b border-[var(--line)] pb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--rose)]">Evening Review</span>
            <h2 className="font-fraunces text-2xl font-medium text-[var(--text)]">Context Check-In</h2>
          </div>

          {reflectionNotice && (
            <div className="box-desc text-xs font-semibold text-emerald-800 bg-[#E8F8F2] border border-[#BDEBD9]">
              ✨ {reflectionNotice}
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-semibold text-[var(--muted)] mb-2 block">How was your balance today?</label>
              <div className="grid grid-cols-4 gap-2">
                {(["great", "good", "okay", "rough"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    className={`dur-btn text-xs capitalize ${selectedMood === m ? "on" : ""}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-[var(--muted)]">
                  <span>Energy</span>
                  <span className="font-fraunces text-sm font-semibold text-[var(--rose)]">{energyScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyScore}
                  onChange={(e) => setEnergyScore(Number(e.target.value))}
                  className="w-full accent-[#F472B6] bg-[var(--line)] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-[var(--muted)]">
                  <span>Focus Depth</span>
                  <span className="font-fraunces text-sm font-semibold text-[var(--rose)]">{focusScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={focusScore}
                  onChange={(e) => setFocusScore(Number(e.target.value))}
                  className="w-full accent-[#F472B6] bg-[var(--line)] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--muted)] mb-1.5 block">Contextual Note</label>
              <textarea
                rows={3}
                value={reflectionNotes}
                onChange={(e) => setReflectionNotes(e.target.value)}
                placeholder="What influenced your focus and energy today?"
                className="input-aesthetic text-xs"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={!reflectionNotes.trim()}
            onClick={handleSaveReflection}
            className="btn-shimmer text-xs py-3 px-6 w-full disabled:opacity-50"
          >
            Record Reflection
          </button>
        </section>
      </div>

      {/* Expandable Past Reflections List */}
      <section className="card-aesthetic space-y-4">
        <button
          type="button"
          onClick={() => setShowPastReflections(!showPastReflections)}
          className="w-full flex items-center justify-between text-left text-sm font-semibold text-[var(--text)]"
        >
          <span>Past Reflections ({reflections.length})</span>
          <span className="text-[var(--rose)] text-xs">{showPastReflections ? "Hide" : "Show"}</span>
        </button>

        {showPastReflections && (
          <div className="pt-3 border-t border-[var(--line)] space-y-2.5">
            {reflections.map((r) => (
              <div key={r.id} className="py-2.5 px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs space-y-1">
                <div className="flex justify-between items-center text-[var(--muted)]">
                  <span className="font-fraunces text-sm font-semibold text-[var(--text)]">{r.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--muted)]">⚡ {r.energyScore}/10 &middot; 🎯 {r.focusScore}/10</span>
                    <span className="capitalize chip-pill text-[10px] py-0.5 px-2.5">{r.moodRating}</span>
                  </div>
                </div>
                <p className="text-[var(--text)] italic">"{r.notes}"</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
