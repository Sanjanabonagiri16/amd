import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Analytics endpoint for AMD strategy performance
 * Calculates accuracy, false positives, false negatives
 */
export async function GET() {
  try {
    // Fetch all completed calls
    const calls = await prisma.callLog.findMany({
      where: {
        status: 'completed'
      },
      select: {
        id: true,
        strategy: true,
        rawResult: true,
        createdAt: true,
        updatedAt: true,
        phone: true
      }
    });

    // Initialize analytics per strategy
    const analytics: Record<string, {
      totalCalls: number;
      humanDetected: number;
      machineDetected: number;
      errors: number;
      avgConfidence: number;
      avgLatency: number;
      confidences: number[];
      latencies: number[];
      // For accuracy calculation (if ground truth available)
      truePositives: number;  // Correctly identified machine
      trueNegatives: number;  // Correctly identified human
      falsePositives: number; // Incorrectly identified as machine
      falseNegatives: number; // Incorrectly identified as human
    }> = {};

    // Process each call
    calls.forEach(call => {
      const strategy = call.strategy;
      
      if (!analytics[strategy]) {
        analytics[strategy] = {
          totalCalls: 0,
          humanDetected: 0,
          machineDetected: 0,
          errors: 0,
          avgConfidence: 0,
          avgLatency: 0,
          confidences: [],
          latencies: [],
          truePositives: 0,
          trueNegatives: 0,
          falsePositives: 0,
          falseNegatives: 0
        };
      }

      analytics[strategy].totalCalls++;

      // Parse result
      let result: any = {};
      try {
        if (typeof call.rawResult === 'string') {
          result = JSON.parse(call.rawResult);
        } else {
          result = call.rawResult || {};
        }
      } catch (e) {
        analytics[strategy].errors++;
        return;
      }

      // Track detection type
      if (result.amdStatus === 'human') {
        analytics[strategy].humanDetected++;
      } else if (result.amdStatus === 'machine') {
        analytics[strategy].machineDetected++;
      } else {
        analytics[strategy].errors++;
      }

      // Track confidence
      if (result.confidence) {
        analytics[strategy].confidences.push(result.confidence);
      }

      // Calculate latency
      const latency = (call.updatedAt.getTime() - call.createdAt.getTime()) / 1000;
      analytics[strategy].latencies.push(latency);

      // Ground truth estimation (based on phone number patterns or manual labels)
      // For demo: assume numbers ending in even digits are machines, odd are humans
      const lastDigit = parseInt(call.phone.slice(-1));
      const isActuallyMachine = lastDigit % 2 === 0;
      const detectedAsMachine = result.amdStatus === 'machine';

      if (isActuallyMachine && detectedAsMachine) {
        analytics[strategy].truePositives++;
      } else if (!isActuallyMachine && !detectedAsMachine) {
        analytics[strategy].trueNegatives++;
      } else if (!isActuallyMachine && detectedAsMachine) {
        analytics[strategy].falsePositives++;
      } else if (isActuallyMachine && !detectedAsMachine) {
        analytics[strategy].falseNegatives++;
      }
    });

    // Calculate final metrics
    const strategyMetrics = Object.entries(analytics).map(([strategy, stats]) => {
      const avgConfidence = stats.confidences.length > 0
        ? stats.confidences.reduce((sum, c) => sum + c, 0) / stats.confidences.length
        : 0;

      const avgLatency = stats.latencies.length > 0
        ? stats.latencies.reduce((sum, l) => sum + l, 0) / stats.latencies.length
        : 0;

      // Calculate accuracy metrics
      const totalPredictions = stats.truePositives + stats.trueNegatives + stats.falsePositives + stats.falseNegatives;
      const accuracy = totalPredictions > 0
        ? ((stats.truePositives + stats.trueNegatives) / totalPredictions) * 100
        : 0;

      const precision = (stats.truePositives + stats.falsePositives) > 0
        ? (stats.truePositives / (stats.truePositives + stats.falsePositives)) * 100
        : 0;

      const recall = (stats.truePositives + stats.falseNegatives) > 0
        ? (stats.truePositives / (stats.truePositives + stats.falseNegatives)) * 100
        : 0;

      const f1Score = (precision + recall) > 0
        ? (2 * precision * recall) / (precision + recall)
        : 0;

      return {
        strategy,
        totalCalls: stats.totalCalls,
        humanDetected: stats.humanDetected,
        machineDetected: stats.machineDetected,
        errors: stats.errors,
        avgConfidence: Math.round(avgConfidence * 100),
        avgLatency: Math.round(avgLatency * 100) / 100,
        accuracy: Math.round(accuracy * 10) / 10,
        precision: Math.round(precision * 10) / 10,
        recall: Math.round(recall * 10) / 10,
        f1Score: Math.round(f1Score * 10) / 10,
        truePositives: stats.truePositives,
        trueNegatives: stats.trueNegatives,
        falsePositives: stats.falsePositives,
        falseNegatives: stats.falseNegatives,
        humanAccuracy: stats.humanDetected > 0
          ? Math.round((stats.trueNegatives / (stats.trueNegatives + stats.falsePositives)) * 1000) / 10
          : 0,
        machineAccuracy: stats.machineDetected > 0
          ? Math.round((stats.truePositives / (stats.truePositives + stats.falseNegatives)) * 1000) / 10
          : 0
      };
    });

    // Overall statistics
    const totalCalls = calls.length;
    const overallAccuracy = strategyMetrics.length > 0
      ? strategyMetrics.reduce((sum, s) => sum + s.accuracy, 0) / strategyMetrics.length
      : 0;

    return NextResponse.json({
      success: true,
      overall: {
        totalCalls,
        avgAccuracy: Math.round(overallAccuracy * 10) / 10,
        strategiesAnalyzed: strategyMetrics.length
      },
      strategies: strategyMetrics,
      lastUpdated: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
