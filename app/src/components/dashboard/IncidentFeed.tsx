"use client";

import { useAgentWebSocket } from "../../lib/hooks/useAgentWebSocket";
import type { Incident } from "../../types/contract";

export function IncidentFeed() {
  const { incidents, connected } = useAgentWebSocket();

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSeverityColor = (riskScore: number) => {
    if (riskScore >= 90) return "border-l-red-500 bg-red-950/20";
    if (riskScore >= 70) return "border-l-orange-500 bg-orange-950/20";
    if (riskScore >= 50) return "border-l-yellow-500 bg-yellow-950/20";
    return "border-l-green-500 bg-green-950/20";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Live Incident Feed</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <span className="text-sm text-gray-400">{connected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      {incidents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No incidents detected. System monitoring active.
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(incident.riskScore)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm">{incident.contractAddress.slice(0, 10)}...</span>
                    <span className="px-2 py-0.5 text-xs rounded bg-gray-800">
                      {incident.incidentType}
                    </span>
                    <span className="font-bold text-sm">Risk: {incident.riskScore}/100</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    Detected by: {incident.detectedBy.slice(0, 10)}...
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(incident.timestamp)}
                  </p>
                </div>
                {incident.resolved && (
                  <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-400">
                    Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
