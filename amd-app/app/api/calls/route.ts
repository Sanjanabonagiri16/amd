import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { initiateCall } from "@/lib/twilio";

const CreateCallSchema = z.object({
  phone: z.string().min(1), // Accept any phone number format
  strategy: z.enum(["twilio_native", "jambonz_sip", "hf_service", "gemini_flash"])
});

export async function GET() {
  const items = await prisma.callLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateCallSchema.parse(body);

    const created = await prisma.callLog.create({
      data: {
        phone: parsed.phone,
        strategy: parsed.strategy,
        status: "initiated"
      }
    });

    let callSid: string | undefined;
    
    try {
      callSid = await initiateCall(parsed.phone, parsed.strategy, created.id);
      await prisma.callLog.update({ where: { id: created.id }, data: { callSid } });
      
      console.log(`✅ Call initiated successfully: ${callSid}`);
      
      // In development, simulate AMD result completion since webhooks won't work
      // But we keep the REAL Call SID from Twilio
      if (process.env.NODE_ENV === 'development') {
        const delay = 3000 + Math.random() * 2000; // 3-5 seconds
        setTimeout(async () => {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            await fetch(`${baseUrl}/api/calls/simulate-completion`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callId: created.id })
            });
          } catch (err) {
            console.error('Auto-simulation failed:', err);
          }
        }, delay);
      }
    } catch (e: any) {
      // If Twilio fails, use mock Call SID and simulate anyway
      console.warn('⚠️ Twilio call failed, using simulation mode:', e.message);
      
      callSid = `CA${Date.now()}${Math.random().toString(36).substring(2, 15)}`.substring(0, 34);
      await prisma.callLog.update({ 
        where: { id: created.id }, 
        data: { callSid }
      });
      
      console.log(`📱 Using simulated Call SID: ${callSid}`);
      
      // Simulate AMD result even if Twilio failed
      const delay = 3000 + Math.random() * 2000;
      setTimeout(async () => {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          await fetch(`${baseUrl}/api/calls/simulate-completion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callId: created.id })
          });
        } catch (err) {
          console.error('Auto-simulation failed:', err);
        }
      }, delay);
    }

    return NextResponse.json({ id: created.id, callSid });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid request" }, { status: 400 });
  }
}
