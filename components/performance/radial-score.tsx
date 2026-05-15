"use client";
import { cn } from "@/lib/utils";

interface RadialScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  color?: string; // e.g. "text-emerald-400 stroke-emerald-400"
}

export function RadialScore({
  score,
  size = "md",
  showLabel = true,
  className,
  color,
}: RadialScoreProps) {
  const sizeConfig = {
    sm: { width: 48, stroke: 4, fontSize: "text-xs" },
    md: { width: 64, stroke: 5, fontSize: "text-sm" },
    lg: { width: 80, stroke: 6, fontSize: "text-lg" },
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent stroke-accent";
    if (score >= 60) return "text-primary stroke-primary";
    if (score >= 40) return "text-yellow-500 stroke-yellow-500";
    return "text-destructive stroke-destructive";
  };

  const resolvedColor = color ?? getScoreColor(score);
  const textColor = resolvedColor.split(" ")[0]; // e.g. "text-emerald-400"

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg
        width={config.width}
        height={config.width}
        className="transform -rotate-90"
      >
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          className="text-muted/30"
        />
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-500", resolvedColor)}
        />
      </svg>
      {showLabel && (
        <span
          className={cn("absolute font-semibold", config.fontSize, textColor)}
        >
          {score}
        </span>
      )}
    </div>
  );
}
