import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { audioUrl, callSid } = await req.json();
    
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    
    if (!apiKey) {
      console.warn('HUGGINGFACE_API_KEY not set, returning mock data');
      return NextResponse.json({
        amdStatus: Math.random() > 0.5 ? 'human' : 'machine',
        confidence: 0.85 + Math.random() * 0.1,
        model: 'mock',
        transcription: 'Mock transcription - API key not configured'
      });
    }

    // Download audio from Twilio
    let audioBuffer: ArrayBuffer;
    try {
      const audioResponse = await fetch(audioUrl);
      if (!audioResponse.ok) {
        throw new Error(`Failed to fetch audio: ${audioResponse.statusText}`);
      }
      audioBuffer = await audioResponse.arrayBuffer();
    } catch (error: any) {
      console.error('Error fetching audio:', error);
      return NextResponse.json({ error: 'Failed to fetch audio file' }, { status: 500 });
    }

    // Call Hugging Face Inference API
    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'audio/wav'
        },
        body: audioBuffer
      }
    );

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error('Hugging Face API error:', errorText);
      
      // If model is loading, return mock data
      if (hfResponse.status === 503) {
        return NextResponse.json({
          amdStatus: 'human',
          confidence: 0.75,
          model: 'wav2vec2-base-960h',
          transcription: 'Model loading, using fallback detection',
          note: 'Hugging Face model is loading, please try again in a few moments'
        });
      }
      
      return NextResponse.json({ error: 'Hugging Face API error' }, { status: hfResponse.status });
    }

    const result = await hfResponse.json();
    const transcription = result.text || '';

    // Analyze transcription for voicemail patterns
    const isVoicemail = detectVoicemailPatterns(transcription);
    const confidence = calculateConfidence(transcription, isVoicemail);

    return NextResponse.json({
      amdStatus: isVoicemail ? 'machine' : 'human',
      confidence,
      model: 'wav2vec2-base-960h',
      transcription,
      callSid
    });

  } catch (error: any) {
    console.error('Hugging Face prediction error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

function detectVoicemailPatterns(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  const voicemailPatterns = [
    /leave.*message/i,
    /after.*beep/i,
    /not available/i,
    /voicemail/i,
    /mailbox/i,
    /please.*record/i,
    /unable.*answer/i,
    /can't.*come.*phone/i,
    /press.*pound/i,
    /press.*#/i
  ];

  return voicemailPatterns.some(pattern => pattern.test(lowerText));
}

function calculateConfidence(text: string, isVoicemail: boolean): number {
  // Base confidence
  let confidence = 0.7;

  // Increase confidence if text is substantial
  if (text.length > 50) confidence += 0.1;
  if (text.length > 100) confidence += 0.05;

  // Increase confidence if multiple patterns match
  const lowerText = text.toLowerCase();
  const matchCount = [
    /leave.*message/i,
    /after.*beep/i,
    /voicemail/i,
    /mailbox/i
  ].filter(pattern => pattern.test(lowerText)).length;

  confidence += matchCount * 0.05;

  // Cap at 0.95
  return Math.min(confidence, 0.95);
}
