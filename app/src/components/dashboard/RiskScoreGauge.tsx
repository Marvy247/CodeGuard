"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RiskScoreGaugeProps {
  score: number; // 0-100
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function RiskScoreGauge({ score, size = "md", showLabel = true }: RiskScoreGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 90) return "stroke-red-500";
    if (score >= 70) return "stroke-orange-500";
    if (score >= 50) return "stroke-yellow-500";
    return "stroke-green-500";
  };

  const getTextColor = (score: number) => {
    if (score >= 90) return "text-red-500";
    if (score >= 70) return "text-orange-500";
    if (score >= 50) return "text-yellow-500";
    return "text-green-500";
  };

  const getBadgeVariant = (score: number): "default" | "destructive" | "outline" | "secondary" => {
    if (score >= 90) return "destructive";
    if (score >= 70) return "default";
    return "secondary";
  };

  const getSeverity = (score: number) => {
    if (score >= 90) return "CRITICAL";
    if (score >= 70) return "HIGH";
    if (score >= 50) return "MEDIUM";
    return "LOW";
  };

  const getDescription = (score: number) => {
    if (score >= 90) return "Immediate action required";
    if (score >= 70) return "Potential security threat";
    if (score >= 50) return "Monitor closely";
    return "Contract is secure";
  };

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-3xl",
    lg: "text-5xl",
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-3">
            <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
              <svg className="transform -rotate-90 filter drop-shadow-lg" width="100%" height="100%" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-muted opacity-20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={`${getColor(score)} transition-all duration-500 ease-out`}
                  style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-bold tabular-nums ${textSizeClasses[size]} ${getTextColor(score)}`}>
                  {score}
                </span>
              </div>
            </div>
            {showLabel && (
              <Badge variant={getBadgeVariant(score)} className="font-semibold">
                {getSeverity(score)}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{getSeverity(score)} Risk</p>
          <p className="text-sm text-muted-foreground">{getDescription(score)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
