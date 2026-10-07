import { useState, useEffect } from "react";
import { TabKey, BalanceDimensions, FocusSession, MealLog, DailyDecodePlan, ReflectionEntry, PrivacyStreamConfig, PersonalizationConfig } from "./types/twin";
import {
  initialBalanceDimensions,
  initialFocusSessions,
  initialMealLogs,
  initialHobbySuggestions,
  initialPatterns,
  initialDailyDecodePlan,
  initialReflections,
  initialPrivacyConfig,
  initialPersonalizationConfig,
} from "./data/initialData";
import { LandingPage } from "./components/LandingPage";
import { Navigation } from "./components/Navigation";
import { DashboardView } from "./components/DashboardView";
import { FocusGuardianView } from "./components/FocusGuardianView";
import { NutritionTwinView } from "./components/NutritionTwinView";
import { HobbyMateView } from "./components/HobbyMateView";
import { PatternDiscoveryView } from "./components/PatternDiscoveryView";
import { WhatIfSimulatorView } from "./components/WhatIfSimulatorView";
import { DailyDecodeView } from "./components/DailyDecodeView";
import { AskTwinView } from "./components/AskTwinView";
import { PrivacyCenterView } from "./components/PrivacyCenterView";
import { PersonalizationView } from "./components/PersonalizationView";
import { SmartNudgesModal } from "./components/SmartNudgesModal";
import { LegalModal } from "./components/LegalModal";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"landing" | "app">("app");
  const [activeTab, setActiveTab] = useState<TabKey>("focus_guardian");

  // Telemetry state with LocalStorage persistence
  const [balance, setBalance] = useState<BalanceDimensions>(() => {
    const saved = localStorage.getItem("decode_balance");
    return saved ? JSON.parse(saved) : initialBalanceDimensions;
  });

  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem("decode_sessions");
    return saved ? JSON.parse(saved) : initialFocusSessions;
  });

  const [meals, setMeals] = useState<MealLog[]>(() => {
    const saved = localStorage.getItem("decode_meals");
    return saved ? JSON.parse(saved) : initialMealLogs;
  });

  const [hobbies, setHobbies] = useState(() => {
    const saved = localStorage.getItem("decode_hobbies");
    return saved ? JSON.parse(saved) : initialHobbySuggestions;
  });

  const [patterns] = useState(initialPatterns);

  const [plan, setPlan] = useState<DailyDecodePlan>(() => {
    const saved = localStorage.getItem("decode_plan");
    return saved ? JSON.parse(saved) : initialDailyDecodePlan;
  });

  const [reflections, setReflections] = useState<ReflectionEntry[]>(() => {
    const saved = localStorage.getItem("decode_reflections");
    return saved ? JSON.parse(saved) : initialReflections;
  });

  const [privacyConfig, setPrivacyConfig] = useState<PrivacyStreamConfig>(() => {
    const saved = localStorage.getItem("decode_privacy");
    return saved ? JSON.parse(saved) : initialPrivacyConfig;
  });

  const [personalizationConfig, setPersonalizationConfig] = useState<PersonalizationConfig>(() => {
    const saved = localStorage.getItem("decode_personalization");
    return saved ? JSON.parse(saved) : initialPersonalizationConfig;
  });

  // Modal states
  const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false);
  const [legalModalState, setLegalModalState] = useState<{
    isOpen: boolean;
    mode: "tos" | "privacy";
  }>({
    isOpen: false,
    mode: "tos",
  });

  // Persist state updates
  useEffect(() => {
    localStorage.setItem("decode_balance", JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("decode_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("decode_meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("decode_hobbies", JSON.stringify(hobbies));
  }, [hobbies]);

  useEffect(() => {
    localStorage.setItem("decode_plan", JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem("decode_reflections", JSON.stringify(reflections));
  }, [reflections]);

  useEffect(() => {
    localStorage.setItem("decode_privacy", JSON.stringify(privacyConfig));
  }, [privacyConfig]);

  useEffect(() => {
    localStorage.setItem("decode_personalization", JSON.stringify(personalizationConfig));
  }, [personalizationConfig]);

  // Handler functions
  const handleAddSession = (session: FocusSession) => {
    setSessions((prev) => [session, ...prev]);
    setBalance((prev) => {
      const newFocus = Math.min(99, prev.focus + 2);
      const overall = Math.round(
        newFocus * 0.25 +
        prev.sleepRoutine * 0.2 +
        prev.nutritionTracking * 0.15 +
        prev.recreation * 0.2 +
        prev.digitalBalance * 0.2
      );
      return { ...prev, focus: newFocus, overall };
    });
  };

  const handleAddMeal = (meal: MealLog) => {
    setMeals((prev) => [meal, ...prev]);
    setBalance((prev) => {
      const newNutrition = Math.min(99, prev.nutritionTracking + 3);
      const overall = Math.round(
        prev.focus * 0.25 +
        prev.sleepRoutine * 0.2 +
        newNutrition * 0.15 +
        prev.recreation * 0.2 +
        prev.digitalBalance * 0.2
      );
      return { ...prev, nutritionTracking: newNutrition, overall };
    });
  };

  const handleCompleteHobby = (hobbyId: string) => {
    setHobbies((prev: typeof initialHobbySuggestions) =>
      prev.map((h) => (h.id === hobbyId ? { ...h, completedCount: h.completedCount + 1 } : h))
    );
    setBalance((prev) => {
      const newRecreation = Math.min(99, prev.recreation + 2);
      const overall = Math.round(
        prev.focus * 0.25 +
        prev.sleepRoutine * 0.2 +
        prev.nutritionTracking * 0.15 +
        newRecreation * 0.2 +
        prev.digitalBalance * 0.2
      );
      return { ...prev, recreation: newRecreation, overall };
    });
  };

  const handleAddReflection = (entry: ReflectionEntry) => {
    setReflections((prev) => [entry, ...prev]);
  };

  const handleCommitWhatIfTarget = (
    minutesReduced: number,
    allocationMode?: "deep_work" | "hybrid" | "sleep" | "free_time"
  ) => {
    setPlan((prev) => {
      const newEntertainmentCap = Math.max(15, prev.entertainmentCapMinutes - minutesReduced);
      const newDigitalBudget = Math.max(1, Number((prev.digitalBudgetHours - minutesReduced / 60).toFixed(1)));
      let newRecharge = prev.rechargeWindow;
      let newFocus = prev.suggestedFocusWindow;

      if (allocationMode === "deep_work") {
        newFocus = "18:30 - 20:30 (Extended Peak Focus Window)";
      } else if (allocationMode === "hybrid") {
        newRecharge = "17:00 - 17:45 (Extended 45m Offline Hobby Break)";
      } else if (allocationMode === "sleep") {
        newRecharge = "22:00 Sleep Buffer (Protected 30m earlier rest)";
      }

      return {
        ...prev,
        entertainmentCapMinutes: newEntertainmentCap,
        digitalBudgetHours: newDigitalBudget,
        suggestedFocusWindow: newFocus,
        rechargeWindow: newRecharge,
      };
    });

    setBalance((prev) => {
      const newDigital = Math.min(99, prev.digitalBalance + 4);
      const overall = Math.round(
        prev.focus * 0.25 +
        prev.sleepRoutine * 0.2 +
        prev.nutritionTracking * 0.15 +
        prev.recreation * 0.2 +
        newDigital * 0.2
      );
      return { ...prev, digitalBalance: newDigital, overall };
    });
  };

  const handleResetAllData = () => {
    localStorage.clear();
    setBalance(initialBalanceDimensions);
    setSessions(initialFocusSessions);
    setMeals(initialMealLogs);
    setHobbies(initialHobbySuggestions);
    setPlan(initialDailyDecodePlan);
    setReflections(initialReflections);
    setPrivacyConfig(initialPrivacyConfig);
    setPersonalizationConfig(initialPersonalizationConfig);
  };

  const fullStateJson = JSON.stringify(
    {
      exportTimestamp: new Date().toISOString(),
      balance,
      sessions,
      meals,
      hobbies,
      patterns,
      plan,
      reflections,
      privacyConfig,
      personalizationConfig,
    },
    null,
    2
  );

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, gorgeous";
    if (hour < 18) return "Good afternoon, gorgeous";
    return "Good evening, gorgeous";
  };

  if (currentScreen === "landing") {
    return (
      <>
        {/* Floating background orbs */}
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />

        <LandingPage
          onGetStarted={() => {
            setCurrentScreen("app");
            setActiveTab("dashboard");
          }}
          onOpenPrivacyCenter={() => {
            setCurrentScreen("app");
            setActiveTab("privacy_controls");
          }}
          onOpenLegalModal={(mode) => setLegalModalState({ isOpen: true, mode })}
        />

        {/* Legal Modal (TOS / Privacy Policy) */}
        <LegalModal
          isOpen={legalModalState.isOpen}
          mode={legalModalState.mode}
          onClose={() => setLegalModalState((prev) => ({ ...prev, isOpen: false }))}
          onSwitchMode={(mode) => setLegalModalState({ isOpen: true, mode })}
        />
      </>
    );
  }

  return (
    <>
      {/* Floating background orbs */}
      <div className="orb o1" />
      <div className="orb o2" />
      <div className="orb o3" />

      <div className="app-shell">
        {/* Left Sidebar */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenNudgeSimulator={() => setIsNudgeModalOpen(true)}
          onOpenLegalModal={(mode) => setLegalModalState({ isOpen: true, mode })}
          onNavigateHome={() => setCurrentScreen("landing")}
          balanceScore={balance.overall}
        />

        {/* Main Workspace Area */}
        <main className="main-content">
          {/* Greeting Header */}
          <div className="top-header">
            <div className="hello-badge">
              <small>{formattedDate}</small>
              <h2>{getGreeting()}</h2>
            </div>
            <div className="pills-container">
              <button
                type="button"
                onClick={() => setIsNudgeModalOpen(true)}
                className="chip-pill"
              >
                🔔 Nudges
              </button>
              <div className="chip-pill">
                Balance <b>{balance.overall}/100</b>
              </div>
            </div>
          </div>

          {/* Module Views */}
          {activeTab === "dashboard" && (
            <DashboardView
              balance={balance}
              onUpdateBalance={setBalance}
              sessions={sessions}
              patterns={patterns}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "focus_guardian" && (
            <FocusGuardianView
              sessions={sessions}
              onAddSession={handleAddSession}
            />
          )}

          {activeTab === "nutrition_twin" && (
            <NutritionTwinView
              mealLogs={meals}
              onAddMeal={handleAddMeal}
            />
          )}

          {activeTab === "hobbymate" && (
            <HobbyMateView
              hobbies={hobbies}
              onCompleteHobby={handleCompleteHobby}
            />
          )}

          {activeTab === "pattern_engine" && (
            <PatternDiscoveryView patterns={patterns} />
          )}

          {activeTab === "what_if" && (
            <WhatIfSimulatorView onCommitTarget={handleCommitWhatIfTarget} />
          )}

          {activeTab === "daily_decode" && (
            <DailyDecodeView
              plan={plan}
              onUpdatePlan={setPlan}
              reflections={reflections}
              onAddReflection={handleAddReflection}
            />
          )}

          {activeTab === "ask_twin" && (
            <AskTwinView
              sessions={sessions}
              meals={meals}
              patterns={patterns}
            />
          )}

          {activeTab === "privacy_controls" && (
            <PrivacyCenterView
              config={privacyConfig}
              onUpdateConfig={setPrivacyConfig}
              onResetAllData={handleResetAllData}
              fullStateJson={fullStateJson}
            />
          )}

          {activeTab === "personalization" && (
            <PersonalizationView
              config={personalizationConfig}
              onUpdateConfig={setPersonalizationConfig}
            />
          )}
        </main>
      </div>

      {/* Floating Action Button */}
      {activeTab !== "ask_twin" && (
        <button
          type="button"
          onClick={() => setActiveTab("ask_twin")}
          className="fab-btn"
        >
          💬 Ask your Twin
        </button>
      )}

      {/* Smart Nudges Context Simulator Modal */}
      <SmartNudgesModal
        isOpen={isNudgeModalOpen}
        onClose={() => setIsNudgeModalOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsNudgeModalOpen(false);
        }}
      />

      {/* Legal Modal (TOS / Privacy Policy) */}
      <LegalModal
        isOpen={legalModalState.isOpen}
        mode={legalModalState.mode}
        onClose={() => setLegalModalState((prev) => ({ ...prev, isOpen: false }))}
        onSwitchMode={(mode) => setLegalModalState({ isOpen: true, mode })}
      />
    </>
  );
}
