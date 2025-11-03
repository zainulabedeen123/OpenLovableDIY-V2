import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { queryUserData } from '@/lib/multi-tenant-db';

/**
 * POST /api/backend/query-data
 * Query data from a user's table
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tableName, where, limit } = body;

    // Validate input
    if (!tableName || typeof tableName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Table name is required' },
        { status: 400 }
      );
    }

    // Query data with user isolation
    const result = await queryUserData(
      session.user.id,
      tableName,
      where,
      limit || 100
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Query data error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to query data'
      },
      { status: 500 }
    );
  }
}

