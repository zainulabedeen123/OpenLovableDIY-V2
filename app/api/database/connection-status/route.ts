import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/vercel-db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

/**
 * GET /api/database/connection-status
 * Check if database connection is working
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[connection-status] Testing database connection for user:', session.user?.email);
    
    const result = await testConnection();

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[connection-status] Error:', error);
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: error instanceof Error ? error.message : 'Failed to test connection'
      },
      { status: 500 }
    );
  }
}

