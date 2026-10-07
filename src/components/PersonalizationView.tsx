import React, { useState } from "react";
import { PersonalizationConfig } from "../types/twin";

interface PersonalizationViewProps {
  config: PersonalizationConfig;
  onUpdateConfig: (config: PersonalizationConfig) => void;
}

export const PersonalizationView: React.FC<PersonalizationViewProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [style, setStyle] = useState(config.interventionStyle);
  const [targetFocusHours, setTargetFocusHours] = useState(config.targetFocusHoursDaily);
  const [dailyScreenLimit, setDailyScreenLimit] = useState(config.dailyScreenLimitMinutes);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(config.primaryGoals);
  const [saveNotice, setSaveNotice] = useState("");

  const availableGoals = [
    "Reduce pre-study distraction loops",
    "Identify personal energy peaks",
    "Establish reliable offline breaks",
    "Track nutrition and focus correlation",
    "Protect morning deep work blocks",
  ];

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSave = () => {
    onUpdateConfig({
      interventionStyle: style,
      targetFocusHoursDaily: targetFocusHours,
      dailyScreenLimitMinutes: dailyScreenLimit,
      primaryGoals: selectedGoals,
    });
    setSaveNotice("Preferences saved.");
    setTimeout(() => setSaveNotice(""), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="gradient-title">Personalize</h1>
        <p className="text-[var(--muted)] text-[1.02rem] mt-2 mb-6">
          Configure how proactively Decode Me guides and nudges your daily routine.
        </p>
      </div>

      {saveNotice && (
        <div className="box-desc text-xs font-semibold text-emerald-800 bg-[#E8F8F2] border border-[#BDEBD9]">
          ✨ {saveNotice}
        </div>
      )}

      {/* Main Settings Card */}
      <section className="card-aesthetic space-y-8">
        {/* Intervention Disposition */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[var(--muted)] block">Nudge Disposition</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "gentle" as const, label: "Gentle", desc: "Suggestions only" },
              { id: "balanced" as const, label: "Balanced", desc: "Suggestions + warnings" },
              { id: "focused" as const, label: "Focused", desc: "Active friction during study" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStyle(item.id)}
                className={`card-aesthetic cursor-pointer text-left p-4 transition-all ${
                  style === item.id
                    ? "ring-2 ring-[var(--pink)]"
                    : "hover:border-[var(--pink)]"
                }`}
              >
                <span className="font-fraunces text-base font-semibold block text-[var(--text)]">{item.label}</span>
                <span className="text-[11px] text-[var(--muted)] mt-1 block">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[var(--line)]">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[var(--muted)]">Target Daily Focus</span>
              <span className="font-fraunces text-base font-semibold text-[var(--rose)]">{targetFocusHours} hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={targetFocusHours}
              onChange={(e) => setTargetFocusHours(Number(e.target.value))}
              className="w-full accent-[#F472B6] bg-[var(--line)] h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[var(--muted)]">Daily Screen Budget</span>
              <span className="font-fraunces text-base font-semibold text-[var(--rose)]">{dailyScreenLimit} minutes</span>
            </div>
            <input
              type="range"
              min="30"
              max="240"
              step="15"
              value={dailyScreenLimit}
              onChange={(e) => setDailyScreenLimit(Number(e.target.value))}
              className="w-full accent-[#F472B6] bg-[var(--line)] h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Priority Focus Areas */}
        <div className="space-y-3 pt-6 border-t border-[var(--line)]">
          <label className="text-xs font-semibold text-[var(--muted)] block">Priority Habit Focus Areas</label>
          <div className="space-y-2">
            {availableGoals.map((goal) => {
              const isSelected = selectedGoals.includes(goal);
              return (
                <div
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? "bg-[var(--blush)] border-[var(--pink)] text-[var(--rose)] font-semibold"
                      : "bg-white border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  <span>{goal}</span>
                  <span className="chip-pill text-[10px] py-0.5 px-2.5">
                    {isSelected ? "Active" : "Off"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={handleSave}
            className="btn-shimmer text-xs py-3 px-8"
          >
            Save Preferences
          </button>
        </div>
      </section>
    </div>
  );
};
