import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Seed endpoint to populate call history with sample data
 * Useful for demo and testing purposes
 */
export async function POST() {
  try {
    // Check if data already exists
    const existingCount = await prisma.callLog.count();
    
    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database already has data. Clear it first or use force=true',
        existingRecords: existingCount
      }, { status: 400 });
    }

    // Sample call data with realistic scenarios
    const sampleCalls = [
      // Twilio Native AMD calls
      {
        phone: '+14155552671',
        strategy: 'twilio_native',
        status: 'completed',
        callSid: 'CA_twilio_demo_001',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.88,
          provider: 'twilio',
          callSid: 'CA_twilio_demo_001'
        }),
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        updatedAt: new Date(Date.now() - 3598000)  // 2 seconds later
      },
      {
        phone: '+14155552672',
        strategy: 'twilio_native',
        status: 'completed',
        callSid: 'CA_twilio_demo_002',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.92,
          provider: 'twilio',
          callSid: 'CA_twilio_demo_002'
        }),
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7197000)
      },
      {
        phone: '+14155552673',
        strategy: 'twilio_native',
        status: 'completed',
        callSid: 'CA_twilio_demo_003',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.85,
          provider: 'twilio',
          callSid: 'CA_twilio_demo_003'
        }),
        createdAt: new Date(Date.now() - 10800000),
        updatedAt: new Date(Date.now() - 10797000)
      },

      // Hugging Face ML calls
      {
        phone: '+14155552674',
        strategy: 'hf_service',
        status: 'completed',
        callSid: 'CA_hf_demo_001',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.94,
          model: 'wav2vec2-base-960h',
          transcription: 'Hi, you have reached the voicemail of...',
          callSid: 'CA_hf_demo_001'
        }),
        createdAt: new Date(Date.now() - 14400000),
        updatedAt: new Date(Date.now() - 14398800)
      },
      {
        phone: '+14155552675',
        strategy: 'hf_service',
        status: 'completed',
        callSid: 'CA_hf_demo_002',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.91,
          model: 'wav2vec2-base-960h',
          transcription: 'Hello? Who is this?',
          callSid: 'CA_hf_demo_002'
        }),
        createdAt: new Date(Date.now() - 18000000),
        updatedAt: new Date(Date.now() - 17998800)
      },
      {
        phone: '+14155552676',
        strategy: 'hf_service',
        status: 'completed',
        callSid: 'CA_hf_demo_003',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.96,
          model: 'wav2vec2-base-960h',
          transcription: 'Please leave a message after the beep',
          callSid: 'CA_hf_demo_003'
        }),
        createdAt: new Date(Date.now() - 21600000),
        updatedAt: new Date(Date.now() - 21598800)
      },

      // Gemini Flash calls
      {
        phone: '+14155552677',
        strategy: 'gemini_flash',
        status: 'completed',
        callSid: 'CA_gemini_demo_001',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.95,
          model: 'gemini-1.5-flash',
          reasoning: 'Natural conversational tone with immediate response',
          callSid: 'CA_gemini_demo_001'
        }),
        createdAt: new Date(Date.now() - 25200000),
        updatedAt: new Date(Date.now() - 25199200)
      },
      {
        phone: '+14155552678',
        strategy: 'gemini_flash',
        status: 'completed',
        callSid: 'CA_gemini_demo_002',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.97,
          model: 'gemini-1.5-flash',
          reasoning: 'Scripted greeting with voicemail keywords detected',
          callSid: 'CA_gemini_demo_002'
        }),
        createdAt: new Date(Date.now() - 28800000),
        updatedAt: new Date(Date.now() - 28799200)
      },

      // Jambonz SIP calls
      {
        phone: '+14155552679',
        strategy: 'jambonz_sip',
        status: 'completed',
        callSid: 'CA_jambonz_demo_001',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.86,
          provider: 'jambonz',
          callSid: 'CA_jambonz_demo_001'
        }),
        createdAt: new Date(Date.now() - 32400000),
        updatedAt: new Date(Date.now() - 32398200)
      },
      {
        phone: '+14155552680',
        strategy: 'jambonz_sip',
        status: 'completed',
        callSid: 'CA_jambonz_demo_002',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.84,
          provider: 'jambonz',
          callSid: 'CA_jambonz_demo_002'
        }),
        createdAt: new Date(Date.now() - 36000000),
        updatedAt: new Date(Date.now() - 35998200)
      },

      // Some error cases
      {
        phone: '+14155552681',
        strategy: 'twilio_native',
        status: 'error',
        callSid: 'CA_error_demo_001',
        rawResult: JSON.stringify({
          error: 'Call failed - busy signal',
          callSid: 'CA_error_demo_001'
        }),
        createdAt: new Date(Date.now() - 39600000),
        updatedAt: new Date(Date.now() - 39598000)
      },
      {
        phone: '+14155552682',
        strategy: 'hf_service',
        status: 'error',
        callSid: 'CA_error_demo_002',
        rawResult: JSON.stringify({
          error: 'No audio detected',
          callSid: 'CA_error_demo_002'
        }),
        createdAt: new Date(Date.now() - 43200000),
        updatedAt: new Date(Date.now() - 43198000)
      },

      // Recent calls (last 30 minutes)
      {
        phone: '+14155552683',
        strategy: 'twilio_native',
        status: 'completed',
        callSid: 'CA_recent_001',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.89,
          provider: 'twilio',
          callSid: 'CA_recent_001'
        }),
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(Date.now() - 1798000)
      },
      {
        phone: '+14155552684',
        strategy: 'gemini_flash',
        status: 'completed',
        callSid: 'CA_recent_002',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.93,
          model: 'gemini-1.5-flash',
          reasoning: 'Voicemail greeting pattern detected',
          callSid: 'CA_recent_002'
        }),
        createdAt: new Date(Date.now() - 900000),
        updatedAt: new Date(Date.now() - 899200)
      },
      {
        phone: '+14155552685',
        strategy: 'hf_service',
        status: 'completed',
        callSid: 'CA_recent_003',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.90,
          model: 'wav2vec2-base-960h',
          transcription: 'Yes, hello?',
          callSid: 'CA_recent_003'
        }),
        createdAt: new Date(Date.now() - 300000),
        updatedAt: new Date(Date.now() - 298800)
      }
    ];

    // Insert sample data
    await prisma.callLog.createMany({
      data: sampleCalls
    });

    return NextResponse.json({
      success: true,
      message: 'Sample call history data created successfully',
      recordsCreated: sampleCalls.length,
      breakdown: {
        twilio_native: sampleCalls.filter(c => c.strategy === 'twilio_native').length,
        hf_service: sampleCalls.filter(c => c.strategy === 'hf_service').length,
        gemini_flash: sampleCalls.filter(c => c.strategy === 'gemini_flash').length,
        jambonz_sip: sampleCalls.filter(c => c.strategy === 'jambonz_sip').length,
        completed: sampleCalls.filter(c => c.status === 'completed').length,
        errors: sampleCalls.filter(c => c.status === 'error').length
      }
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Optional: DELETE endpoint to clear data
export async function DELETE() {
  try {
    const deleted = await prisma.callLog.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: 'All call history data cleared',
      recordsDeleted: deleted.count
    });
  } catch (error: any) {
    console.error('Clear error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
