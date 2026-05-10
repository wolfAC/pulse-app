"use client";

import { cn } from "@/lib/utils";

interface RadialScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function RadialScore({
  score,
  size = "md",
  showLabel = true,
  className,
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
          className={cn("transition-all duration-500", getScoreColor(score))}
        />
      </svg>
      {showLabel && (
        <span
          className={cn(
            "absolute font-semibold",
            config.fontSize,
            getScoreColor(score).split(" ")[0],
          )}
        >
          {score}
        </span>
      )}
    </div>
  );
}
