"use client";

import { Activity, AlertCircle, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgentWebSocket } from "../../lib/hooks/useAgentWebSocket";
import type { Incident } from "../../types/contract";

export function IncidentFeed() {
  const { incidents, connected } = useAgentWebSocket();

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const getSeverityVariant = (riskScore: number): "default" | "destructive" | "outline" | "secondary" => {
    if (riskScore >= 90) return "destructive";
    if (riskScore >= 70) return "default";
    return "secondary";
  };

  const getSeverityIcon = (riskScore: number) => {
    if (riskScore >= 90) return <AlertCircle className="h-4 w-4" />;
    if (riskScore >= 70) return <Activity className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Live Incident Feed
            </CardTitle>
            <CardDescription>Real-time security monitoring</CardDescription>
          </div>
          <Badge variant={connected ? "outline" : "destructive"} className="gap-1.5">
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            {connected ? "Live" : "Offline"}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Shield className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center font-medium">All Clear</p>
            <p className="text-sm text-muted-foreground/70 text-center mt-1">
              No incidents detected. System monitoring active.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="p-4 space-y-3">
              {incidents.map((incident, index) => (
                <Alert
                  key={incident.id}
                  variant={incident.riskScore >= 90 ? "destructive" : "default"}
                  className="group hover:shadow-md transition-all duration-200 animate-in slide-in-from-top-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getSeverityIcon(incident.riskScore)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                              {truncateAddress(incident.contractAddress)}
                            </code>
                            <Badge variant={getSeverityVariant(incident.riskScore)} className="text-xs">
                              {incident.incidentType}
                            </Badge>
                            <span className="text-sm font-semibold tabular-nums">
                              {incident.riskScore}/100
                            </span>
                          </div>
                          <AlertDescription className="text-xs">
                            Detected by {truncateAddress(incident.detectedBy)} • {formatTimestamp(incident.timestamp)}
                          </AlertDescription>
                        </div>
                        {incident.resolved && (
                          <Badge variant="outline" className="gap-1 border-green-500/50 text-green-500 shrink-0">
                            <CheckCircle2 className="h-3 w-3" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
