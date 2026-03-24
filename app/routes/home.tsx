import type { Route } from "./+types/home";
import { useEffect } from "react";
import { Link } from "react-router";
import { Navbar } from "~/components/Navbar";
import { ResumeCard } from "~/components/ResumeCard";
import { useResumeStore } from "~/store/useResumeStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeAI – AI Resume Analyzer" },
    {
      name: "description",
      content:
        "Analyze your resume with AI, get ATS score and actionable feedback.",
    },
  ];
}

export default function Home() {
  const { resumes, isLoaded, loadResumes, deleteResume } = useResumeStore();

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this analysis?")) {
      deleteResume(id);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(to bottom, #f0f4ff 60%, #fa7185cc)" }}
    >
      <Navbar />

      <main className="main-section">
        {/* Hero */}
        <section className="page-heading">
          <h1>Analyze Your Resume with AI</h1>
          <h2 className="max-w-2xl">
            Get an ATS score, detailed feedback, and actionable suggestions to
            land your dream job.
          </h2>

          <div className="flex flex-row gap-4 max-sm:flex-col w-full justify-center">
            <Link
              to="/upload"
              className="auth-button text-center inline-block"
            >
              Analyze My Resume
            </Link>
          </div>
        </section>

        {/* Preview images */}
        <div className="flex flex-row gap-4 items-end max-sm:hidden">
          <img
            src="/images/resume_01.png"
            alt="Resume example"
            className="w-40 rounded-2xl shadow-lg rotate-[-6deg]"
          />
          <img
            src="/images/resume-scan.gif"
            alt="AI scanning"
            className="w-48 rounded-2xl shadow-xl"
          />
          <img
            src="/images/resume_02.png"
            alt="Resume example"
            className="w-40 rounded-2xl shadow-lg rotate-[6deg]"
          />
        </div>

        {/* Saved Analyses */}
        {isLoaded && resumes.length > 0 && (
          <section className="w-full max-w-[1850px]">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-left px-2">
              Your Analyses
            </h2>
            <div className="resumes-section">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>
        )}

        {isLoaded && resumes.length === 0 && (
          <section className="w-full max-w-2xl">
            <div className="gradient-border text-center py-12">
              <img
                src="/images/resume-scan-2.gif"
                alt="No resumes"
                className="w-24 mx-auto mb-4"
              />
              <p className="text-dark-200 text-lg">
                No resumes analyzed yet. Upload your first resume to get
                started!
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
