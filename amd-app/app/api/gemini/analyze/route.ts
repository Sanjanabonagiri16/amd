import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { audioUrl, callSid } = await req.json();
    
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.warn('GOOGLE_API_KEY not set, returning mock data');
      return NextResponse.json({
        amdStatus: Math.random() > 0.5 ? 'human' : 'machine',
        confidence: 0.90 + Math.random() * 0.08,
        model: 'mock',
        reasoning: 'Mock analysis - API key not configured'
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

    // Convert to base64
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    // Call Google Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: 'audio/wav',
                  data: base64Audio
                }
              },
              {
                text: `Analyze this phone call audio and determine if it's a human speaking or an answering machine/voicemail greeting.

Consider these factors:
- Voicemail greetings typically have phrases like "leave a message", "after the beep", "not available", "mailbox"
- Humans have natural conversation patterns, pauses, and responses
- Voicemails are often scripted and monotone

Respond ONLY with valid JSON in this exact format:
{
  "type": "human" or "machine",
  "confidence": 0.0 to 1.0,
  "reasoning": "brief explanation of your decision"
}`
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return NextResponse.json({ 
        error: 'Gemini API error',
        details: errorText 
      }, { status: geminiResponse.status });
    }

    const result = await geminiResponse.json();
    
    // Extract text from Gemini response
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Parse JSON from response
    let analysis;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       responseText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseText);
      // Fallback: try to extract type from text
      const isHuman = /human/i.test(responseText) && !/machine/i.test(responseText);
      analysis = {
        type: isHuman ? 'human' : 'machine',
        confidence: 0.7,
        reasoning: 'Parsed from unstructured response'
      };
    }

    return NextResponse.json({
      amdStatus: analysis.type,
      confidence: analysis.confidence,
      model: 'gemini-1.5-flash',
      reasoning: analysis.reasoning,
      callSid
    });

  } catch (error: any) {
    console.error('Gemini analysis error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
