import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createUserTable, TableColumn } from '@/lib/multi-tenant-db';

/**
 * POST /api/backend/create-table
 * Create a new table for the authenticated user's backend
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
    const { tableName, columns } = body;

    // Validate input
    if (!tableName || typeof tableName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Table name is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(columns) || columns.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Columns array is required' },
        { status: 400 }
      );
    }

    // Validate columns
    for (const col of columns) {
      if (!col.name || !col.type) {
        return NextResponse.json(
          { success: false, error: 'Each column must have name and type' },
          { status: 400 }
        );
      }
    }

    // Create the table with user isolation
    const result = await createUserTable(
      session.user.id,
      tableName,
      columns as TableColumn[]
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Create table error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create table'
      },
      { status: 500 }
    );
  }
}

