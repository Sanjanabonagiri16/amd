import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Comprehensive seed endpoint with ALL strategies and edge cases
 * Tests: Twilio, Jambonz, Hugging Face, Gemini + errors, timeouts, edge cases
 */
export async function POST() {
  try {
    // Clear existing data first
    await prisma.callLog.deleteMany({});

    const now = Date.now();
    
    // Comprehensive test data covering ALL requirements
    const comprehensiveCalls = [
      // ========== TWILIO NATIVE AMD (5 calls) ==========
      {
        phone: '+15005550006', // Valid test number
        strategy: 'twilio_native',
        status: 'completed',
        callSid: 'CAtwilio_human_001',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.88,
          provider: 'twilio',
          callDuration: 12
        }),
        createdAt: new Date(now - 3600000),
        updatedAt: new Date(now - 3598000)
      },
      {
        phone: '+15005550008', // Voicemail test number
        strategy: 'twilio_native',
        status: 'completed',
        callSid: 'CAtwilio_machine_001',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.94,
          provider: 'twilio',
          callDuration: 8
        }),
        createdAt: new Date(now - 7200000),
        updatedAt: new Date(now - 7197000)
      },
      {
        phone: '+15005550001', // Invalid number
        strategy: 'twilio_native',
        status: 'error',
        callSid: 'CAtwilio_error_001',
        rawResult: JSON.stringify({
          error: 'Invalid phone number',
          errorCode: 21211
        }),
        createdAt: new Date(now - 10800000),
        updatedAt: new Date(now - 10798000)
      },
      {
        phone: '+15005550007', // Busy signal
        strategy: 'twilio_native',
        status: 'error',
        callSid: 'CAtwilio_busy_001',
        rawResult: JSON.stringify({
          error: 'Line busy',
          amdStatus: 'unknown'
        }),
        createdAt: new Date(now - 14400000),
        updatedAt: new Date(now - 14398000)
      },
      {
        phone: '+15005550009', // No answer
        strategy: 'twilio_native',
        status: 'error',
        callSid: 'CAtwilio_noanswer_001',
        rawResult: JSON.stringify({
          error: 'No answer',
          amdStatus: 'unknown'
        }),
        createdAt: new Date(now - 18000000),
        updatedAt: new Date(now - 17998000)
      },

      // ========== HUGGING FACE ML (5 calls) ==========
      {
        phone: '+14155552671',
        strategy: 'hf_service',
        status: 'completed',
        callSid: 'CAhf_human_001',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.93,
          model: 'wav2vec2-base-960h',
          transcription: 'Hello? Who is this?',
          detectedPatterns: []
        }),
        createdAt: new Date(now - 21600000),
        updatedAt: new Date(now - 21598800)
      },
      {
        phone: '+14155552672',
        strategy: 'hf_service',
        status: 'completed',
        callSid: 'CAhf_machine_001',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.96,
          model: 'wav2vec2-base-960h',
          transcription: 'Hi, you have reached the voicemail of John. Please leave a message after the beep.',
          detectedPatterns: ['leave a message', 'after the beep', 'voicemail']
        }),
        createdAt: new Date(now - 25200000),
        updatedAt: new Date(now - 25198800)
      },
      {
        phone: '+14155552673',
        strategy: 'hf_service',
        status: 'completed',
        callSid: 'CAhf_machine_002',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.91,
          model: 'wav2vec2-base-960h',
          transcription: 'The person you are calling is not available. Please record your message.',
          detectedPatterns: ['not available', 'record your message']
        }),
        createdAt: new Date(now - 28800000),
        updatedAt: new Date(now - 28798800)
      },
      {
        phone: '+14155552674',
        strategy: 'hf_service',
        status: 'error',
        callSid: 'CAhf_error_001',
        rawResult: JSON.stringify({
          error: 'Audio processing failed',
          details: 'No speech detected in recording'
        }),
        createdAt: new Date(now - 32400000),
        updatedAt: new Date(now - 32398000)
      },
      {
        phone: '+14155552675',
        strategy: 'hf_service',
        status: 'completed',
        callSid: 'CAhf_human_002',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.89,
          model: 'wav2vec2-base-960h',
          transcription: 'Yes, speaking. How can I help you?',
          detectedPatterns: []
        }),
        createdAt: new Date(now - 36000000),
        updatedAt: new Date(now - 35998800)
      },

      // ========== GEMINI FLASH (5 calls) ==========
      {
        phone: '+14155552681',
        strategy: 'gemini_flash',
        status: 'completed',
        callSid: 'CAgemini_human_001',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.97,
          model: 'gemini-1.5-flash',
          reasoning: 'Natural conversational tone with immediate interactive response. Speaker shows curiosity and engagement typical of human conversation.'
        }),
        createdAt: new Date(now - 39600000),
        updatedAt: new Date(now - 39599200)
      },
      {
        phone: '+14155552682',
        strategy: 'gemini_flash',
        status: 'completed',
        callSid: 'CAgemini_machine_001',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.98,
          model: 'gemini-1.5-flash',
          reasoning: 'Scripted greeting with clear voicemail indicators. Monotone delivery, mentions "leave a message" and "after the beep" which are classic voicemail patterns.'
        }),
        createdAt: new Date(now - 43200000),
        updatedAt: new Date(now - 43199200)
      },
      {
        phone: '+14155552683',
        strategy: 'gemini_flash',
        status: 'completed',
        callSid: 'CAgemini_machine_002',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.95,
          model: 'gemini-1.5-flash',
          reasoning: 'Automated system message with robotic tone. Contains phrases like "not available" and "please record" indicating answering machine.'
        }),
        createdAt: new Date(now - 46800000),
        updatedAt: new Date(now - 46799200)
      },
      {
        phone: '+14155552684',
        strategy: 'gemini_flash',
        status: 'error',
        callSid: 'CAgemini_error_001',
        rawResult: JSON.stringify({
          error: 'API timeout',
          details: 'Gemini API did not respond within 30 seconds'
        }),
        createdAt: new Date(now - 50400000),
        updatedAt: new Date(now - 50398000)
      },
      {
        phone: '+14155552685',
        strategy: 'gemini_flash',
        status: 'completed',
        callSid: 'CAgemini_human_002',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.94,
          model: 'gemini-1.5-flash',
          reasoning: 'Live person responding with natural speech patterns, pauses for thought, and contextual awareness of the conversation.'
        }),
        createdAt: new Date(now - 54000000),
        updatedAt: new Date(now - 53999200)
      },

      // ========== JAMBONZ SIP (5 calls) ==========
      {
        phone: '+14155552691',
        strategy: 'jambonz_sip',
        status: 'completed',
        callSid: 'CAjambonz_human_001',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.87,
          provider: 'jambonz',
          sipResponseCode: 200,
          detectionMethod: 'speech_analysis'
        }),
        createdAt: new Date(now - 57600000),
        updatedAt: new Date(now - 57598200)
      },
      {
        phone: '+14155552692',
        strategy: 'jambonz_sip',
        status: 'completed',
        callSid: 'CAjambonz_machine_001',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.85,
          provider: 'jambonz',
          sipResponseCode: 200,
          detectionMethod: 'tone_analysis'
        }),
        createdAt: new Date(now - 61200000),
        updatedAt: new Date(now - 61198200)
      },
      {
        phone: '+14155552693',
        strategy: 'jambonz_sip',
        status: 'completed',
        callSid: 'CAjambonz_machine_002',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.83,
          provider: 'jambonz',
          sipResponseCode: 200,
          detectionMethod: 'beep_detection'
        }),
        createdAt: new Date(now - 64800000),
        updatedAt: new Date(now - 64798200)
      },
      {
        phone: '+14155552694',
        strategy: 'jambonz_sip',
        status: 'error',
        callSid: 'CAjambonz_error_001',
        rawResult: JSON.stringify({
          error: 'SIP connection failed',
          sipResponseCode: 503,
          details: 'Service unavailable'
        }),
        createdAt: new Date(now - 68400000),
        updatedAt: new Date(now - 68398000)
      },
      {
        phone: '+14155552695',
        strategy: 'jambonz_sip',
        status: 'completed',
        callSid: 'CAjambonz_human_002',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.86,
          provider: 'jambonz',
          sipResponseCode: 200,
          detectionMethod: 'speech_analysis'
        }),
        createdAt: new Date(now - 72000000),
        updatedAt: new Date(now - 71998200)
      },

      // ========== EDGE CASES & SPECIAL SCENARIOS (5 calls) ==========
      {
        phone: '+15005550000', // Edge case: timeout
        strategy: 'twilio_native',
        status: 'error',
        callSid: 'CAedge_timeout_001',
        rawResult: JSON.stringify({
          error: 'Call timeout',
          details: 'No response after 30 seconds'
        }),
        createdAt: new Date(now - 75600000),
        updatedAt: new Date(now - 75570000) // 30 second timeout
      },
      {
        phone: '+14155552699', // Edge case: ambiguous result
        strategy: 'hf_service',
        status: 'completed',
        callSid: 'CAedge_ambiguous_001',
        rawResult: JSON.stringify({
          amdStatus: 'human',
          confidence: 0.52, // Low confidence
          model: 'wav2vec2-base-960h',
          transcription: 'Hello... [silence]... beep',
          detectedPatterns: ['beep'],
          note: 'Ambiguous - could be human or machine'
        }),
        createdAt: new Date(now - 79200000),
        updatedAt: new Date(now - 79198800)
      },
      {
        phone: '+14155552700', // Edge case: network error
        strategy: 'gemini_flash',
        status: 'error',
        callSid: 'CAedge_network_001',
        rawResult: JSON.stringify({
          error: 'Network error',
          details: 'Connection reset by peer',
          retryAttempts: 3
        }),
        createdAt: new Date(now - 82800000),
        updatedAt: new Date(now - 82798000)
      },
      {
        phone: '+14155552701', // Edge case: very short call
        strategy: 'jambonz_sip',
        status: 'completed',
        callSid: 'CAedge_short_001',
        rawResult: JSON.stringify({
          amdStatus: 'unknown',
          confidence: 0.45,
          provider: 'jambonz',
          sipResponseCode: 200,
          callDuration: 0.5,
          note: 'Call too short for reliable detection'
        }),
        createdAt: new Date(now - 86400000),
        updatedAt: new Date(now - 86399500) // 0.5 second call
      },
      {
        phone: '+14155552702', // Edge case: multiple languages
        strategy: 'hf_service',
        status: 'completed',
        callSid: 'CAedge_multilang_001',
        rawResult: JSON.stringify({
          amdStatus: 'machine',
          confidence: 0.78,
          model: 'wav2vec2-base-960h',
          transcription: 'Para español, oprima dos. For English, press one.',
          detectedPatterns: ['press'],
          note: 'IVR system detected'
        }),
        createdAt: new Date(now - 90000000),
        updatedAt: new Date(now - 89998800)
      }
    ];

    // Insert all test data
    await prisma.callLog.createMany({
      data: comprehensiveCalls
    });

    // Calculate statistics
    const stats = {
      total: comprehensiveCalls.length,
      byStrategy: {
        twilio_native: comprehensiveCalls.filter(c => c.strategy === 'twilio_native').length,
        hf_service: comprehensiveCalls.filter(c => c.strategy === 'hf_service').length,
        gemini_flash: comprehensiveCalls.filter(c => c.strategy === 'gemini_flash').length,
        jambonz_sip: comprehensiveCalls.filter(c => c.strategy === 'jambonz_sip').length
      },
      byStatus: {
        completed: comprehensiveCalls.filter(c => c.status === 'completed').length,
        error: comprehensiveCalls.filter(c => c.status === 'error').length
      },
      byResult: {
        human: comprehensiveCalls.filter(c => {
          try {
            const result = JSON.parse(c.rawResult);
            return result.amdStatus === 'human';
          } catch { return false; }
        }).length,
        machine: comprehensiveCalls.filter(c => {
          try {
            const result = JSON.parse(c.rawResult);
            return result.amdStatus === 'machine';
          } catch { return false; }
        }).length,
        error: comprehensiveCalls.filter(c => c.status === 'error').length
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Comprehensive test data created successfully',
      recordsCreated: comprehensiveCalls.length,
      statistics: stats,
      coverage: {
        allStrategiesTested: true,
        errorScenarios: true,
        edgeCases: true,
        testNumbers: [
          '+15005550006 (valid)',
          '+15005550008 (voicemail)',
          '+15005550001 (invalid)',
          '+15005550007 (busy)',
          '+15005550009 (no answer)'
        ]
      }
    });

  } catch (error: any) {
    console.error('Comprehensive seed error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed comprehensive data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
