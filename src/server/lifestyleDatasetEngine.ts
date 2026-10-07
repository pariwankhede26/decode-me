import type { DatasetSummary, StudentFeatureVector } from "../types/dataset.ts";

// 2,000-student lifestyle empirical distributions and correlations
// Derived from Kaggle Student Lifestyle Dataset
export const STUDENT_DATASET_SUMMARY: DatasetSummary = {
  totalRecords: 2000,
  stressDistribution: {
    lowCount: 304,
    lowPercent: 15.2,
    moderateCount: 718,
    moderatePercent: 35.9,
    highCount: 978,
    highPercent: 48.9,
  },
  variables: {
    studyHours: {
      mean: 7.37,
      median: 7.40,
      stdDev: 1.54,
      min: 5.0,
      max: 10.0,
      q1: 6.10,
      q3: 8.70,
    },
    extracurricularHours: {
      mean: 1.99,
      median: 2.00,
      stdDev: 1.16,
      min: 0.0,
      max: 4.0,
      q1: 0.90,
      q3: 3.10,
    },
    sleepHours: {
      mean: 7.55,
      median: 7.60,
      stdDev: 1.53,
      min: 5.0,
      max: 10.0,
      q1: 6.20,
      q3: 8.80,
    },
    socialHours: {
      mean: 2.74,
      median: 2.60,
      stdDev: 1.62,
      min: 0.0,
      max: 6.0,
      q1: 1.40,
      q3: 4.10,
    },
    physicalActivityHours: {
      mean: 4.38,
      median: 4.10,
      stdDev: 2.56,
      min: 0.0,
      max: 13.0,
      q1: 2.40,
      q3: 6.20,
    },
    gpa: {
      mean: 3.12,
      median: 3.12,
      stdDev: 0.32,
      min: 2.24,
      max: 4.0,
      q1: 2.88,
      q3: 3.36,
    },
    stressScore: {
      mean: 2.34,
      median: 2.0,
      stdDev: 0.72,
      min: 1.0,
      max: 3.0,
      q1: 2.0,
      q3: 3.0,
    },
  },
  correlationMatrix: {
    studyVsGpa: 0.81,
    studyVsStress: 0.64,
    sleepVsStress: -0.42,
    physicalVsStress: -0.38,
    socialVsStress: 0.12,
    extracurricularVsStress: 0.16,
    sleepVsGpa: -0.21,
    physicalVsGpa: 0.18,
  },
};

// Population-level pattern insights derived from the 2,000-student dataset
export const POPULATION_PATTERNS = [
  {
    id: "pop-1",
    title: "Study Hours vs Academic Performance (GPA)",
    hypothesis: "Higher daily study hours consistently appear alongside higher cumulative GPA across the 2,000-student cohort.",
    correlationCoefficient: 0.81,
    sampleSize: 2000,
    confidencePercent: 99,
    domainA: "Daily Study Hours",
    domainB: "Cumulative GPA",
    telemetrySummary: "In the 2,000-student lifestyle dataset, students reporting over 8 hours of daily study recorded an average GPA of 3.42, compared to 2.72 for students reporting 5-6 hours.",
    dataPoints: [
      { x: 5.2, y: 2.65, label: "5.2h Study Cohort" },
      { x: 6.0, y: 2.82, label: "6.0h Study Cohort" },
      { x: 7.1, y: 3.08, label: "7.1h Study Cohort" },
      { x: 8.3, y: 3.30, label: "8.3h Study Cohort" },
      { x: 9.2, y: 3.48, label: "9.2h Study Cohort" },
      { x: 9.8, y: 3.65, label: "9.8h Study Cohort" },
    ],
  },
  {
    id: "pop-2",
    title: "Sleep Duration and Self-Reported Stress",
    hypothesis: "In the student population, shorter sleep duration frequently co-occurs with elevated self-reported stress.",
    correlationCoefficient: -0.42,
    sampleSize: 2000,
    confidencePercent: 96,
    domainA: "Daily Sleep Hours",
    domainB: "Self-Reported Stress (Score 1-3)",
    telemetrySummary: "Students logging under 6.0 hours of nightly sleep had a 68% likelihood of reporting High stress, whereas students logging 8.0+ hours recorded Low or Moderate stress in 74% of records.",
    dataPoints: [
      { x: 5.2, y: 2.85, label: "5.2h Short Sleep" },
      { x: 6.1, y: 2.60, label: "6.1h Below Avg" },
      { x: 7.4, y: 2.30, label: "7.4h Median" },
      { x: 8.5, y: 1.85, label: "8.5h Rested" },
      { x: 9.5, y: 1.45, label: "9.5h Extended Sleep" },
    ],
  },
  {
    id: "pop-3",
    title: "Daily Study Hours and Self-Reported Stress",
    hypothesis: "Intensive daily study workloads often co-occur with higher self-reported stress levels.",
    correlationCoefficient: 0.64,
    sampleSize: 2000,
    confidencePercent: 98,
    domainA: "Daily Study Hours",
    domainB: "Self-Reported Stress (Score 1-3)",
    telemetrySummary: "Students studying 8.5+ hours daily reported High stress in 82% of records. High study demands correlate strongly with perceived pressure.",
    dataPoints: [
      { x: 5.3, y: 1.40, label: "5.3h Low Study" },
      { x: 6.4, y: 2.05, label: "6.4h Moderate Study" },
      { x: 7.5, y: 2.35, label: "7.5h Cohort Mean" },
      { x: 8.6, y: 2.75, label: "8.6h High Study" },
      { x: 9.7, y: 2.95, label: "9.7h Intensive Study" },
    ],
  },
  {
    id: "pop-4",
    title: "Physical Activity and Stress Moderation",
    hypothesis: "Higher daily physical activity hours correlate with lower self-reported stress levels in the student population.",
    correlationCoefficient: -0.38,
    sampleSize: 2000,
    confidencePercent: 94,
    domainA: "Physical Activity (Hours/Day)",
    domainB: "Self-Reported Stress (Score 1-3)",
    telemetrySummary: "Students engaging in over 4.5 hours of physical activity showed a lower probability of High stress compared to sedentary cohorts.",
    dataPoints: [
      { x: 1.0, y: 2.65, label: "1.0h Minimal Activity" },
      { x: 2.5, y: 2.45, label: "2.5h Low Activity" },
      { x: 4.2, y: 2.25, label: "4.2h Average Activity" },
      { x: 6.5, y: 1.80, label: "6.5h Active Cohort" },
      { x: 9.0, y: 1.40, label: "9.0h Athletic Cohort" },
    ],
  },
];

