import { create } from "zustand";
import type { ResumeAnalysis } from "~/types";

const STORAGE_KEY = "ai_resume_analyzer_resumes";
const API_KEY_STORAGE = "ai_resume_analyzer_api_key";

function loadFromStorage(): ResumeAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ResumeAnalysis[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(resumes: ResumeAnalysis[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  } catch {
    // Storage quota exceeded or unavailable
  }
}

interface ResumeStore {
  resumes: ResumeAnalysis[];
  apiKey: string;
  isLoaded: boolean;
  loadResumes: () => void;
  addResume: (resume: ResumeAnalysis) => void;
  deleteResume: (id: string) => void;
  getResume: (id: string) => ResumeAnalysis | undefined;
  setApiKey: (key: string) => void;
  loadApiKey: () => void;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resumes: [],
  apiKey: "",
  isLoaded: false,

  loadResumes: () => {
    const resumes = loadFromStorage();
    const apiKey =
      typeof window !== "undefined"
        ? (localStorage.getItem(API_KEY_STORAGE) ?? "")
        : "";
    set({ resumes, apiKey, isLoaded: true });
  },

  addResume: (resume) => {
    const resumes = [resume, ...get().resumes];
    saveToStorage(resumes);
    set({ resumes });
  },

  deleteResume: (id) => {
    const resumes = get().resumes.filter((r) => r.id !== id);
    saveToStorage(resumes);
    set({ resumes });
  },

  getResume: (id) => get().resumes.find((r) => r.id === id),

  setApiKey: (key) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(API_KEY_STORAGE, key);
    }
    set({ apiKey: key });
  },

  loadApiKey: () => {
    const apiKey =
      typeof window !== "undefined"
        ? (localStorage.getItem(API_KEY_STORAGE) ?? "")
        : "";
    set({ apiKey });
  },
}));
