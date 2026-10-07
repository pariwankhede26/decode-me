export type TabKey =
  | "dashboard"
  | "focus_guardian"
  | "nutrition_twin"
  | "hobbymate"
  | "pattern_engine"
  | "what_if"
  | "daily_decode"
  | "ask_twin"
  | "privacy_controls"
  | "personalization";

export type InterventionLevel = "suggest" | "warn" | "ask" | "restrict";

export interface BalanceDimensions {
  focus: number;
  sleepRoutine: number;
  nutritionTracking: number;
  recreation: number;
  digitalBalance: number;
  overall: number;
}

export interface FocusSession {
  id: string;
  taskName: string;
  plannedMinutes: number;
  completedMinutes: number;
  distractionAttempts: number;
  status: "completed" | "in_progress" | "abandoned";
  timestamp: string;
  reflectionNotes?: string;
  interventionLevel: InterventionLevel;
}

export interface MealLog {
  id: string;
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  timestamp: string;
  twinCorrelationNote: string;
  loggedAtMealType: "breakfast" | "lunch" | "dinner" | "snack";
}

export interface HobbySuggestion {
  id: string;
  title: string;
  category: "creative" | "physical" | "reflective" | "mindful";
  durationMinutes: number;
  energyRequired: "low" | "medium" | "high";
  cognitiveLoad: "low" | "minimal";
  description: string;
  completedCount: number;
}

export interface PatternInsight {
  id: string;
  title: string;
  hypothesis: string;
  correlationCoefficient: number; // e.g. -0.68 or +0.74
  sampleSize: number;
  confidencePercent: number;
  domainA: string;
  domainB: string;
  telemetrySummary: string;
  dataPoints: Array<{ x: number; y: number; label: string }>;
}

export interface DailyDecodePlan {
  date: string;
  priorityTask: string;
  suggestedFocusWindow: string;
  digitalBudgetHours: number;
  entertainmentCapMinutes: number;
  rechargeWindow: string;
  nutritionReminder: string;
  status: "active" | "completed";
}

export interface ReflectionEntry {
  id: string;
  date: string;
  moodRating: "great" | "good" | "okay" | "rough";
  energyScore: number; // 1-10
  focusScore: number; // 1-10
  notes: string;
  timestamp: string;
}

export interface PrivacyStreamConfig {
  screenTime: boolean;
  calendarEvents: boolean;
  mealPhotos: boolean;
  moodCheckins: boolean;
  sleepTelemetry: boolean;
  physicalActivity: boolean;
  dataRetentionDays: 7 | 30 | 90;
  localStorageOnly: boolean;
}

export interface PersonalizationConfig {
  interventionStyle: "gentle" | "balanced" | "focused";
  targetFocusHoursDaily: number;
  dailyScreenLimitMinutes: number;
  primaryGoals: string[];
}
