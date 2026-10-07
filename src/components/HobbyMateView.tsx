import React, { useState } from "react";
import { HobbySuggestion } from "../types/twin";

interface HobbyMateViewProps {
  hobbies: HobbySuggestion[];
  onCompleteHobby: (hobbyId: string) => void;
}

export const HobbyMateView: React.FC<HobbyMateViewProps> = ({
  hobbies,
  onCompleteHobby,
}) => {
  const [selectedMood, setSelectedMood] = useState<"mentally_tired" | "restless" | "drained" | "curious">("mentally_tired");
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [freeMinutes, setFreeMinutes] = useState<number>(20);
  const [actionNotice, setActionNotice] = useState<string>("");

  const moodCategoryPreference: Record<string, string[]> = {
    mentally_tired: ["reflective", "creative"],
    restless: ["physical"],
    drained: ["reflective", "creative"],
    curious: ["creative", "reflective"],
  };

  const filteredSuggestions = hobbies
    .filter((hobby) => {
      if (energyLevel <= 4 && hobby.energyRequired === "high") return false;
      if (freeMinutes < hobby.durationMinutes) return false;
      return true;
    })
    .sort((a, b) => {
      const preferredCategories = moodCategoryPreference[selectedMood] || [];
      const aMatches = preferredCategories.includes(a.category) ? 1 : 0;
      const bMatches = preferredCategories.includes(b.category) ? 1 : 0;
      return bMatches - aMatches;
    });

  const handleAction = (hobbyId: string, title: string) => {
    onCompleteHobby(hobbyId);
    setActionNotice(`Logged "${title}" into your recreation balance.`);
    setTimeout(() => setActionNotice(""), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="gradient-title">Passions & Breaks</h1>
        <p className="text-[var(--muted)] text-[1.02rem] mt-2 mb-6">
          Recharging is not procrastination. Contextual offline moments when mental clarity dips.
        </p>
      </div>

      {actionNotice && (
        <div className="box-desc text-xs font-semibold text-emerald-800 bg-[#E8F8F2] border border-[#BDEBD9]">
          ✨ {actionNotice}
        </div>
      )}

      {/* Inputs Card */}
      <section className="card-aesthetic space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mood Selector */}
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] mb-2 block">Current Feeling</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "mentally_tired" as const, label: "Fatigued" },
                { id: "restless" as const, label: "Restless" },
                { id: "drained" as const, label: "Drained" },
                { id: "curious" as const, label: "Curious" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMood(m.id)}
                  className={`dur-btn text-xs ${selectedMood === m.id ? "on" : ""}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-[var(--muted)]">Energy Level</span>
              <span className="font-fraunces text-base font-semibold text-[var(--rose)]">{energyLevel} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full accent-[#F472B6] bg-[var(--line)] h-1.5 rounded-lg appearance-none cursor-pointer mt-3"
            />
          </div>

          {/* Free Buffer */}
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] mb-2 block">Available Window</label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setFreeMinutes(mins)}
                  className={`dur-btn text-xs ${freeMinutes === mins ? "on" : ""}`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Suggestions List */}
      <div className="space-y-4">
        <h2 className="font-fraunces text-2xl font-medium text-[var(--text)]">Recommended Recharges</h2>

        {filteredSuggestions.length === 0 ? (
          <p className="text-xs text-[var(--muted)] py-4">No activities match your current time window.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSuggestions.map((item) => (
              <div
                key={item.id}
                className="card-aesthetic space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-fraunces text-xl font-medium text-[var(--text)]">{item.title}</h3>
                    <span className="chip-pill text-xs py-1 px-3">
                      {item.durationMinutes}m
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleAction(item.id, item.title)}
                    className="btn-shimmer text-xs py-2.5 px-6 w-full"
                  >
                    Log Completed Break
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
