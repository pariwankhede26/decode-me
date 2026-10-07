import React, { useState } from "react";
import { BalanceDimensions, FocusSession, PatternInsight, TabKey } from "../types/twin";

interface DashboardViewProps {
  balance: BalanceDimensions;
  onUpdateBalance: (newBalance: BalanceDimensions) => void;
  sessions: FocusSession[];
  patterns: PatternInsight[];
  onNavigate: (tab: TabKey) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  balance,
  onUpdateBalance,
  sessions,
  patterns,
  onNavigate,
}) => {
  const [showCohortDetails, setShowCohortDetails] = useState(false);

  const handleDimensionChange = (key: keyof Omit<BalanceDimensions, "overall">, value: number) => {
    const updated = {
      ...balance,
      [key]: value,
    };
    const overall = Math.round(
      updated.focus * 0.25 +
      updated.sleepRoutine * 0.2 +
      updated.nutritionTracking * 0.15 +
      updated.recreation * 0.2 +
      updated.digitalBalance * 0.2
    );
    onUpdateBalance({ ...updated, overall });
  };

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const totalFocusMinutes = completedSessions.reduce((acc, s) => acc + s.completedMinutes, 0);

  const todayIndex = new Date().getDay(); // 0 is Sun
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDayName = dayNames[todayIndex];

  const todaySessionsMinutes = completedSessions
    .filter((s) => s.timestamp.toLowerCase().includes("today"))
    .reduce((acc, s) => acc + s.completedMinutes, 0);
  const todayFocusHours = Math.max(0.5, Number((todaySessionsMinutes / 60).toFixed(1)));

  const baseWeekDays = [
    { day: "Mon", focusHrs: 2.8, screenHrs: 4.2 },
    { day: "Tue", focusHrs: 3.5, screenHrs: 3.6 },
    { day: "Wed", focusHrs: 3.9, screenHrs: 3.1 },
    { day: "Thu", focusHrs: 4.2, screenHrs: 2.9 },
    { day: "Fri", focusHrs: 2.4, screenHrs: 4.8 },
    { day: "Sat", focusHrs: 3.1, screenHrs: 3.4 },
    { day: "Sun", focusHrs: 3.6, screenHrs: 2.8 },
  ];

  const weekDays = baseWeekDays.map((item) =>
    item.day === currentDayName
      ? { ...item, focusHrs: todaySessionsMinutes > 0 ? todayFocusHours : item.focusHrs }
      : item
  );

  return (
    <div className="space-y-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="gradient-title">My Twin</h1>
          <p className="text-[var(--muted)] text-[1.02rem] mt-2">
            Your daily rhythms connected: focus, sleep, nourish, and rest.
          </p>
        </div>

        <div>
          <button
            onClick={() => onNavigate("focus_guardian")}
            className="btn-shimmer text-xs py-3 px-6"
          >
            Start Focus Session
          </button>
        </div>
      </div>

      {/* Main Grid: Balance Dimensions & Weekly Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Balance Dimensions (7 cols) */}
        <section className="card-aesthetic lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div>
              <h2 className="font-fraunces text-2xl font-medium text-[var(--text)]">Balance Score</h2>
              <p className="text-xs text-[var(--muted)]">Harmonized across 5 daily pillars</p>
            </div>
            <div className="text-right">
              <span className="font-fraunces text-4xl sm:text-5xl font-semibold text-[var(--rose)]">
                {balance.overall}
              </span>
              <span className="text-xs text-[var(--muted)] ml-1">/ 100</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-[var(--text)] mb-2 font-medium">
                <span>Focus Depth</span>
                <span className="text-[var(--rose)] font-semibold">{balance.focus}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={balance.focus}
                onChange={(e) => handleDimensionChange("focus", Number(e.target.value))}
                className="w-full accent-[#F472B6] bg-[var(--line)] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[var(--text)] mb-2 font-medium">
                <span>Sleep Continuity</span>
                <span className="text-[var(--rose)] font-semibold">{balance.sleepRoutine}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={balance.sleepRoutine}
                onChange={(e) => handleDimensionChange("sleepRoutine", Number(e.target.value))}
                className="w-full accent-[#F472B6] bg-[var(--line)] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[var(--text)] mb-2 font-medium">
                <span>Nutrition & Energy</span>
                <span className="text-[var(--rose)] font-semibold">{balance.nutritionTracking}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={balance.nutritionTracking}
                onChange={(e) => handleDimensionChange("nutritionTracking", Number(e.target.value))}
                className="w-full accent-[#F472B6] bg-[var(--line)] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[var(--text)] mb-2 font-medium">
                <span>Breaks & Offline Passions</span>
                <span className="text-[var(--rose)] font-semibold">{balance.recreation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={balance.recreation}
                onChange={(e) => handleDimensionChange("recreation", Number(e.target.value))}
                className="w-full accent-[#F472B6] bg-[var(--line)] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[var(--text)] mb-2 font-medium">
                <span>Screen Intentionality</span>
                <span className="text-[var(--rose)] font-semibold">{balance.digitalBalance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={balance.digitalBalance}
                onChange={(e) => handleDimensionChange("digitalBalance", Number(e.target.value))}
                className="w-full accent-[#F472B6] bg-[var(--line)] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Right Column: Weekly Focus vs Screen (5 cols) */}
        <section className="card-aesthetic lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="font-fraunces text-2xl font-medium text-[var(--text)]">Weekly Trajectory</h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              Average focus: {(totalFocusMinutes / 60 || 3.3).toFixed(1)} hours / day
            </p>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2 items-end h-40">
            {weekDays.map((item) => (
              <div key={item.day} className="flex flex-col items-center text-xs h-full justify-end">
                <div className="w-full flex items-end justify-center space-x-1.5 h-28">
                  <div
                    className="w-2.5 rounded-t-full bg-gradient-to-t from-[#F472B6] to-[#C4B5FD] transition-all"
                    style={{ height: `${(item.focusHrs / 5) * 100}%` }}
                    title={`Focus: ${item.focusHrs}h`}
                  />
                  <div
                    className="w-2.5 rounded-t-full bg-[#FFE4EF] border border-[#F8DDE8] transition-all"
                    style={{ height: `${(item.screenHrs / 5) * 100}%` }}
                    title={`Screen: ${item.screenHrs}h`}
                  />
                </div>
                <span className="mt-2 text-[11px] text-[var(--muted)] font-medium">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-5 text-xs text-[var(--muted)] pt-3 border-t border-[var(--line)]">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#F472B6] to-[#C4B5FD]" />
              <span className="text-[var(--text)] font-medium">Focus</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFE4EF] border border-[#F8DDE8]" />
              <span>Screen</span>
            </span>
          </div>
        </section>
      </div>

      {/* Discovered Habit Pattern */}
      <section className="card-aesthetic space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rose)]">
            Discovered Habit Pattern
          </span>
          <button
            onClick={() => onNavigate("pattern_engine")}
            className="btn-ghost text-xs text-[var(--rose)]"
          >
            Explore all patterns &rarr;
          </button>
        </div>

        <p className="font-fraunces text-xl text-[var(--text)] leading-snug">
          {patterns[0]?.title || "Higher entertainment usage before study sessions associates with fewer completed focus blocks."}
        </p>

        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Sessions preceded by over 30 minutes of social media scrolling had a 62% abandonment rate in your telemetry history.
        </p>
      </section>

      {/* Expandable Cohort Comparison Section */}
      <section className="card-aesthetic space-y-4">
        <button
          type="button"
          onClick={() => setShowCohortDetails(!showCohortDetails)}
          className="w-full flex items-center justify-between text-left text-sm font-semibold text-[var(--text)]"
        >
          <span>Student Population Baseline (2,000 Records)</span>
          <span className="text-[var(--rose)] text-xs">{showCohortDetails ? "Hide details" : "Show details"}</span>
        </button>

        {showCohortDetails && (
          <div className="pt-3 border-t border-[var(--line)] space-y-3.5 text-xs text-[var(--muted)]">
            <p className="leading-relaxed">
              We bootstrap general patterns using the Kaggle Student Lifestyle Dataset (2,000 students in India), gradually giving higher priority to your personal observations as your logs grow.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="box-desc">
                <span className="text-[11px] text-[var(--muted)] block">Cohort Study</span>
                <span className="font-fraunces text-lg font-semibold text-[var(--text)]">7.4h / day</span>
              </div>
              <div className="box-desc">
                <span className="text-[11px] text-[var(--muted)] block">Cohort Sleep</span>
                <span className="font-fraunces text-lg font-semibold text-[var(--text)]">7.6h / day</span>
              </div>
              <div className="box-desc">
                <span className="text-[11px] text-[var(--muted)] block">Cohort GPA</span>
                <span className="font-fraunces text-lg font-semibold text-[var(--text)]">3.12 / 4.0</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
