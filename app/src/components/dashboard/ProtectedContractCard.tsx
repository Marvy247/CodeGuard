"use client";

import { RiskScoreGauge } from "./RiskScoreGauge";
import type { ProtectedContract } from "../../types/contract";

interface ProtectedContractCardProps {
  contract: ProtectedContract;
  onViewDetails?: () => void;
}

export function ProtectedContractCard({ contract, onViewDetails }: ProtectedContractCardProps) {
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return "Never";
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{contract.protocolName}</h3>
          <p className="text-sm text-gray-400 font-mono">{contract.address}</p>
        </div>
        <RiskScoreGauge score={contract.riskScore} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Status</p>
          {contract.isPaused ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-red-500/20 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Paused
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-green-500/20 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Active
            </span>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Last Check</p>
          <p className="text-sm">{formatTimestamp(contract.lastCheckTimestamp)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onViewDetails}
          className="flex-1 px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
        <button className="px-4 py-2 text-sm rounded border border-gray-700 hover:border-gray-600 transition-colors">
          Analyze
        </button>
      </div>
    </div>
  );
}
