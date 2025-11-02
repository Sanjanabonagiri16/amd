import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const url = new URL(req.url);
  const logId = url.searchParams.get("logId");
  const strategy = url.searchParams.get("strategy");
  
  if (!logId) return NextResponse.json({ ok: false }, { status: 400 });

  const callSid = String(form.get("CallSid") || "");
  const recordingUrl = String(form.get("RecordingUrl") || "");
  const recordingStatus = String(form.get("RecordingStatus") || "");
  const amdStatus = String(form.get("AnsweredBy") || "");
  const callStatus = String(form.get("CallStatus") || "");

  // Handle Twilio Native AMD result
  if (amdStatus && strategy === "twilio_native") {
    const result = {
      amdStatus: amdStatus.toLowerCase(),
      confidence: amdStatus.toLowerCase() === 'human' ? 0.88 : 0.92,
      provider: 'twilio',
      callSid,
      detectedAt: new Date().toISOString()
    };
    
    await prisma.callLog.update({
      where: { id: logId },
      data: {
        status: 'completed',
        callSid: callSid || undefined,
        rawResult: JSON.stringify(result) // Stringify for SQLite
      }
    });
    
    console.log(`✅ Twilio AMD result saved for ${logId}:`, result);
  }
  
  // Handle recording completion for HF/Gemini strategies
  else if (recordingUrl && recordingStatus === "completed" && (strategy === "hf_service" || strategy === "gemini_flash")) {
    // Update with recording URL first
    await prisma.callLog.update({
      where: { id: logId },
      data: {
        callSid: callSid || undefined,
        status: 'processing'
      }
    });

    // Process recording asynchronously
    processRecording(recordingUrl, callSid, logId, strategy).catch(err => {
      console.error('Error processing recording:', err);
    });
  }
  
  // Handle call status updates
  else if (callStatus) {
    const statusMap: Record<string, string> = {
      'initiated': 'initiated',
      'ringing': 'ringing',
      'in-progress': 'in-progress',
      'completed': 'completed',
      'failed': 'error',
      'busy': 'error',
      'no-answer': 'error'
    };
    
    await prisma.callLog.update({
      where: { id: logId },
      data: {
        callSid: callSid || undefined,
        status: statusMap[callStatus] || callStatus
      }
    });
  }

  // Return TwiML
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="polly.Joanna">Thank you. This is a demo.</Say></Response>`;
  return new NextResponse(xml, { headers: { "Content-Type": "text/xml" } });
}

async function processRecording(recordingUrl: string, callSid: string, logId: string, strategy: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const audioUrl = `${recordingUrl}.wav`; // Twilio provides .wav format
    
    let endpoint = '';
    if (strategy === 'hf_service') {
      endpoint = `${baseUrl}/api/huggingface/predict`;
    } else if (strategy === 'gemini_flash') {
      endpoint = `${baseUrl}/api/gemini/analyze`;
    }

    if (!endpoint) return;

    // Call the appropriate AMD analysis endpoint
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioUrl, callSid })
    });

    if (response.ok) {
      const result = await response.json();
      
      // Update call log with AMD result (stringify for SQLite)
      await prisma.callLog.update({
        where: { id: logId },
        data: {
          status: 'completed',
          rawResult: JSON.stringify(result)
        }
      });
      
      console.log(`✅ ${strategy} AMD result saved for ${logId}:`, result);
    } else {
      console.error('AMD analysis failed:', await response.text());
      await prisma.callLog.update({
        where: { id: logId },
        data: {
          status: 'error',
          rawResult: JSON.stringify({ error: 'AMD analysis failed' })
        }
      });
    }
  } catch (error) {
    console.error('Error in processRecording:', error);
    await prisma.callLog.update({
      where: { id: logId },
      data: {
        status: 'error',
        rawResult: JSON.stringify({ error: String(error) })
      }
    });
  }
}
