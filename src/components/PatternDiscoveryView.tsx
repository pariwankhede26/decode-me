import React, { useState } from "react";
import { PatternInsight } from "../types/twin";
import { initialPopulationPatterns, studentCohortBaseline } from "../data/initialData";

interface PatternDiscoveryViewProps {
  patterns: PatternInsight[];
}

export const PatternDiscoveryView: React.FC<PatternDiscoveryViewProps> = ({
  patterns,
}) => {
  const [activeTier, setActiveTier] = useState<"personal" | "population">("personal");
  const [selectedPatternId, setSelectedPatternId] = useState<string>(patterns[0]?.id || "");
  const [showCohortDetails, setShowCohortDetails] = useState(false);

  const displayedPatterns =
    activeTier === "personal" ? patterns : initialPopulationPatterns;

  const activePattern =
    displayedPatterns.find((p) => p.id === selectedPatternId) || displayedPatterns[0];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="gradient-title">Patterns</h1>
        <p className="text-[var(--muted)] text-[1.02rem] mt-2 mb-6">
          Observational relationships discovered across focus, sleep, screen habits, and stress.
        </p>
      </div>

      {/* Segmented control */}
      <div className="seg-control max-w-sm">
        <button
          type="button"
          onClick={() => {
            setActiveTier("personal");
            setSelectedPatternId(patterns[0]?.id || "");
          }}
          className={`seg-btn ${activeTier === "personal" ? "on" : ""}`}
        >
          Your Telemetry
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTier("population");
            setSelectedPatternId(initialPopulationPatterns[0]?.id || "");
          }}
          className={`seg-btn ${activeTier === "population" ? "on" : ""}`}
        >
          Student Cohort (2,000)
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pattern Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {displayedPatterns.map((p) => {
            const isSelected = p.id === activePattern?.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPatternId(p.id)}
                className={`card-aesthetic cursor-pointer transition-all p-5 space-y-1.5 ${
                  isSelected
                    ? "ring-2 ring-[var(--pink)]"
                    : "hover:border-[var(--pink)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-fraunces text-base font-medium text-[var(--text)]">{p.title}</h3>
                  <span className="font-fraunces text-xs font-semibold text-[var(--rose)]">
                    r = {p.correlationCoefficient > 0 ? "+" : ""}
                    {p.correlationCoefficient.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed line-clamp-2">
                  {p.hypothesis}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Pattern Detail and Scatter Visualization (7 cols) */}
        <section className="card-aesthetic lg:col-span-7 space-y-6">
          {activePattern && (
            <>
              <div>
                <span className="text-[11px] text-[var(--rose)] font-semibold uppercase tracking-wider block mb-1">
                  r = {activePattern.correlationCoefficient > 0 ? "+" : ""}
                  {activePattern.correlationCoefficient.toFixed(2)} &middot; Sample N = {activePattern.sampleSize}
                </span>
                <h2 className="font-fraunces text-2xl font-medium text-[var(--text)] mb-2">{activePattern.title}</h2>
                <div className="box-desc italic text-xs leading-relaxed">
                  "{activePattern.hypothesis}"
                </div>
              </div>

              {/* Scatter Plot */}
              <div className="border border-[var(--line)] rounded-2xl bg-[var(--bg)] p-4 h-56 flex flex-col justify-between">
                <span className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider">
                  Y: {activePattern.domainB}
                </span>

                <div className="relative flex-1 my-2">
                  <svg className="w-full h-full" viewBox="0 0 500 160">
                    <line x1="30" y1="20" x2="470" y2="20" stroke="#F8DDE8" strokeDasharray="3 3" />
                    <line x1="30" y1="80" x2="470" y2="80" stroke="#F8DDE8" strokeDasharray="3 3" />
                    <line x1="30" y1="140" x2="470" y2="140" stroke="#F472B6" strokeOpacity="0.4" />
                    <line x1="30" y1="20" x2="30" y2="140" stroke="#F472B6" strokeOpacity="0.4" />

                    {activePattern.dataPoints.map((pt, idx) => {
                      const minX = Math.min(...activePattern.dataPoints.map((d) => d.x));
                      const maxX = Math.max(...activePattern.dataPoints.map((d) => d.x)) || 1;
                      const minY = Math.min(...activePattern.dataPoints.map((d) => d.y));
                      const maxY = Math.max(...activePattern.dataPoints.map((d) => d.y)) || 1;

                      const px = 50 + ((pt.x - minX) / (maxX - minX || 1)) * 400;
                      const py = 130 - ((pt.y - minY) / (maxY - minY || 1)) * 100;

                      return (
                        <circle
                          key={idx}
                          cx={px}
                          cy={py}
                          r="5"
                          className="fill-[var(--rose)] stroke-white"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </svg>
                </div>

                <span className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider text-right">
                  X: {activePattern.domainA}
                </span>
              </div>

              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {activePattern.telemetrySummary}
              </p>
            </>
          )}
        </section>
      </div>

      {/* Cohort Baseline Stats */}
      {activeTier === "population" && (
        <section className="card-aesthetic space-y-4">
          <button
            type="button"
            onClick={() => setShowCohortDetails(!showCohortDetails)}
            className="w-full flex items-center justify-between text-left text-sm font-semibold text-[var(--text)]"
          >
            <span>Kaggle Student Dataset Distribution (2,000 Records)</span>
            <span className="text-[var(--rose)] text-xs">{showCohortDetails ? "Hide" : "Show"}</span>
          </button>

          {showCohortDetails && (
            <div className="pt-3 border-t border-[var(--line)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="box-desc">
                <span className="text-[11px] text-[var(--muted)] block">Mean Study</span>
                <span className="font-fraunces text-base font-semibold text-[var(--text)]">{studentCohortBaseline.means.studyHours}h / day</span>
              </div>
              <div className="box-desc">
                <span className="text-[11px] text-[var(--muted)] block">Mean Sleep</span>
                <span className="font-fraunces text-base font-semibold text-[var(--text)]">{studentCohortBaseline.means.sleepHours}h / day</span>
              </div>
              <div className="box-desc">
                <span className="text-[11px] text-[var(--muted)] block">Mean Physical</span>
                <span className="font-fraunces text-base font-semibold text-[var(--text)]">{studentCohortBaseline.means.physicalActivityHours}h / day</span>
              </div>
              <div className="box-desc">
                <span className="text-[11px] text-[var(--muted)] block">Mean GPA</span>
                <span className="font-fraunces text-base font-semibold text-[var(--text)]">{studentCohortBaseline.means.gpa} / 4.0</span>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
