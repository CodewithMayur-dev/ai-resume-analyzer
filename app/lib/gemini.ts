import type { ResumeAnalysis } from "~/types";
import { generateId } from "~/lib/utils";

interface GeminiAnalyzeParams {
  resumeText: string;
  jobDescription: string;
  fileName: string;
  apiKey: string;
}

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function analyzeResume({
  resumeText,
  jobDescription,
  fileName,
  apiKey,
}: GeminiAnalyzeParams): Promise<ResumeAnalysis> {
  const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume against the job description and provide a detailed, structured analysis.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide your analysis as a JSON object with EXACTLY this structure (no markdown, no extra text, just the JSON):
{
  "jobTitle": "extracted job title from job description",
  "company": "extracted company name from job description (or 'Not specified')",
  "atsScore": <integer 0-100>,
  "summary": "2-3 sentence executive summary of the candidate",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3", "actionable suggestion 4"],
  "skills": {
    "present": ["skill1", "skill2", "skill3"],
    "missing": ["missing skill1", "missing skill2", "missing skill3"]
  },
  "experienceLevel": "Entry Level / Mid Level / Senior Level / Executive",
  "overallFeedback": "2-3 sentences of overall honest feedback and encouragement"
}

ATS Score guidelines:
- 85-100: Excellent match, well-optimized resume
- 70-84: Good match with minor improvements needed
- 50-69: Moderate match, several improvements needed
- Below 50: Poor match, significant improvements needed`;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message =
      (error as { error?: { message?: string } })?.error?.message ||
      `API error: ${response.status}`;
    throw new Error(message);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Strip markdown code fences if present
  const jsonText = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: Omit<ResumeAnalysis, "id" | "fileName" | "uploadedAt">;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }

  return {
    id: generateId(),
    fileName,
    uploadedAt: new Date().toISOString(),
    jobTitle: parsed.jobTitle ?? "Unknown Role",
    company: parsed.company ?? "Not specified",
    atsScore: Math.min(100, Math.max(0, Number(parsed.atsScore) || 0)),
    summary: parsed.summary ?? "",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    skills: {
      present: Array.isArray(parsed.skills?.present)
        ? parsed.skills.present
        : [],
      missing: Array.isArray(parsed.skills?.missing)
        ? parsed.skills.missing
        : [],
    },
    experienceLevel: parsed.experienceLevel ?? "Unknown",
    overallFeedback: parsed.overallFeedback ?? "",
  };
}
