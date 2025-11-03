import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { listUserTables } from '@/lib/multi-tenant-db';

/**
 * GET /api/backend/list-tables
 * List all tables for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // List user's tables
    const result = await listUserTables(session.user.id);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] List tables error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list tables'
      },
      { status: 500 }
    );
  }
}

