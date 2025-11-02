import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const logId = searchParams.get('logId');

    if (!logId) {
      return NextResponse.json({ error: 'Missing logId' }, { status: 400 });
    }

    const body = await req.json();
    
    // Jambonz AMD result format
    const amdResult = body.amd || body;
    const amdType = amdResult.type || amdResult.reason; // 'human', 'machine', 'unknown'
    const confidence = amdResult.confidence || 0.85;
    const callSid = body.call_sid || body.callSid || `JB_${Date.now()}`;

    const result = {
      amdStatus: amdType === 'human' ? 'human' : 'machine',
      confidence,
      provider: 'jambonz',
      callSid,
      detectionMethod: amdResult.method || 'speech_analysis',
      detectedAt: new Date().toISOString(),
      details: amdResult
    };

    // Update call log with AMD result (stringify for SQLite)
    await prisma.callLog.update({
      where: { id: logId },
      data: {
        status: 'completed',
        callSid,
        rawResult: JSON.stringify(result)
      }
    });
    
    console.log(`✅ Jambonz AMD result saved for ${logId}:`, result);

    // Return TwiML-like response for Jambonz
    return NextResponse.json({
      verb: 'hangup'
    });

  } catch (error: any) {
    console.error('Jambonz AMD webhook error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
