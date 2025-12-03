"use client";

interface RiskScoreGaugeProps {
  score: number; // 0-100
  size?: "sm" | "md" | "lg";
}

export function RiskScoreGauge({ score, size = "md" }: RiskScoreGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 90) return "text-red-600";
    if (score >= 70) return "text-orange-500";
    if (score >= 50) return "text-yellow-500";
    return "text-green-500";
  };

  const getSeverity = (score: number) => {
    if (score >= 90) return "CRITICAL";
    if (score >= 70) return "HIGH";
    if (score >= 50) return "MEDIUM";
    return "LOW";
  };

  const sizeClasses = {
    sm: "w-20 h-20 text-sm",
    md: "w-32 h-32 text-xl",
    lg: "w-48 h-48 text-3xl",
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <svg className="transform -rotate-90" width="100%" height="100%">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-700"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={getColor(score)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold ${getColor(score)}`}>{score}</span>
        <span className="text-xs text-gray-400">{getSeverity(score)}</span>
      </div>
    </div>
  );
}
