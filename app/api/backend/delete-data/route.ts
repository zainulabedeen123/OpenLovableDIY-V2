import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { deleteUserData } from '@/lib/multi-tenant-db';

/**
 * POST /api/backend/delete-data
 * Delete data from a user's table
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
    const { tableName, where } = body;

    // Validate input
    if (!tableName || typeof tableName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Table name is required' },
        { status: 400 }
      );
    }

    if (!where || typeof where !== 'string') {
      return NextResponse.json(
        { success: false, error: 'WHERE clause is required for deletes' },
        { status: 400 }
      );
    }

    // Delete data with user isolation
    const result = await deleteUserData(
      session.user.id,
      tableName,
      where
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Delete data error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete data'
      },
      { status: 500 }
    );
  }
}

