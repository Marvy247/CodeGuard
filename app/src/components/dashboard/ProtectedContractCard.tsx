"use client";

import { Shield, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RiskScoreGauge } from "./RiskScoreGauge";
import type { ProtectedContract } from "../../types/contract";

interface ProtectedContractCardProps {
  contract: ProtectedContract;
  onViewDetails?: () => void;
}

export function ProtectedContractCard({ contract, onViewDetails }: ProtectedContractCardProps) {
  const handleAnalyze = () => {
    // Open Basescan in new tab
    window.open(`https://sepolia.basescan.org/address/${contract.address}`, '_blank');
  };
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="group hover:shadow-lg hover:border-primary/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-2 mb-1">
              <Shield className="h-5 w-5 text-primary" />
              {contract.protocolName}
            </CardTitle>
            <CardDescription className="font-mono text-xs flex items-center gap-2">
              {truncateAddress(contract.address)}
              <ExternalLink className="h-3 w-3 opacity-50" />
            </CardDescription>
          </div>
          <RiskScoreGauge score={contract.riskScore} size="sm" showLabel={false} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Status
            </p>
            {contract.isPaused ? (
              <Badge variant="destructive" className="gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                Paused
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 border-green-500/50 text-green-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last Check
            </p>
            <p className="text-sm font-medium">{formatTimestamp(contract.lastCheckTimestamp)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onViewDetails || (() => window.open(`https://sepolia.basescan.org/address/${contract.address}`, '_blank'))}
            className="flex-1 group-hover:shadow-md transition-shadow"
            size="sm"
          >
            View on Basescan
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="group-hover:border-primary/50 transition-colors"
            onClick={handleAnalyze}
          >
            Analyze
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
