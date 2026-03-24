import { Link } from "react-router";
import type { ResumeAnalysis } from "~/types";
import { ScoreBadge } from "~/components/ScoreBadge";
import { formatDate } from "~/lib/utils";

interface ResumeCardProps {
  resume: ResumeAnalysis;
  onDelete: (id: string) => void;
}

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  return (
    <div className="resume-card shadow-sm border border-gray-100">
      <div className="resume-card-header">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg truncate">
            {resume.jobTitle}
          </h3>
          <p className="text-dark-200 text-sm truncate">{resume.company}</p>
          <p className="text-gray-400 text-xs">{formatDate(resume.uploadedAt)}</p>
        </div>
        <ScoreBadge score={resume.atsScore} />
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-sm text-dark-200">
          <img src="/icons/pin.svg" alt="file" className="w-4 h-4 opacity-60" />
          <span className="truncate">{resume.fileName}</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">{resume.summary}</p>

        <div className="resume-summary mt-auto flex-wrap gap-2 p-0">
          <div className="category">
            <span className="text-xs text-dark-200">Strengths</span>
            <span className="font-semibold text-sm">{resume.strengths.length}</span>
          </div>
          <div className="category">
            <span className="text-xs text-dark-200">Gaps</span>
            <span className="font-semibold text-sm">{resume.weaknesses.length}</span>
          </div>
          <div className="category">
            <span className="text-xs text-dark-200">Skills Missing</span>
            <span className="font-semibold text-sm">{resume.skills.missing.length}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-3 mt-auto pt-4 border-t border-gray-100">
        <Link
          to={`/resume/${resume.id}`}
          className="primary-button text-sm text-center"
        >
          View Analysis
        </Link>
        <button
          onClick={() => onDelete(resume.id)}
          className="flex items-center justify-center gap-1 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer w-full"
        >
          <img src="/icons/cross.svg" alt="Delete" className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
