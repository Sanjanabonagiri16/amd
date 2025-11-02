import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ provider: 'jambonz', label: 'machine', confidence: 0.75, latency_ms: 1200 });
}
