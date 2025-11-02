import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import twilio from "twilio";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const log = await prisma.callLog.findUnique({ where: { id: params.id } });
  if (!log) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env as Record<string, string | undefined>;
  if (log.callSid && TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    try {
      await client.calls(log.callSid).update({ status: 'completed' });
      await prisma.callLog.update({ where: { id: log.id }, data: { status: 'completed' } });
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  // Mock: just mark completed
  await prisma.callLog.update({ where: { id: log.id }, data: { status: 'completed' } });
  return NextResponse.json({ ok: true, mocked: true });
}
