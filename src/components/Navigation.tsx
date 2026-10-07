import React from "react";
import { TabKey } from "../types/twin";

interface NavigationProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onOpenNudgeSimulator: () => void;
  onOpenLegalModal: (mode: "tos" | "privacy") => void;
  onNavigateHome?: () => void;
  balanceScore: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenNudgeSimulator,
  onOpenLegalModal,
  onNavigateHome,
  balanceScore,
}) => {
  const groups = [
    {
      label: "Core",
      items: [
        { id: "dashboard" as TabKey, label: "My Twin", icon: "🌸" },
        { id: "focus_guardian" as TabKey, label: "Focus", icon: "🎀" },
        { id: "nutrition_twin" as TabKey, label: "Nourish", icon: "🍓" },
        { id: "hobbymate" as TabKey, label: "Passions", icon: "🪞" },
      ],
    },
    {
      label: "Insights",
      items: [
        { id: "pattern_engine" as TabKey, label: "Patterns", icon: "✨" },
        { id: "what_if" as TabKey, label: "Foresight", icon: "🔮" },
        { id: "daily_decode" as TabKey, label: "Today", icon: "📖" },
      ],
    },
    {
      label: "You",
      items: [
        { id: "ask_twin" as TabKey, label: "Ask", icon: "💬" },
        { id: "privacy_controls" as TabKey, label: "Privacy", icon: "🔒" },
        { id: "personalization" as TabKey, label: "Personalize", icon: "🎨" },
      ],
    },
  ];

  return (
    <aside className="side-bar">
      {/* Brand logo */}
      <button
        type="button"
        onClick={onNavigateHome}
        className="logo-brand border-0 bg-transparent text-left cursor-pointer transition-transform hover:scale-[1.02]"
      >
        Decode <span>Me</span>
      </button>

      {/* Nav groups */}
      {groups.map((group) => (
        <div key={group.label} className="nav-group">
          <small>{group.label}</small>
          {group.items.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <i>{item.icon}</i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      ))}

      {/* Footer links */}
      <div className="side-foot mt-auto text-xs text-[var(--muted)] px-3 pt-4 border-t border-[var(--line)]">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onOpenLegalModal("tos")}
            className="hover:text-[var(--rose)] transition-colors bg-transparent border-0 p-0 text-inherit cursor-pointer font-inherit"
          >
            Terms
          </button>
          <span>&middot;</span>
          <button
            type="button"
            onClick={() => onOpenLegalModal("privacy")}
            className="hover:text-[var(--rose)] transition-colors bg-transparent border-0 p-0 text-inherit cursor-pointer font-inherit"
          >
            Privacy policy
          </button>
        </div>
      </div>
    </aside>
  );
};
