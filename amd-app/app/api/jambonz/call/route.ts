import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone, logId } = await req.json();
    
    const accountSid = process.env.JAMBONZ_ACCOUNT_SID;
    const apiKey = process.env.JAMBONZ_API_KEY;
    const restApiUrl = process.env.JAMBONZ_REST_API_URL;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!accountSid || !apiKey || !restApiUrl) {
      console.warn('Jambonz credentials not set, returning mock data');
      
      // Generate mock Call SID
      const mockCallSid = `CA${Date.now()}${Math.random().toString(36).substring(2, 15)}`.substring(0, 34);
      
      // Update log with mock Call SID
      await prisma.callLog.update({
        where: { id: logId },
        data: {
          callSid: mockCallSid,
          status: 'initiated'
        }
      });
      
      // Schedule simulation
      setTimeout(async () => {
        try {
          await fetch(`${baseUrl}/api/calls/simulate-completion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callId: logId })
          });
        } catch (err) {
          console.error('Jambonz simulation failed:', err);
        }
      }, 3000 + Math.random() * 2000);

      return NextResponse.json({
        callSid: `mock_jambonz_${Date.now()}`,
        status: 'initiated',
        mock: true
      });
    }

    // Create Jambonz call
    const jambonzResponse = await fetch(
      `${restApiUrl}/v1/Accounts/${accountSid}/Calls`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.JAMBONZ_FROM_NUMBER || '+1234567890',
          to: {
            type: 'phone',
            number: phone
          },
          call_hook: {
            url: `${baseUrl}/api/jambonz/webhook?logId=${logId}`,
            method: 'POST'
          },
          amd: {
            actionHook: `${baseUrl}/api/jambonz/amd?logId=${logId}`,
            thresholdWordCount: 10,
            timers: {
              noSpeechTimeoutMs: 5000,
              decisionTimeoutMs: 15000,
              toneTimeoutMs: 10000,
              greetingCompletionTimeoutMs: 3000
            }
          }
        })
      }
    );

    if (!jambonzResponse.ok) {
      const errorText = await jambonzResponse.text();
      console.error('Jambonz API error:', errorText);
      
      await prisma.callLog.update({
        where: { id: logId },
        data: {
          status: 'error',
          rawResult: JSON.stringify({
            error: 'Jambonz API error',
            details: errorText
          })
        }
      });

      return NextResponse.json({ 
        error: 'Jambonz API error',
        details: errorText 
      }, { status: jambonzResponse.status });
    }

    const data = await jambonzResponse.json();

    // Update call log with Jambonz call SID
    await prisma.callLog.update({
      where: { id: logId },
      data: {
        callSid: data.sid || data.call_sid,
        status: 'initiated'
      }
    });

    return NextResponse.json({
      callSid: data.sid || data.call_sid,
      status: 'initiated'
    });

  } catch (error: any) {
    console.error('Jambonz call error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
