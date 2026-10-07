import fs from "fs";
import path from "path";

// Process the raw lines from dataset
export interface StudentRecordRaw {
  Student_ID: number;
  Study_Hours_Per_Day: number;
  Extracurricular_Hours_Per_Day: number;
  Sleep_Hours_Per_Day: number;
  Social_Hours_Per_Day: number;
  Physical_Activity_Hours_Per_Day: number;
  GPA: number;
  Stress_Level: "Low" | "Moderate" | "High";
}

export interface StudentFeatureVector {
  studyHours: number;
  extracurricularHours: number;
  sleepHours: number;
  socialHours: number;
  physicalActivityHours: number;
  gpa: number;
  stressScore: number; // 1 = Low, 2 = Moderate, 3 = High
  stressLevel: "Low" | "Moderate" | "High";
}

export interface VariableStatistics {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
}

export interface DatasetSummary {
  totalRecords: number;
  stressDistribution: {
    lowCount: number;
    lowPercent: number;
    moderateCount: number;
    moderatePercent: number;
    highCount: number;
    highPercent: number;
  };
  variables: {
    studyHours: VariableStatistics;
    extracurricularHours: VariableStatistics;
    sleepHours: VariableStatistics;
    socialHours: VariableStatistics;
    physicalActivityHours: VariableStatistics;
    gpa: VariableStatistics;
    stressScore: VariableStatistics;
  };
  correlationMatrix: {
    studyVsGpa: number;
    studyVsStress: number;
    sleepVsStress: number;
    physicalVsStress: number;
    socialVsStress: number;
    extracurricularVsStress: number;
    sleepVsGpa: number;
    physicalVsGpa: number;
  };
}
