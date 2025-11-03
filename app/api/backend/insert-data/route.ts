import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { insertUserData } from '@/lib/multi-tenant-db';

/**
 * POST /api/backend/insert-data
 * Insert data into a user's table
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
    const { tableName, data } = body;

    // Validate input
    if (!tableName || typeof tableName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Table name is required' },
        { status: 400 }
      );
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Data object is required' },
        { status: 400 }
      );
    }

    // Insert data with user isolation
    const result = await insertUserData(
      session.user.id,
      tableName,
      data
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Insert data error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to insert data'
      },
      { status: 500 }
    );
  }
}

