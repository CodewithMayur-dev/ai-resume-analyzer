export interface ResumeAnalysis {
  id: string;
  fileName: string;
  uploadedAt: string;
  jobTitle: string;
  company: string;
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  skills: {
    present: string[];
    missing: string[];
  };
  experienceLevel: string;
  overallFeedback: string;
}

export type ATSLevel = "good" | "warning" | "bad";

export function getATSLevel(score: number): ATSLevel {
  if (score >= 75) return "good";
  if (score >= 50) return "warning";
  return "bad";
}
