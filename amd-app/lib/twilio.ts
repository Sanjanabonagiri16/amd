import twilio from "twilio";

export async function initiateCall(to: string, strategy: string, logId: string): Promise<string> {
  // Route to Jambonz for jambonz_sip strategy
  if (strategy === "jambonz_sip") {
    return initiateJambonzCall(to, logId);
  }

  // For HF and Gemini, use Twilio with recording for post-call analysis
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, NEXT_PUBLIC_BASE_URL } = process.env as Record<string, string | undefined>;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !NEXT_PUBLIC_BASE_URL) {
    throw new Error("Twilio env vars not set");
  }
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  const webhook = `${NEXT_PUBLIC_BASE_URL}/api/twilio/webhook`;

  const params: any = {
    to,
    from: TWILIO_FROM_NUMBER,
    url: `http://twimlets.com/echo?Twiml=${encodeURIComponent('<Response><Pause length="5"/></Response>')}`,
    statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
    // Enable native AMD for twilio_native strategy
    machineDetection: strategy === "twilio_native" ? "Enable" : undefined,
    machineDetectionTimeout: 3,
    asyncAmd: strategy === "twilio_native" ? true : undefined,
    asyncAmdStatusCallback: webhook,
    asyncAmdStatusCallbackMethod: "POST",
    // Enable recording for HF and Gemini strategies
    record: (strategy === "hf_service" || strategy === "gemini_flash") ? true : undefined,
    recordingStatusCallback: webhook
  };

  // Attach logId so webhook can correlate
  (params as any).statusCallback = `${webhook}?logId=${encodeURIComponent(logId)}&strategy=${encodeURIComponent(strategy)}`;
  (params as any).recordingStatusCallback = `${webhook}?logId=${encodeURIComponent(logId)}&strategy=${encodeURIComponent(strategy)}`;

  const call = await client.calls.create(params);
  return call.sid;
}

async function initiateJambonzCall(to: string, logId: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  // Call Jambonz API endpoint
  const response = await fetch(`${baseUrl}/api/jambonz/call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: to, logId })
  });

  if (!response.ok) {
    throw new Error('Failed to initiate Jambonz call');
  }

  const data = await response.json();
  return data.callSid;
}
