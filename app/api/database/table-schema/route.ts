import { NextRequest, NextResponse } from 'next/server';
import { getTableSchema } from '@/lib/vercel-db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

/**
 * GET /api/database/table-schema?tableName=xxx
 * Get schema information for a specific table
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

    const { searchParams } = new URL(request.url);
    const tableName = searchParams.get('tableName');

    if (!tableName) {
      return NextResponse.json(
        { success: false, error: 'tableName parameter is required' },
        { status: 400 }
      );
    }

    console.log('[table-schema] Fetching schema for table:', tableName);
    
    const result = await getTableSchema(tableName);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[table-schema] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get table schema'
      },
      { status: 500 }
    );
  }
}

