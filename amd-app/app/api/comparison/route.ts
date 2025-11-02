import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all completed calls from database
    const calls = await prisma.callLog.findMany({
      where: {
        status: 'completed'
      },
      select: {
        strategy: true,
        rawResult: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Group calls by strategy
    const strategyStats: Record<string, {
      totalCalls: number;
      successfulDetections: number;
      avgLatency: number;
      latencies: number[];
      accuracies: number[];
    }> = {};

    calls.forEach(call => {
      const strategy = call.strategy;
      
      if (!strategyStats[strategy]) {
        strategyStats[strategy] = {
          totalCalls: 0,
          successfulDetections: 0,
          avgLatency: 0,
          latencies: [],
          accuracies: []
        };
      }

      strategyStats[strategy].totalCalls++;

      // Parse rawResult (stored as string in SQLite)
      let result: any = {};
      try {
        if (typeof call.rawResult === 'string') {
          result = JSON.parse(call.rawResult);
        } else {
          result = call.rawResult || {};
        }
      } catch (e) {
        console.error('Error parsing rawResult:', e);
      }

      // Calculate latency (time between created and updated)
      const latency = (call.updatedAt.getTime() - call.createdAt.getTime()) / 1000;
      strategyStats[strategy].latencies.push(latency);

      // Track successful detections
      if (result.amdStatus === 'human' || result.amdStatus === 'machine') {
        strategyStats[strategy].successfulDetections++;
      }

      // Track confidence/accuracy if available
      if (result.confidence) {
        strategyStats[strategy].accuracies.push(result.confidence * 100);
      }
    });

    // Calculate averages and format response
    const comparison = Object.entries(strategyStats).map(([strategy, stats]) => {
      const avgLatency = stats.latencies.length > 0
        ? stats.latencies.reduce((sum, l) => sum + l, 0) / stats.latencies.length
        : 0;

      const avgAccuracy = stats.accuracies.length > 0
        ? stats.accuracies.reduce((sum, a) => sum + a, 0) / stats.accuracies.length
        : 0;

      const successRate = stats.totalCalls > 0
        ? (stats.successfulDetections / stats.totalCalls) * 100
        : 0;

      // Strategy-specific cost estimates
      const costPerCall = {
        'twilio_native': 0.015,
        'jambonz_sip': 0.008,
        'hf_service': 0.005,
        'gemini_flash': 0.003
      }[strategy] || 0.01;

      return {
        strategy,
        totalCalls: stats.totalCalls,
        successRate: Math.round(successRate * 10) / 10,
        avgLatency: Math.round(avgLatency * 100) / 100,
        avgAccuracy: Math.round(avgAccuracy * 10) / 10,
        costPerCall,
        totalCost: Math.round(stats.totalCalls * costPerCall * 1000) / 1000
      };
    });

    // Calculate overall stats
    const totalCalls = calls.length;
    const overallStats = {
      totalCalls,
      avgAccuracy: comparison.length > 0
        ? Math.round((comparison.reduce((sum, s) => sum + s.avgAccuracy, 0) / comparison.length) * 10) / 10
        : 0,
      avgLatency: comparison.length > 0
        ? Math.round((comparison.reduce((sum, s) => sum + s.avgLatency, 0) / comparison.length) * 100) / 100
        : 0,
      totalCost: Math.round(comparison.reduce((sum, s) => sum + s.totalCost, 0) * 1000) / 1000
    };

    return NextResponse.json({
      success: true,
      overall: overallStats,
      strategies: comparison,
      lastUpdated: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Comparison API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch comparison data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
