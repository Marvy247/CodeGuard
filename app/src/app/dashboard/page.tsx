"use client";

import { Shield, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskScoreGauge } from "@/components/dashboard/RiskScoreGauge";
import { ProtectedContractCard } from "@/components/dashboard/ProtectedContractCard";
import { IncidentFeed } from "@/components/dashboard/IncidentFeed";
import { AgentStatusIndicator } from "@/components/dashboard/AgentStatusIndicator";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  // Mock data - in production, fetch from contracts and agents
  const mockContracts = [
    {
      address: "0x1234567890123456789012345678901234567890",
      guardian: "0xAgent123...",
      riskScore: 15,
      isPaused: false,
      lastCheckTimestamp: Math.floor(Date.now() / 1000) - 180,
      pausedAt: 0,
      protocolName: "DeFi Protocol Alpha",
    },
    {
      address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      guardian: "0xAgent123...",
      riskScore: 72,
      isPaused: false,
      lastCheckTimestamp: Math.floor(Date.now() / 1000) - 60,
      pausedAt: 0,
      protocolName: "NFT Marketplace Beta",
    },
    {
      address: "0x9876543210987654321098765432109876543210",
      guardian: "0xAgent123...",
      riskScore: 95,
      isPaused: true,
      lastCheckTimestamp: Math.floor(Date.now() / 1000) - 30,
      pausedAt: Math.floor(Date.now() / 1000) - 300,
      protocolName: "Lending Protocol Gamma",
    },
  ];

  const stats = [
    {
      title: "Protected Contracts",
      value: "12",
      change: "+2 this week",
      icon: Shield,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Monitors",
      value: "5",
      change: "All systems operational",
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Threats Detected",
      value: "7",
      change: "-3 from last week",
      icon: AlertTriangle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Success Rate",
      value: "99.8%",
      change: "+0.2% improvement",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  const averageRiskScore = Math.round(
    mockContracts.reduce((sum, c) => sum + c.riskScore, 0) / mockContracts.length
  );

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              CodeGuard Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered smart contract security monitoring
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="gap-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Operational
            </Badge>
            <p className="text-xs text-muted-foreground" suppressHydrationWarning>
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        <Separator className="mt-6" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agent Status */}
          <AgentStatusIndicator showDetails={false} />

          {/* Protected Contracts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Protected Contracts</CardTitle>
                  <CardDescription>Real-time security monitoring for your protocols</CardDescription>
                </div>
                <RiskScoreGauge score={averageRiskScore} size="sm" />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All ({mockContracts.length})</TabsTrigger>
                  <TabsTrigger value="active">
                    Active ({mockContracts.filter(c => !c.isPaused).length})
                  </TabsTrigger>
                  <TabsTrigger value="paused">
                    Paused ({mockContracts.filter(c => c.isPaused).length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  {mockContracts.map((contract) => (
                    <ProtectedContractCard
                      key={contract.address}
                      contract={contract}
                      onViewDetails={() => console.log("View details:", contract.address)}
                    />
                  ))}
                </TabsContent>
                <TabsContent value="active" className="space-y-4">
                  {mockContracts
                    .filter(c => !c.isPaused)
                    .map((contract) => (
                      <ProtectedContractCard
                        key={contract.address}
                        contract={contract}
                        onViewDetails={() => console.log("View details:", contract.address)}
                      />
                    ))}
                </TabsContent>
                <TabsContent value="paused" className="space-y-4">
                  {mockContracts
                    .filter(c => c.isPaused)
                    .map((contract) => (
                      <ProtectedContractCard
                        key={contract.address}
                        contract={contract}
                        onViewDetails={() => console.log("View details:", contract.address)}
                      />
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Incident Feed */}
        <div className="space-y-6">
          <IncidentFeed />
          <AgentStatusIndicator showDetails={true} />
        </div>
      </div>
    </div>
  );
}
