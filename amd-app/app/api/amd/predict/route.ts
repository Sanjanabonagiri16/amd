import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { audioUrl } = await req.json();
  const url = process.env.AMD_SERVICE_URL || "http://127.0.0.1:8000";
  try {
    const r = await fetch(`${url}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audio_url: audioUrl })
    });
    const data = await r.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
