import type { Route } from "./+types/resume.$id";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Navbar } from "~/components/Navbar";
import { ScoreBadge } from "~/components/ScoreBadge";
import { useResumeStore } from "~/store/useResumeStore";
import { formatDate } from "~/lib/utils";
import type { ResumeAnalysis } from "~/types";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: "Resume Analysis – ResumeAI" },
    { name: "description", content: `ATS analysis for resume ${params.id}` },
  ];
}

function FeedbackList({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: string;
}) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <img src={icon} alt="" className="w-5 h-5 shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkillPill({
  label,
  variant,
}: {
  label: string;
  variant: "present" | "missing";
}) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        variant === "present"
          ? "bg-badge-green text-badge-green-text"
          : "bg-badge-red text-badge-red-text"
      }`}
    >
      {label}
    </span>
  );
}

export default function ResumeDetail() {
  const { id } = useParams<{ id: string }>();
  const { getResume, loadResumes, isLoaded } = useResumeStore();
  const [resume, setResume] = useState<ResumeAnalysis | null>(null);

  useEffect(() => {
    if (!isLoaded) loadResumes();
  }, [isLoaded, loadResumes]);

  useEffect(() => {
    if (isLoaded && id) {
      const found = getResume(id);
      setResume(found ?? null);
    }
  }, [isLoaded, id, getResume]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <img src="/icons/warning.svg" alt="Not found" className="w-16 h-16 opacity-50" />
        <p className="text-dark-200 text-xl">Resume analysis not found.</p>
        <Link to="/" className="primary-button w-auto px-8">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(to bottom, #f0f4ff 60%, #fa7185cc)" }}
    >
      <Navbar />

      <main className="main-section pb-16">
        {/* Header */}
        <section className="w-full max-w-5xl">
          <div className="resume-nav bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {resume.jobTitle}
              </h2>
              <div className="flex items-center gap-2 text-dark-200 text-sm">
                <img src="/icons/pin.svg" alt="" className="w-4 h-4 opacity-60" />
                <span>{resume.company}</span>
                <span>·</span>
                <span>{formatDate(resume.uploadedAt)}</span>
                <span>·</span>
                <span>{resume.fileName}</span>
              </div>
            </div>
            <ScoreBadge score={resume.atsScore} size="lg" />
          </div>
        </section>

        {/* ATS Score Visual */}
        <section className="w-full max-w-5xl">
          <div className="gradient-border bg-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col items-center gap-2 min-w-[140px]">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                  style={{
                    background:
                      resume.atsScore >= 75
                        ? "linear-gradient(to bottom, #68d1bf, #35746e)"
                        : resume.atsScore >= 50
                          ? "linear-gradient(to bottom, #fbd24b, #e88c2e)"
                          : "linear-gradient(to bottom, #f87171, #b91c1c)",
                  }}
                >
                  {resume.atsScore}
                </div>
                <p className="text-dark-200 text-sm">ATS Score</p>
                <p className="text-xs text-gray-400">{resume.experienceLevel}</p>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <h3 className="font-semibold text-gray-900 text-lg">Summary</h3>
                <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {resume.overallFeedback}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        {(resume.skills.present.length > 0 ||
          resume.skills.missing.length > 0) && (
          <section className="w-full max-w-5xl">
            <div className="gradient-border flex flex-col gap-6">
              {resume.skills.present.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <img src="/icons/check.svg" alt="" className="w-5 h-5" />
                    Matching Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.present.map((skill) => (
                      <SkillPill key={skill} label={skill} variant="present" />
                    ))}
                  </div>
                </div>
              )}

              {resume.skills.missing.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <img src="/icons/cross.svg" alt="" className="w-5 h-5" />
                    Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.missing.map((skill) => (
                      <SkillPill key={skill} label={skill} variant="missing" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Feedback Sections */}
        <section className="w-full max-w-5xl">
          <div className="flex flex-col md:flex-row gap-0">
            <div className="feedback-section border-r border-gray-100">
              <FeedbackList
                title="Strengths"
                items={resume.strengths}
                icon="/icons/check.svg"
              />
            </div>
            <div className="feedback-section">
              <FeedbackList
                title="Areas to Improve"
                items={resume.weaknesses}
                icon="/icons/warning.svg"
              />
            </div>
          </div>
        </section>

        {/* Suggestions */}
        {resume.suggestions.length > 0 && (
          <section className="w-full max-w-5xl">
            <div className="gradient-border">
              <FeedbackList
                title="💡 Actionable Suggestions"
                items={resume.suggestions}
                icon="/icons/info.svg"
              />
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex flex-row gap-4 max-sm:flex-col">
          <Link to="/upload" className="auth-button text-center text-xl px-10 py-3">
            Analyze Another Resume
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 border border-gray-200 rounded-full py-3 px-8 text-gray-600 hover:bg-white/60 text-xl font-semibold"
          >
            <img src="/icons/back.svg" alt="" className="w-5 h-5" />
            Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
