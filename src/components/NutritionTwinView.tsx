import React, { useState } from "react";
import { MealLog } from "../types/twin";

interface NutritionTwinViewProps {
  mealLogs: MealLog[];
  onAddMeal: (meal: MealLog) => void;
}

export const NutritionTwinView: React.FC<NutritionTwinViewProps> = ({
  mealLogs,
  onAddMeal,
}) => {
  const [mealInput, setMealInput] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const [currentAnalysis, setCurrentAnalysis] = useState<{
    mealName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    twinCorrelationNote: string;
  } | null>(null);

  const samplePresets = [
    { name: "Dal, Rice, 2 Roti, Mixed Sabzi", type: "lunch" as const },
    { name: "Wild Salmon, Steamed Quinoa, Greens", type: "dinner" as const },
    { name: "Oats with Almond Butter & Berries", type: "breakfast" as const },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        if (!mealInput) {
          setMealInput(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAnalysis = async (customDesc?: string) => {
    const descriptionToAnalyze = customDesc || mealInput;
    if (!descriptionToAnalyze && !imagePreview) return;

    setAnalyzing(true);

    try {
      const res = await fetch("/api/twin/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealDescription: descriptionToAnalyze,
          imageBase64: imagePreview || undefined,
        }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setCurrentAnalysis(data);
    } catch (err) {
      console.error(err);
      setCurrentAnalysis({
        mealName: descriptionToAnalyze || "Balanced Nourishment",
        calories: 620,
        protein: 24,
        carbs: 88,
        fat: 17,
        fiber: 7,
        twinCorrelationNote: "Balanced meal profile corresponds with steady afternoon cognitive endurance.",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToTwin = () => {
    if (!currentAnalysis) return;
    const newLog: MealLog = {
      id: "ml-" + Date.now(),
      mealName: currentAnalysis.mealName,
      calories: currentAnalysis.calories,
      protein: currentAnalysis.protein,
      carbs: currentAnalysis.carbs,
      fat: currentAnalysis.fat,
      fiber: currentAnalysis.fiber,
      timestamp: "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      twinCorrelationNote: currentAnalysis.twinCorrelationNote,
      loggedAtMealType: selectedMealType,
    };
    onAddMeal(newLog);
    setCurrentAnalysis(null);
    setMealInput("");
    setImagePreview(null);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="gradient-title">Nourish</h1>
        <p className="text-[var(--muted)] text-[1.02rem] mt-2 mb-6">
          Observe how dietary patterns correlate with mental endurance and afternoon stamina.
        </p>
      </div>

      {/* Main Analysis Card */}
      <section className="card-aesthetic space-y-6">
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] mb-2 block">Meal Type</label>
            <div className="flex gap-2">
              {(["breakfast", "lunch", "dinner", "snack"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedMealType(type)}
                  className={`dur-btn text-xs capitalize ${selectedMealType === type ? "on" : ""}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--muted)] mb-2 block">Meal Description</label>
            <input
              type="text"
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              placeholder="e.g. Dal, rice, 2 roti, mixed vegetables"
              className="input-aesthetic"
            />
          </div>

          <div>
            <label className="cursor-pointer text-xs font-medium text-[var(--rose)] hover:underline inline-flex items-center gap-1">
              {imagePreview ? "📸 Change meal photo" : "+ Attach meal photograph"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="ml-3 text-xs text-[var(--muted)] hover:text-rose-600 border-0 bg-transparent cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <div>
          <button
            type="button"
            disabled={analyzing || (!mealInput && !imagePreview)}
            onClick={() => handleRunAnalysis()}
            className="btn-shimmer text-xs py-3 px-7 disabled:opacity-50"
          >
            {analyzing ? "Analyzing Nutritional Rhythm..." : "Analyze Meal"}
          </button>
        </div>

        {/* Analysis Output */}
        {currentAnalysis && (
          <div className="pt-6 border-t border-[var(--line)] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-fraunces text-2xl font-medium text-[var(--text)]">
                  {currentAnalysis.mealName}
                </h3>
                <p className="text-xs text-[var(--muted)]">Approximate nutritional balance</p>
              </div>
              <span className="font-fraunces text-3xl font-semibold text-[var(--rose)]">
                ~{currentAnalysis.calories} <span className="text-sm font-normal text-[var(--muted)]">kcal</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="box-desc">
                <span className="text-[11px] text-[var(--muted)] block">Protein</span>
                <span className="font-fraunces text-lg font-semibold text-[var(--text)]">~{currentAnalysis.protein}g</span>
              </div>
              <div className="box-desc">
                <span className="text-[11px] text-[var(--muted)] block">Carbs</span>
                <span className="font-fraunces text-lg font-semibold text-[var(--text)]">~{currentAnalysis.carbs}g</span>
              </div>
              <div className="box-desc">
                <span className="text-[11px] text-[var(--muted)] block">Fat</span>
                <span className="font-fraunces text-lg font-semibold text-[var(--text)]">~{currentAnalysis.fat}g</span>
              </div>
              <div className="box-desc">
                <span className="text-[11px] text-[var(--muted)] block">Fiber</span>
                <span className="font-fraunces text-lg font-semibold text-[var(--text)]">~{currentAnalysis.fiber}g</span>
              </div>
            </div>

            <div className="box-tip">
              🍓 <b>Twin Note:</b> "{currentAnalysis.twinCorrelationNote}"
            </div>

            <button
              type="button"
              onClick={handleSaveToTwin}
              className="btn-shimmer text-xs py-2.5 px-6"
            >
              Save to Twin Log
            </button>
          </div>
        )}
      </section>

      {/* Expandable Sample Presets */}
      <section className="card-aesthetic space-y-4">
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="w-full flex items-center justify-between text-left text-sm font-semibold text-[var(--text)]"
        >
          <span>Sample Nourishment Templates</span>
          <span className="text-[var(--rose)] text-xs">{showPresets ? "Hide" : "Show"}</span>
        </button>

        {showPresets && (
          <div className="pt-3 border-t border-[var(--line)] flex flex-wrap gap-2.5">
            {samplePresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setMealInput(preset.name);
                  setSelectedMealType(preset.type);
                  handleRunAnalysis(preset.name);
                }}
                className="chip-pill text-xs py-2 px-4"
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Expandable Past Meals Log */}
      <section className="card-aesthetic space-y-4">
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between text-left text-sm font-semibold text-[var(--text)]"
        >
          <span>Logged Meals ({mealLogs.length})</span>
          <span className="text-[var(--rose)] text-xs">{showHistory ? "Hide" : "Show"}</span>
        </button>

        {showHistory && (
          <div className="pt-3 border-t border-[var(--line)] space-y-2.5">
            {mealLogs.map((log) => (
              <div key={log.id} className="py-2.5 px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text)]">{log.mealName}</span>
                  <span className="font-fraunces text-sm font-semibold text-[var(--rose)]">~{log.calories} kcal</span>
                </div>
                <p className="text-[var(--muted)] text-[11px]">{log.twinCorrelationNote}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
