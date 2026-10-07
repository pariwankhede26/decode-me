import React, { useState } from "react";
import { PrivacyStreamConfig } from "../types/twin";

interface PrivacyCenterViewProps {
  config: PrivacyStreamConfig;
  onUpdateConfig: (newConfig: PrivacyStreamConfig) => void;
  onResetAllData: () => void;
  fullStateJson: string;
}

export const PrivacyCenterView: React.FC<PrivacyCenterViewProps> = ({
  config,
  onUpdateConfig,
  onResetAllData,
  fullStateJson,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [exportNotice, setExportNotice] = useState("");

  const handleToggle = (key: keyof Omit<PrivacyStreamConfig, "dataRetentionDays" | "localStorageOnly">) => {
    onUpdateConfig({
      ...config,
      [key]: !config[key],
    });
  };

  const handleExportData = () => {
    const blob = new Blob([fullStateJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `decode-me-telemetry-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExportNotice("Telemetry archive exported successfully.");
    setTimeout(() => setExportNotice(""), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="gradient-title">Privacy Control Center</h1>
        <p className="text-[var(--muted)] text-[1.02rem] mt-2 mb-6">
          You own your digital twin. Configure permissions, retention rules, and complete data exports.
        </p>
      </div>

      {exportNotice && (
        <div className="box-desc text-xs font-semibold text-emerald-800 bg-[#E8F8F2] border border-[#BDEBD9]">
          ✨ {exportNotice}
        </div>
      )}

      {/* Permission Toggles */}
      <section className="card-aesthetic space-y-6">
        <div className="border-b border-[var(--line)] pb-3">
          <h2 className="font-fraunces text-2xl font-medium text-[var(--text)]">Permissioned Signals</h2>
          <p className="text-xs text-[var(--muted)]">Choose exactly which streams your digital twin may observe</p>
        </div>

        <div className="divide-y divide-[var(--line)]">
          {[
            { key: "screenTime" as const, label: "Screen Time & App Activity", desc: "Used for focus distraction detection during study windows." },
            { key: "calendarEvents" as const, label: "Calendar Deadlines & Events", desc: "Context for planned study windows and focus preparation." },
            { key: "mealPhotos" as const, label: "Meal Scans & Dietary Log", desc: "Nutrition and afternoon cognitive endurance correlation." },
            { key: "moodCheckins" as const, label: "Daily Qualitative Reflections", desc: "Subjective daily context to calibrate mental state." },
            { key: "sleepTelemetry" as const, label: "Sleep Telemetry", desc: "Correlates sleep duration with study block follow-through." },
            { key: "physicalActivity" as const, label: "Physical Movement & Recreation", desc: "Monitors offline breaks and recharge balance." },
          ].map((stream) => {
            const isEnabled = config[stream.key];
            return (
              <div key={stream.key} className="py-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[var(--text)] block">{stream.label}</span>
                  <span className="text-[11px] text-[var(--muted)]">{stream.desc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(stream.key)}
                  className={`dur-btn text-xs py-1.5 px-4 min-w-[80px] ${isEnabled ? "on" : ""}`}
                >
                  {isEnabled ? "Enabled" : "Off"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Retention & Actions */}
      <section className="card-aesthetic space-y-6">
        <div className="border-b border-[var(--line)] pb-3">
          <h2 className="font-fraunces text-2xl font-medium text-[var(--text)]">Data Retention & Export</h2>
          <p className="text-xs text-[var(--muted)]">Telemetry duration and one-click wipe controls</p>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--muted)] font-semibold">Retain history for:</span>
          <div className="flex gap-2">
            {([7, 30, 90] as const).map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => onUpdateConfig({ ...config, dataRetentionDays: days })}
                className={`dur-btn text-xs py-1.5 px-3 min-w-[70px] ${config.dataRetentionDays === days ? "on" : ""}`}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={handleExportData}
            className="btn-shimmer text-xs py-3 px-6"
          >
            Export Complete JSON Archive
          </button>

          {!showConfirmReset ? (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="btn-ghost text-xs text-rose-600 hover:text-rose-700"
            >
              Wipe All Data
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetAllData();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 rounded-full bg-rose-600 text-xs font-semibold text-white shadow-sm"
              >
                Confirm Complete Wipe
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="btn-ghost text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
