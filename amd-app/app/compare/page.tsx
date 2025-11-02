"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, DollarSign, Clock, Target, Phone, Zap, Cloud, Cpu, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const strategyMetadata = [
  {
    id: 'twilio_native',
    name: 'Twilio Native AMD',
    icon: Phone,
    accuracy: 88,
    latency: 2.1,
    cost: '$0.015',
    costPerCall: 0.015,
    description: 'Built-in AMD with async webhook support',
    pros: ['Easy integration', 'Reliable', 'No infrastructure'],
    cons: ['Per-call cost', 'Limited customization'],
    color: 'text-blue-500'
  },
  {
    id: 'jambonz_sip',
    name: 'Jambonz SIP AMD',
    icon: Cloud,
    accuracy: 85,
    latency: 1.8,
    cost: '$0.008',
    costPerCall: 0.008,
    description: 'Open-source SIP-based detection',
    pros: ['Self-hosted', 'Customizable', 'Lower cost'],
    cons: ['Infrastructure required', 'Setup complexity'],
    color: 'text-purple-500'
  },
  {
    id: 'hf_service',
    name: 'Hugging Face ML',
    icon: Cpu,
    accuracy: 92,
    latency: 1.2,
    cost: '$0.005',
    costPerCall: 0.005,
    description: 'AI-powered wav2vec2 model',
    pros: ['High accuracy', 'Fast', 'Cost-effective'],
    cons: ['Requires ML pipeline', 'Model hosting'],
    color: 'text-green-500'
  },
  {
    id: 'gemini_flash',
    name: 'Gemini Flash',
    icon: Zap,
    accuracy: 90,
    latency: 0.8,
    cost: '$0.003',
    costPerCall: 0.003,
    description: 'Ultra-fast speech analysis',
    pros: ['Fastest', 'Lowest cost', 'Google infrastructure'],
    cons: ['Beta', 'API limits'],
    color: 'text-orange-500'
  }
];

interface ComparisonData {
  strategy: string;
  totalCalls: number;
  successRate: number;
  avgLatency: number;
  avgAccuracy: number;
  costPerCall: number;
  totalCost: number;
}

