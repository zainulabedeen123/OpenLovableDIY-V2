import { NextRequest, NextResponse } from 'next/server';
import { createTable } from '@/lib/vercel-db';
import { auth } from '@/auth';

/**
 * POST /api/database/create-table
 * Create a new table in the Vercel Postgres database
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

    const { tableName, columns } = await request.json();

    if (!tableName || typeof tableName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Table name is required' },
        { status: 400 }
      );
    }

    if (!columns || !Array.isArray(columns) || columns.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Columns array is required' },
        { status: 400 }
      );
    }

    // Validate column structure
    for (const col of columns) {
      if (!col.name || !col.type) {
        return NextResponse.json(
          { success: false, error: 'Each column must have name and type' },
          { status: 400 }
        );
      }
    }

    console.log('[create-table] Creating table:', tableName, 'for user:', session.user?.email);
    
    const result = await createTable(tableName, columns);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[create-table] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create table'
      },
      { status: 500 }
    );
  }
}

