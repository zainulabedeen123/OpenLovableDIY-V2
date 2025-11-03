import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateUserData } from '@/lib/multi-tenant-db';

/**
 * POST /api/backend/update-data
 * Update data in a user's table
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
    const { tableName, data, where } = body;

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

    if (!where || typeof where !== 'string') {
      return NextResponse.json(
        { success: false, error: 'WHERE clause is required for updates' },
        { status: 400 }
      );
    }

    // Update data with user isolation
    const result = await updateUserData(
      session.user.id,
      tableName,
      data,
      where
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Update data error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update data'
      },
      { status: 500 }
    );
  }
}

