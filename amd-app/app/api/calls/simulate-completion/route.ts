import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Simulate call completion for local testing
 * This endpoint simulates what webhooks would do in production
 * POST /api/calls/simulate-completion
 */
export async function POST(req: NextRequest) {
  try {
    const { callId } = await req.json();
    
    if (!callId) {
      return NextResponse.json({ error: 'callId required' }, { status: 400 });
    }

    // Get the call
    const call = await prisma.callLog.findUnique({
      where: { id: callId }
    });

    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    // Generate mock AMD result based on strategy
    let result: any;
    const callSid = call.callSid || `CA${Date.now()}${Math.random().toString(36).substring(2, 15)}`.substring(0, 34);
    
    // Update Call SID if it was missing
    if (!call.callSid) {
      await prisma.callLog.update({
        where: { id: callId },
        data: { callSid }
      });
      console.log(`📱 Generated Call SID for ${callId}: ${callSid}`);
    }

    switch (call.strategy) {
      case 'twilio_native':
        result = {
          amdStatus: Math.random() > 0.5 ? 'human' : 'machine',
          confidence: 0.85 + Math.random() * 0.1,
          provider: 'twilio',
          callSid, // Real Twilio Call SID
          detectedAt: new Date().toISOString()
        };
        break;

      case 'hf_service':
        const isHuman = Math.random() > 0.5;
        result = {
          amdStatus: isHuman ? 'human' : 'machine',
          confidence: 0.90 + Math.random() * 0.08,
          model: 'wav2vec2-base-960h',
          transcription: isHuman 
            ? 'Hello? Who is this calling?' 
            : 'Hi, you have reached the voicemail. Please leave a message after the beep.',
          detectedPatterns: isHuman ? [] : ['voicemail', 'leave a message', 'after the beep'],
          callSid
        };
        break;

      case 'gemini_flash':
        const isHumanGemini = Math.random() > 0.5;
        result = {
          amdStatus: isHumanGemini ? 'human' : 'machine',
          confidence: 0.92 + Math.random() * 0.06,
          model: 'gemini-1.5-flash',
          reasoning: isHumanGemini
            ? 'Natural conversational tone with immediate interactive response. Speaker shows curiosity and engagement typical of human conversation.'
            : 'Scripted greeting with clear voicemail indicators. Monotone delivery, mentions "leave a message" which is a classic voicemail pattern.',
          callSid
        };
        break;

      case 'jambonz_sip':
        const isHumanJambonz = Math.random() > 0.5;
        result = {
          amdStatus: isHumanJambonz ? 'human' : 'machine',
          confidence: 0.82 + Math.random() * 0.1,
          provider: 'jambonz',
          callSid, // Real Call SID (Jambonz uses same Twilio number)
          detectionMethod: isHumanJambonz ? 'speech_analysis' : 'beep_detection',
          detectedAt: new Date().toISOString()
        };
        break;

      default:
        result = {
          amdStatus: 'unknown',
          confidence: 0.5,
          error: 'Unknown strategy'
        };
    }

    // Update call with result (keep existing Call SID)
    await prisma.callLog.update({
      where: { id: callId },
      data: {
        status: 'completed',
        // Don't update callSid - it's already set from Twilio
        rawResult: JSON.stringify(result),
        updatedAt: new Date()
      }
    });

    console.log(`✅ Simulated completion for ${callId} (${call.strategy}):`, result);

    return NextResponse.json({
      success: true,
      callId,
      strategy: call.strategy,
      result
    });

  } catch (error: any) {
    console.error('Simulate completion error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to simulate completion',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
