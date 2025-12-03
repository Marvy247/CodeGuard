"use client";

import { Bot, Brain, Eye, Shield, AlertTriangle, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AgentStatusIndicatorProps {
  showDetails?: boolean;
}

export function AgentStatusIndicator({ showDetails = false }: AgentStatusIndicatorProps) {
  // Mock agent status data - in production, fetch from orchestrator
  const agents = [
    {
      id: "orchestrator",
      name: "Orchestrator",
      status: "healthy" as const,
      icon: Brain,
      activity: 98,
      color: "text-blue-500",
    },
    {
      id: "monitor",
      name: "Monitor",
      status: "healthy" as const,
      icon: Eye,
      activity: 95,
      color: "text-purple-500",
    },
    {
      id: "analyzer",
      name: "Analyzer",
      status: "healthy" as const,
      icon: Zap,
      activity: 87,
      color: "text-yellow-500",
    },
    {
      id: "threat-intel",
      name: "Threat Intel",
      status: "healthy" as const,
      icon: AlertTriangle,
      activity: 92,
      color: "text-orange-500",
    },
    {
      id: "response",
      name: "Response",
      status: "healthy" as const,
      icon: Shield,
      activity: 100,
      color: "text-green-500",
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "healthy") {
      return <Badge variant="outline" className="gap-1 border-green-500/50 text-green-500">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Healthy
      </Badge>;
    }
    if (status === "degraded") {
      return <Badge variant="default" className="gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
        Degraded
      </Badge>;
    }
    return <Badge variant="destructive" className="gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      Offline
    </Badge>;
  };

  if (!showDetails) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border"
            >
              <Icon className={`h-4 w-4 ${agent.color}`} />
              <span className="text-sm font-medium">{agent.name}</span>
              <span className={`w-2 h-2 rounded-full ${
                agent.status === "healthy" ? "bg-green-500" : "bg-red-500"
              } ${agent.status === "healthy" ? "animate-pulse" : ""}`} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Agent Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div key={agent.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${agent.color}`} />
                  <span className="font-medium text-sm">{agent.name}</span>
                </div>
                {getStatusBadge(agent.status)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Activity</span>
                  <span>{agent.activity}%</span>
                </div>
                <Progress value={agent.activity} className="h-1.5" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
