import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Clear all call history from database
 * DELETE /api/calls/clear
 */
export async function DELETE() {
  try {
    const result = await prisma.callLog.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: 'All call history cleared',
      recordsDeleted: result.count
    });
  } catch (error: any) {
    console.error('Clear calls error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear calls',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
