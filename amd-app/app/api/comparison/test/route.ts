import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Test endpoint to validate comparison API
 * Creates sample data if database is empty
 */
export async function GET() {
  try {
    // Check if we have any calls
    const callCount = await prisma.callLog.count();

    if (callCount === 0) {
      // Create sample data for testing
      const sampleCalls = [
        {
          phone: '+1234567890',
          strategy: 'twilio_native',
          status: 'completed',
          callSid: 'CA_test_twilio_1',
          rawResult: JSON.stringify({
            amdStatus: 'human',
            confidence: 0.88,
            provider: 'twilio'
          })
        },
        {
          phone: '+1234567891',
          strategy: 'hf_service',
          status: 'completed',
          callSid: 'CA_test_hf_1',
          rawResult: JSON.stringify({
            amdStatus: 'machine',
            confidence: 0.92,
            model: 'wav2vec2'
          })
        },
        {
          phone: '+1234567892',
          strategy: 'gemini_flash',
          status: 'completed',
          callSid: 'CA_test_gemini_1',
          rawResult: JSON.stringify({
            amdStatus: 'human',
            confidence: 0.95,
            model: 'gemini-1.5-flash'
          })
        },
        {
          phone: '+1234567893',
          strategy: 'jambonz_sip',
          status: 'completed',
          callSid: 'CA_test_jambonz_1',
          rawResult: JSON.stringify({
            amdStatus: 'machine',
            confidence: 0.85,
            provider: 'jambonz'
          })
        }
      ];

      await prisma.callLog.createMany({
        data: sampleCalls
      });

      return NextResponse.json({
        success: true,
        message: 'Sample data created',
        samplesCreated: sampleCalls.length
      });
    }

    // Test the comparison endpoint
    const comparisonResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/comparison`);
    const comparisonData = await comparisonResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Comparison API validated',
      existingCalls: callCount,
      comparisonData
    });

  } catch (error: any) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
