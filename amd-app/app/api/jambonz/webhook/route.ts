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
    
    // Update call status based on Jambonz event
    const callStatus = body.call_status || body.status;
    const callSid = body.call_sid || body.sid;

    await prisma.callLog.update({
      where: { id: logId },
      data: {
        callSid: callSid || undefined,
        status: callStatus === 'completed' ? 'completed' : 'in-progress'
      }
    });

    // Return empty response (Jambonz doesn't require TwiML)
    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error('Jambonz webhook error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
