// Utility script to verify dataset integrity and compute empirical statistics
import fs from "fs";
import path from "path";

export interface StudentRecord {
  id: number;
  studyHours: number;
  extracurricularHours: number;
  sleepHours: number;
  socialHours: number;
  physicalActivityHours: number;
  gpa: number;
  stressLevel: "Low" | "Moderate" | "High";
}
