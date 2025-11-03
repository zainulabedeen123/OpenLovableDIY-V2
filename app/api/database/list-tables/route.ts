import { NextRequest, NextResponse } from 'next/server';
import { listTables } from '@/lib/vercel-db';
import { auth } from '@/auth';

/**
 * GET /api/database/list-tables
 * List all tables in the Vercel Postgres database
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[list-tables] Fetching tables for user:', session.user?.email);
    
    const result = await listTables();

    return NextResponse.json(result);
  } catch (error) {
    console.error('[list-tables] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list tables'
      },
      { status: 500 }
    );
  }
}