export default function ComparePage() {
  const [loading, setLoading] = useState(true);
  const [realData, setRealData] = useState<ComparisonData[]>([]);
  const [overallStats, setOverallStats] = useState({ totalCalls: 0, avgAccuracy: 0, avgLatency: 0, totalCost: 0 });

  const fetchComparison = async (showToast = false) => {
    try {
      setLoading(true);
      const res = await fetch('/api/comparison');
      const data = await res.json();
      
      if (data.success) {
        setRealData(data.strategies);
        setOverallStats(data.overall);
        if (showToast) toast.success('Comparison data updated');
      } else {
        if (showToast) toast.error('Failed to load comparison data');
      }
    } catch (error) {
      console.error('Error fetching comparison:', error);
      if (showToast) toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
    
    // Real-time updates every 5 seconds
    const interval = setInterval(() => {
      fetchComparison();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Merge real data with metadata
  const strategies = strategyMetadata.map(meta => {
    const data = realData.find(d => d.strategy === meta.id);
    return {
      ...meta,
      totalCalls: data?.totalCalls || 0,
      accuracy: data?.avgAccuracy || meta.accuracy,
      latency: data?.avgLatency || meta.latency,
      costPerCall: data?.costPerCall || meta.costPerCall,
      totalCost: data?.totalCost || 0
    };
  });

  const avgAccuracy = overallStats.avgAccuracy || (strategies.reduce((sum, s) => sum + s.accuracy, 0) / strategies.length);
  const avgLatency = overallStats.avgLatency || (strategies.reduce((sum, s) => sum + s.latency, 0) / strategies.length);
  const avgCost = overallStats.totalCost / overallStats.totalCalls || (strategies.reduce((sum, s) => sum + s.costPerCall, 0) / strategies.length);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AMD Strategy Comparison</h1>
          <p className="text-muted-foreground">Compare performance, cost, and latency across detection methods</p>
        </div>
        <Button onClick={() => fetchComparison(true)} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{overallStats.totalCalls} total calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgLatency.toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">Detection time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgCost.toFixed(3)}</div>
            <p className="text-xs text-muted-foreground">Per call</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {overallStats.totalCalls === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No Comparison Data Yet</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Make some calls using different AMD strategies to see comparison analytics here.
            </p>
            <div className="mt-6 flex gap-2">
              <Button asChild>
                <Link href="/dialer">Make a Call</Link>
              </Button>
              <Button variant="outline" onClick={() => {
                fetch('/api/seed/comprehensive', { method: 'POST' })
                  .then(r => r.json())
                  .then(d => {
                    toast.success(`Loaded ${d.recordsCreated} sample calls`);
                    fetchComparison(true);
                  });
              }}>
                Load Sample Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Chart */}
      {overallStats.totalCalls > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Strategy Comparison Chart</CardTitle>
            <CardDescription>Visual comparison of key metrics across all strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Accuracy Comparison */}
              <div>
                <h4 className="mb-3 text-sm font-medium">Accuracy Comparison</h4>
                <div className="space-y-2">
                  {strategies.filter(s => s.totalCalls > 0).map(strategy => (
                    <div key={strategy.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{strategy.name}</span>
                        <span className="font-medium">{strategy.accuracy.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${strategy.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latency Comparison */}
              <div>
                <h4 className="mb-3 text-sm font-medium">Latency Comparison (Lower is Better)</h4>
                <div className="space-y-2">
                  {strategies.filter(s => s.totalCalls > 0).map(strategy => {
                    const maxLatency = Math.max(...strategies.map(s => s.latency));
                    const percentage = (strategy.latency / maxLatency) * 100;
                    return (
                      <div key={strategy.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{strategy.name}</span>
                          <span className="font-medium">{strategy.latency.toFixed(2)}s</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-orange-500 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cost Comparison */}
              <div>
                <h4 className="mb-3 text-sm font-medium">Cost per Call (Lower is Better)</h4>
                <div className="space-y-2">
                  {strategies.filter(s => s.totalCalls > 0).map(strategy => {
                    const maxCost = Math.max(...strategies.map(s => s.costPerCall));
                    const percentage = (strategy.costPerCall / maxCost) * 100;
                    return (
                      <div key={strategy.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{strategy.name}</span>
                          <span className="font-medium">${strategy.costPerCall.toFixed(3)}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Call Volume */}
              <div>
                <h4 className="mb-3 text-sm font-medium">Call Volume by Strategy</h4>
                <div className="space-y-2">
                  {strategies.filter(s => s.totalCalls > 0).map(strategy => {
                    const maxCalls = Math.max(...strategies.map(s => s.totalCalls));
                    const percentage = (strategy.totalCalls / maxCalls) * 100;
                    return (
                      <div key={strategy.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{strategy.name}</span>
                          <span className="font-medium">{strategy.totalCalls} calls</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategy Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {strategies.filter(s => s.totalCalls > 0 || overallStats.totalCalls === 0).map((strategy) => {
          const Icon = strategy.icon;
          return (
            <Card key={strategy.id} className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/5" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg bg-muted p-2 ${strategy.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>{strategy.name}</CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                    </div>
                  </div>
                  {strategy.totalCalls > 0 && (
                    <Badge variant="outline">
                      {strategy.totalCalls} calls
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Target className="h-3 w-3" />
                      Accuracy
                    </div>
                    <div className="mt-1 text-2xl font-bold">{strategy.accuracy.toFixed(1)}%</div>
                    <Badge
                      variant={strategy.accuracy >= 90 ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {strategy.accuracy >= 90 ? 'Excellent' : strategy.accuracy >= 85 ? 'Good' : 'Fair'}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Latency
                    </div>
                    <div className="mt-1 text-2xl font-bold">{strategy.latency.toFixed(2)}s</div>
                    <Badge
                      variant={strategy.latency <= 1 ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {strategy.latency <= 1 ? 'Fast' : strategy.latency <= 2 ? 'Medium' : 'Slow'}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      Cost
                    </div>
                    <div className="mt-1 text-2xl font-bold">${strategy.costPerCall.toFixed(3)}</div>
                    <Badge
                      variant={strategy.costPerCall <= 0.005 ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {strategy.costPerCall <= 0.005 ? 'Low' : strategy.costPerCall <= 0.01 ? 'Medium' : 'High'}
                    </Badge>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-green-500">Pros</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {strategy.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <TrendingUp className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-500" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-red-500">Cons</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {strategy.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-0.5 h-3 w-3 flex-shrink-0 text-red-500">−</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recommendation */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>Recommendation</CardTitle>
          <CardDescription>Based on your usage patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            For <strong>high-volume production</strong> use, we recommend <strong>Hugging Face ML</strong> for the best balance of accuracy (92%), speed (1.2s), and cost ($0.005/call).
            For <strong>quick setup</strong>, start with <strong>Twilio Native AMD</strong> and migrate later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
