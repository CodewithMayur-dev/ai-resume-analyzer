import { getATSLevel, type ATSLevel } from "~/types";
import { cn } from "~/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "lg";
}

const levelConfig: Record<
  ATSLevel,
  { icon: string; bg: string; text: string; label: string }
> = {
  good: {
    icon: "/icons/ats-good.svg",
    bg: "bg-badge-green",
    text: "text-badge-green-text",
    label: "Excellent",
  },
  warning: {
    icon: "/icons/ats-warning.svg",
    bg: "bg-badge-yellow",
    text: "text-badge-yellow-text",
    label: "Good",
  },
  bad: {
    icon: "/icons/ats-bad.svg",
    bg: "bg-badge-red",
    text: "text-badge-red-text",
    label: "Needs Work",
  },
};

export function ScoreBadge({ score, size = "sm" }: ScoreBadgeProps) {
  const level = getATSLevel(score);
  const config = levelConfig[level];

  return (
    <div
      className={cn(
        "score-badge",
        config.bg,
        config.text,
        size === "lg" ? "px-4 py-2 gap-2" : "px-2 py-1 gap-1"
      )}
    >
      <img
        src={config.icon}
        alt={config.label}
        className={size === "lg" ? "w-10 h-10" : "w-5 h-5"}
      />
      <span className={cn("font-bold", size === "lg" ? "text-2xl" : "text-sm")}>
        {score}
      </span>
      <span className={size === "lg" ? "text-base" : "text-xs"}>
        {config.label}
      </span>
    </div>
  );
}