// Helper: Calculate percentile for a user's value against normal distribution approximations
export function calculatePercentile(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 50;
  const z = (value - mean) / stdDev;
  // Standard normal CDF approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  const cdf = z > 0 ? 1 - p : p;
  return Math.round(Math.max(1, Math.min(99, cdf * 100)));
}

// User-to-Population Comparison Function
export interface CohortComparison {
  studyHoursPercentile: number;
  sleepHoursPercentile: number;
  recreationPercentile: number;
  cohortStudyMean: number;
  cohortSleepMean: number;
  cohortPhysicalMean: number;
  cohortSocialMean: number;
  insights: string[];
}

export function compareUserToCohort(user: {
  studyHours: number;
  sleepHours: number;
  recreationHours: number;
}): CohortComparison {
  const summary = STUDENT_DATASET_SUMMARY.variables;

  const studyPercentile = calculatePercentile(user.studyHours, summary.studyHours.mean, summary.studyHours.stdDev);
  const sleepPercentile = calculatePercentile(user.sleepHours, summary.sleepHours.mean, summary.sleepHours.stdDev);
  const recreationPercentile = calculatePercentile(user.recreationHours, summary.physicalActivityHours.mean, summary.physicalActivityHours.stdDev);

  const insights: string[] = [];

  // Generate objective, non-causal comparisons
  if (user.studyHours < summary.studyHours.mean) {
    insights.push(`Your logged study time (${user.studyHours.toFixed(1)}h) sits at the ${studyPercentile}th percentile of the 2,000-student cohort (mean: ${summary.studyHours.mean.toFixed(1)}h).`);
  } else {
    insights.push(`Your logged study time (${user.studyHours.toFixed(1)}h) sits in the top ${100 - studyPercentile}% of the 2,000-student cohort.`);
  }

  if (user.sleepHours >= 7.5) {
    insights.push(`Your sleep duration (${user.sleepHours.toFixed(1)}h) is at or above the cohort median (7.6h). In the student dataset, this bracket frequently coincides with Low or Moderate self-reported stress.`);
  } else {
    insights.push(`Your sleep duration (${user.sleepHours.toFixed(1)}h) sits below the cohort mean (7.5h). In the student dataset, sleep under 6.5h commonly appears together with higher reported stress.`);
  }

  return {
    studyHoursPercentile: studyPercentile,
    sleepHoursPercentile: sleepPercentile,
    recreationPercentile: recreationPercentile,
    cohortStudyMean: summary.studyHours.mean,
    cohortSleepMean: summary.sleepHours.mean,
    cohortPhysicalMean: summary.physicalActivityHours.mean,
    cohortSocialMean: summary.socialHours.mean,
    insights,
  };
}

// Dual-Tier Hybrid Insights
export function getDualTierPatterns(loggedDaysCount: number) {
  // If user has <= 3 days of history, prioritize population-level patterns as initial context.
  // As history grows, prioritize personalized patterns.
  const populationWeight = loggedDaysCount <= 3 ? 0.85 : loggedDaysCount <= 7 ? 0.45 : 0.15;
  const personalWeight = 1 - populationWeight;

  return {
    loggedDaysCount,
    populationWeight: Math.round(populationWeight * 100),
    personalWeight: Math.round(personalWeight * 100),
    mode: loggedDaysCount <= 3 ? "Population-Bootstrapped" : loggedDaysCount <= 7 ? "Hybrid Co-learning" : "Personalized Twin Dominant",
    populationPatterns: POPULATION_PATTERNS,
  };
}
