import type { Route } from "./+types/upload";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "~/components/Navbar";
import { FileUploader } from "~/components/FileUploader";
import { useResumeStore } from "~/store/useResumeStore";
import { extractTextFromPDF } from "~/lib/pdf";
import { analyzeResume } from "~/lib/gemini";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Upload Resume – ResumeAI" },
    { name: "description", content: "Upload your resume and job description." },
  ];
}

type Status =
  | "idle"
  | "extracting"
  | "analyzing"
  | "success"
  | "error";

export default function Upload() {
  const navigate = useNavigate();
  const { addResume, apiKey, setApiKey, loadApiKey } = useResumeStore();

  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [localApiKey, setLocalApiKey] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadApiKey();
  }, [loadApiKey]);

  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setErrorMsg("Please select a PDF file.");
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMsg("Please enter a job description.");
      return;
    }
    if (!localApiKey.trim()) {
      setErrorMsg("Please enter your Gemini API key.");
      return;
    }

    setErrorMsg("");

    try {
      // Save API key for future use
      setApiKey(localApiKey.trim());

      // Step 1: Extract text from PDF
      setStatus("extracting");
      const resumeText = await extractTextFromPDF(file);

      if (!resumeText.trim()) {
        throw new Error(
          "Could not extract text from the PDF. Please ensure it is not a scanned image."
        );
      }

      // Step 2: Analyze with Gemini
      setStatus("analyzing");
      const analysis = await analyzeResume({
        resumeText,
        jobDescription: jobDescription.trim(),
        fileName: file.name,
        apiKey: localApiKey.trim(),
      });

      // Step 3: Save and navigate
      addResume(analysis);
      setStatus("success");
      navigate(`/resume/${analysis.id}`);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    }
  };

  const isLoading = status === "extracting" || status === "analyzing";

  const statusMessage =
    status === "extracting"
      ? "Extracting text from PDF…"
      : status === "analyzing"
        ? "Analyzing resume with AI…"
        : "";

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(to bottom, #f0f4ff 60%, #fa7185cc)" }}
    >
      <Navbar />

      <main className="main-section">
        <section className="page-heading">
          <h1>Upload Your Resume</h1>
          <h2>
            Upload a PDF resume and paste the job description to get an
            AI-powered ATS analysis.
          </h2>
        </section>

        <div className="w-full max-w-2xl gradient-border">
          <form onSubmit={handleSubmit}>
            {/* API Key */}
            <div className="form-div">
              <label htmlFor="apiKey" className="font-medium">
                Gemini API Key
              </label>
              <input
                id="apiKey"
                type="password"
                placeholder="Enter your Google Gemini API key"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-400">
                Get a free key at{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  aistudio.google.com
                </a>
                . Your key is saved locally in your browser.
              </p>
            </div>

            {/* Resume Upload */}
            <div className="form-div">
              <label className="font-medium">Resume (PDF)</label>
              <FileUploader
                onFileSelect={setFile}
                selectedFile={file}
                onClear={() => setFile(null)}
              />
            </div>

            {/* Job Description */}
            <div className="form-div">
              <label htmlFor="jobDescription" className="font-medium">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                rows={8}
                placeholder="Paste the full job description here…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="flex items-start gap-2 p-3 bg-badge-red rounded-2xl w-full">
                <img src="/icons/warning.svg" alt="Error" className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-badge-red-text text-sm">{errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="primary-button disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {statusMessage}
                </span>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </form>
        </div>

        <img
          src="/images/bg-small.svg"
          alt=""
          className="w-64 opacity-20 pointer-events-none select-none"
        />
      </main>
    </div>
  );
}
