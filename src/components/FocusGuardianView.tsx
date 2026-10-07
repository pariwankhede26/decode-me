import React, { useState, useEffect } from "react";
import { FocusSession, InterventionLevel } from "../types/twin";

interface FocusGuardianViewProps {
  sessions: FocusSession[];
  onAddSession: (session: FocusSession) => void;
}

export const FocusGuardianView: React.FC<FocusGuardianViewProps> = ({
  sessions,
  onAddSession,
}) => {
  const [taskName, setTaskName] = useState("DBMS Unit 3: Transaction Management");
  const [plannedMinutes, setPlannedMinutes] = useState(50);
  const [secondsRemaining, setSecondsRemaining] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [interventionLevel, setInterventionLevel] = useState<InterventionLevel>("warn");
  const [distractionAttempts, setDistractionAttempts] = useState(0);

  // Expandable sections state
  const [showHistory, setShowHistory] = useState(false);
  const [showTestControls, setShowTestControls] = useState(false);

  // Modal states
  const [simulatedDistractionActive, setSimulatedDistractionActive] = useState(false);
  const [distractionEventMessage, setDistractionEventMessage] = useState("");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [postReflectionText, setPostReflectionText] = useState("");

  const totalSeconds = plannedMinutes * 60;
  const radius = 112;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - secondsRemaining / (totalSeconds || 1));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleFinishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const handleStartTimer = () => setIsRunning(true);
  const handlePauseTimer = () => setIsRunning(false);
  const handleResetTimer = () => {
    setIsRunning(false);
    setSecondsRemaining(plannedMinutes * 60);
    setDistractionAttempts(0);
  };

  const handleFinishSession = () => {
    setIsRunning(false);
    const elapsedMinutes = Math.max(1, Math.round((plannedMinutes * 60 - secondsRemaining) / 60));
    setCompletedDuration(elapsedMinutes);
    setShowCompletionModal(true);
  };

  const handleSaveCompletedSession = () => {
    const newSession: FocusSession = {
      id: "fs-" + Date.now(),
      taskName,
      plannedMinutes,
      completedMinutes: completedDuration,
      distractionAttempts,
      status: completedDuration >= plannedMinutes * 0.7 ? "completed" : "abandoned",
      timestamp: "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      interventionLevel,
      reflectionNotes: postReflectionText || "Focus session completed with clarity.",
    };
    onAddSession(newSession);
    setShowCompletionModal(false);
    setPostReflectionText("");
    handleResetTimer();
  };

  const handleSimulateDistraction = (app: string) => {
    setDistractionAttempts((prev) => prev + 1);
    setSimulatedDistractionActive(true);

    if (interventionLevel === "suggest") {
      setDistractionEventMessage(`Gentle Suggestion: You planned to study "${taskName}" right now, but opened ${app}. Return to your flow?`);
    } else if (interventionLevel === "warn") {
      setDistractionEventMessage(`Focus Commitment: Planned focus block active for "${taskName}". Detected switch to ${app}.`);
    } else if (interventionLevel === "ask") {
      setDistractionEventMessage(`Mindful Confirmation: Do you need to interrupt "${taskName}" to browse ${app}?`);
    } else {
      setDistractionEventMessage(`Boundary Active: Access to ${app} is temporarily restricted during "${taskName}".`);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const guidanceDetails: Record<InterventionLevel, { label: string; desc: string }> = {
    suggest: {
      label: "Suggest",
      desc: "A gentle, non-blocking nudge when a social or distracting app opens during study time.",
    },
    warn: {
      label: "Warn",
      desc: "A clear banner reminding you of your study commitment and the cognitive cost of breaking focus.",
    },
    ask: {
      label: "Ask",
      desc: "I ask for your confirmation and a brief reflection before you open a distracting app.",
    },
    restrict: {
      label: "Restrict",
      desc: "Access to entertainment applications is paused until your focus timer concludes.",
    },
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="gradient-title">Focus</h1>
        <p className="text-[var(--muted)] text-[1.02rem] mt-2 mb-6">
          Protect the time that matters most to you.
        </p>
      </div>

      {/* Main Grid: Left timer console, Right guidance control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Timer Console (7 cols) */}
        <section className="card-aesthetic lg:col-span-7 space-y-6">
          <div>
            <label htmlFor="focus-task" className="text-xs font-semibold text-[var(--muted)] mb-2 block">
              What are you focusing on?
            </label>
            <input
              id="focus-task"
              type="text"
              disabled={isRunning}
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="input-aesthetic"
              placeholder="e.g. DBMS Unit 3: Transaction Management"
            />
          </div>

          {/* Duration Options */}
          <div className="flex gap-2.5 flex-wrap">
            {[25, 45, 50, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                disabled={isRunning}
                onClick={() => {
                  setPlannedMinutes(mins);
                  setSecondsRemaining(mins * 60);
                }}
                className={`dur-btn ${plannedMinutes === mins ? "on" : ""}`}
              >
                {mins} min
              </button>
            ))}
          </div>

          {/* Circular Timer Ring with Rotating Conic Glow */}
          <div className="timer-container py-3">
            <div className="timer-glow" />
            <svg className="timer-svg" viewBox="0 0 260 260">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F9A8D4" />
                  <stop offset="100%" stopColor="#C4B5FD" />
                </linearGradient>
              </defs>
              <circle
                className="timer-track"
                cx="130"
                cy="130"
                r={radius}
                fill="none"
                strokeWidth="14"
              />
              <circle
                className="timer-prog"
                cx="130"
                cy="130"
                r={radius}
                fill="none"
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="timer-time-center">
              <div className="num">{formatTime(secondsRemaining)}</div>
              <div className="lbl">
                {isRunning ? "Deep in focus" : secondsRemaining === 0 ? "Completed! 🎉" : "Ready when you are"}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            {!isRunning ? (
              <button
                type="button"
                onClick={handleStartTimer}
                className="btn-shimmer flex-1"
              >
                Begin focus session
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePauseTimer}
                className="btn-shimmer flex-1"
              >
                Pause
              </button>
            )}

            <button
              type="button"
              onClick={handleFinishSession}
              className="btn-ghost"
            >
              End
            </button>

            <button
              type="button"
              onClick={handleResetTimer}
              className="btn-ghost"
            >
              Reset
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-5 border-t border-dashed border-[var(--line)] text-[var(--muted)] text-sm">
            <div>
              <b className="block text-[var(--text)] font-fraunces text-2xl font-semibold">
                {distractionAttempts}
              </b>
              Distraction attempts
            </div>
            <div>
              <b className="block text-[var(--text)] font-fraunces text-2xl font-semibold">
                {sessions.filter((s) => s.status === "completed").length}
              </b>
              Sessions logged
            </div>
            <button
              type="button"
              onClick={() => handleSimulateDistraction("Instagram")}
              className="btn-ghost ml-auto text-xs text-[var(--rose)]"
            >
              + Log a distraction
            </button>
          </div>
        </section>

        {/* Right Guidance Column (5 cols) */}
        <section className="card-aesthetic lg:col-span-5 space-y-6">
          <div>
            <h3 className="font-fraunces text-xl font-medium text-[var(--text)] mb-1">
              How should I guide you?
            </h3>
            <p className="text-[var(--muted)] text-sm mb-4">
              You choose how firm your Focus Guardian should be.
            </p>
          </div>

          {/* Segmented control */}
          <div className="seg-control">
            {(["suggest", "warn", "ask", "restrict"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setInterventionLevel(tier)}
                className={`seg-btn ${interventionLevel === tier ? "on" : ""}`}
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </button>
            ))}
          </div>

          {/* Description box */}
          <div className="box-desc leading-relaxed">
            <b>{guidanceDetails[interventionLevel].label}</b> &middot; {guidanceDetails[interventionLevel].desc}
          </div>

          {/* Kindness tip */}
          <div className="box-tip leading-relaxed">
            🌷 <b>Tip:</b> Short, kind reminders work better than strict blocks. Start gentle, then raise the level as your focus grows.
          </div>

          {/* Friction Simulation Test Controls */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowTestControls(!showTestControls)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-[var(--muted)] hover:text-[var(--rose)] transition-colors py-2"
            >
              <span>Test App Distraction Intercepts</span>
              <span>{showTestControls ? "Hide" : "Show"}</span>
            </button>

            {showTestControls && (
              <div className="pt-3 border-t border-[var(--line)] space-y-2">
                <p className="text-xs text-[var(--muted)]">
                  Simulate launching distracting feeds during this active study window:
                </p>
                <div className="flex gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleSimulateDistraction("Instagram")}
                    className="chip-pill text-xs py-2 px-3.5"
                  >
                    Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateDistraction("YouTube Shorts")}
                    className="chip-pill text-xs py-2 px-3.5"
                  >
                    Shorts
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateDistraction("Reddit")}
                    className="chip-pill text-xs py-2 px-3.5"
                  >
                    Reddit
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Expandable Past Sessions Log */}
      <section className="card-aesthetic space-y-4">
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between text-left text-sm font-semibold text-[var(--text)]"
        >
          <span>Past Focus Sessions ({sessions.length})</span>
          <span className="text-[var(--rose)] text-xs">{showHistory ? "Hide" : "Show history"}</span>
        </button>

        {showHistory && (
          <div className="pt-3 border-t border-[var(--line)] space-y-2.5">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs"
              >
                <div>
                  <span className="font-semibold text-[var(--text)] block">{s.taskName}</span>
                  <span className="text-[var(--muted)] text-[11px]">{s.timestamp}</span>
                </div>
                <div className="text-right">
                  <span className="font-fraunces text-sm font-medium text-[var(--rose)]">
                    {s.completedMinutes}m / {s.plannedMinutes}m
                  </span>
                  <span className="text-[var(--muted)] text-[11px] block">
                    {s.distractionAttempts} diverted
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Distraction Alert Modal */}
      {simulatedDistractionActive && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="card-aesthetic max-w-sm w-full space-y-4 shadow-2xl bg-white">
            <h3 className="font-fraunces text-xl font-medium text-[var(--text)]">
              Focus Guardian
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {distractionEventMessage}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSimulatedDistractionActive(false)}
                className="btn-shimmer text-xs py-2.5 px-5"
              >
                Return to Focus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="card-aesthetic max-w-md w-full space-y-4 shadow-2xl bg-white">
            <h3 className="font-fraunces text-2xl font-medium text-[var(--text)]">
              Session Completed 🎉
            </h3>
            <p className="text-sm text-[var(--muted)]">
              {taskName}: {completedDuration} minutes of dedicated time.
            </p>
            <textarea
              rows={3}
              value={postReflectionText}
              onChange={(e) => setPostReflectionText(e.target.value)}
              placeholder="Reflect gently on your focus flow..."
              className="input-aesthetic text-xs"
            />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveCompletedSession}
                className="btn-shimmer text-xs py-3 px-6 flex-1"
              >
                Save to My Twin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
