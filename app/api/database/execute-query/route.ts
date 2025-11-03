import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/vercel-db';
import { auth } from '@/auth';

/**
 * POST /api/database/execute-query
 * Execute a SQL query on the Vercel Postgres database
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Security: Prevent dangerous operations in production
    const dangerousKeywords = ['DROP DATABASE', 'DROP SCHEMA'];
    const upperQuery = query.toUpperCase();
    
    for (const keyword of dangerousKeywords) {
      if (upperQuery.includes(keyword)) {
        return NextResponse.json(
          { success: false, error: `Operation not allowed: ${keyword}` },
          { status: 403 }
        );
      }
    }

    console.log('[execute-query] Executing SQL query for user:', session.user?.email);
    
    const result = await executeQuery(query);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[execute-query] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to execute query'
      },
      { status: 500 }
    );
  }
}

