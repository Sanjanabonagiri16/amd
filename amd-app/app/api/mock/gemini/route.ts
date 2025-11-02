import { NextResponse } from "next/server";
export async function POST() {
  // Mock Gemini Flash: assume fast but needs pipeline
  return NextResponse.json({ provider: 'gemini_flash', label: 'human', confidence: 0.7, latency_ms: 600 });
}
