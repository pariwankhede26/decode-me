import React, { useState } from "react";
import { TabKey } from "../types/twin";

interface SmartNudgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabKey) => void;
}

export const SmartNudgesModal: React.FC<SmartNudgesModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [activeNudge, setActiveNudge] = useState<number>(0);

  if (!isOpen) return null;

  const nudges = [
    {
      id: 0,
      title: "Upcoming Study Window",
      notificationText: "Your planned study session starts in 15 minutes. Prepare Focus Guardian?",
      actionLabel: "Open Focus Guardian",
      targetTab: "focus_guardian" as TabKey,
    },
    {
      id: 1,
      title: "Frequent App Switching",
      notificationText: "You have been switching apps frequently. Start a 25-minute focus block?",
      actionLabel: "Start Focus Block",
      targetTab: "focus_guardian" as TabKey,
    },
    {
      id: 2,
      title: "Free Time Buffer",
      notificationText: "You have 40 minutes of free time before your next scheduled block. Need a break?",
      actionLabel: "View HobbyMate Breaks",
      targetTab: "hobbymate" as TabKey,
    },
  ];

  const handleAction = (tab: TabKey) => {
    onClose();
    onNavigateTab(tab);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="card-aesthetic max-w-lg w-full space-y-5 shadow-2xl bg-white">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--rose)]">Context Signals</span>
            <h3 className="font-fraunces text-2xl font-medium text-[var(--text)]">Smart Nudges Simulator</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost text-xs"
          >
            Close
          </button>
        </div>

        <p className="text-xs text-[var(--muted)]">
          Context-aware notifications triggered by your schedule and routine transitions:
        </p>

        {/* List of nudges */}
        <div className="space-y-3">
          {nudges.map((nudge) => {
            const isSelected = activeNudge === nudge.id;
            return (
              <div
                key={nudge.id}
                onClick={() => setActiveNudge(nudge.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? "bg-[var(--blush)] border-[var(--pink)]"
                    : "bg-white border-[var(--line)] hover:border-[var(--pink)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-fraunces text-base font-medium text-[var(--text)]">{nudge.title}</h4>
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed italic">
                  "{nudge.notificationText}"
                </p>

                {isSelected && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(nudge.targetTab);
                      }}
                      className="btn-shimmer text-xs py-2 px-5"
                    >
                      {nudge.actionLabel}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
