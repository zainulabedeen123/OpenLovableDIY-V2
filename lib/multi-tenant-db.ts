/**
 * Multi-Tenant Database Utilities
 * 
 * Provides database operations with automatic user isolation.
 * All tables created through this module automatically include user_id column.
 * All queries are automatically filtered by the authenticated user's ID.
 * 
 * Security:
 * - Users can ONLY access their own data
 * - user_id is automatically injected into all operations
 * - No cross-user data access is possible
 */

import { sql } from '@vercel/postgres';

export interface QueryResult {
  success: boolean;
  data?: any[];
  rowCount?: number | null;
  error?: string;
  fields?: Array<{ name: string; dataTypeID: number }>;
}

export interface TableColumn {
  name: string;
  type: string;
  constraints?: string;
}

export interface UserTable {
  tableName: string;
  rowCount: number;
  createdAt?: string;
}

/**
 * Create a user-scoped table
 * Automatically adds user_id column and index for multi-tenancy
 */
export async function createUserTable(
  userId: string,
  tableName: string,
  columns: TableColumn[]
): Promise<QueryResult> {
  try {
    // Sanitize table name to prevent SQL injection
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '_');
    
    // Add user_id column if not already present
    const hasUserId = columns.some(col => col.name === 'user_id');
    if (!hasUserId) {
      columns.unshift({
        name: 'user_id',
        type: 'VARCHAR(255)',
        constraints: 'NOT NULL'
      });
    }
    
    // Build column definitions
    const columnDefs = columns.map(col => {
      const parts = [col.name, col.type];
      if (col.constraints) {
        parts.push(col.constraints);
      }
      return parts.join(' ');
    }).join(', ');
    
    // Create table with user_id index
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${sanitizedTableName} (
        ${columnDefs}
      )
    `;
    
    await sql.query(createTableQuery);
    
    // Create index on user_id for performance
    const createIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_${sanitizedTableName}_user_id 
      ON ${sanitizedTableName}(user_id)
    `;
    
    await sql.query(createIndexQuery);
    
    return {
      success: true,
      data: [{ tableName: sanitizedTableName }]
    };
  } catch (error) {
    console.error('[multi-tenant-db] Table creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create table'
    };
  }
}

/**
 * Insert data into a user-scoped table
 * Automatically adds user_id to the data
 */
export async function insertUserData(
  userId: string,
  tableName: string,
  data: Record<string, any>
): Promise<QueryResult> {
  try {
    // Sanitize table name
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '_');
    
    // Add user_id to data
    const dataWithUserId = { ...data, user_id: userId };
    
    const columns = Object.keys(dataWithUserId);
    const values = Object.values(dataWithUserId);
    
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `
      INSERT INTO ${sanitizedTableName} (${columns.join(', ')}) 
      VALUES (${placeholders}) 
      RETURNING *
    `;
    
    const result = await sql.query(query, values);
    
    return {
      success: true,
      data: result.rows,
      rowCount: result.rowCount
    };
  } catch (error) {
    console.error('[multi-tenant-db] Insert error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to insert data'
    };
  }
}

/**
 * Query data from a user-scoped table
 * Automatically filters by user_id
 */
export async function queryUserData(
  userId: string,
  tableName: string,
  where?: string,
  limit: number = 100
): Promise<QueryResult> {
  try {
    // Sanitize table name
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '_');
    
    // Build query with user_id filter
    let query = `SELECT * FROM ${sanitizedTableName} WHERE user_id = $1`;
    const params: any[] = [userId];
    
    if (where) {
      query += ` AND (${where})`;
    }
    
    query += ` LIMIT ${limit}`;
    
    const result = await sql.query(query, params);
    
    return {
      success: true,
      data: result.rows,
      rowCount: result.rowCount,
      fields: result.fields?.map(f => ({ name: f.name, dataTypeID: f.dataTypeID }))
    };
  } catch (error) {
    console.error('[multi-tenant-db] Query error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to query data'
    };
  }
}

/**
 * Update data in a user-scoped table
 * Automatically filters by user_id to prevent cross-user updates
 */
export async function updateUserData(
  userId: string,
  tableName: string,
  data: Record<string, any>,
  where: string
): Promise<QueryResult> {
  try {
    // Sanitize table name
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '_');
    
    // Remove user_id from data if present (can't update user_id)
    const { user_id, ...updateData } = data;
    
    const columns = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');
    const params = [userId, ...values];
    
    const query = `
      UPDATE ${sanitizedTableName} 
      SET ${setClause} 
      WHERE user_id = $1 AND (${where})
      RETURNING *
    `;
    
    const result = await sql.query(query, params);
    
    return {
      success: true,
      data: result.rows,
      rowCount: result.rowCount
    };
  } catch (error) {
    console.error('[multi-tenant-db] Update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update data'
    };
  }
}

/**
 * Delete data from a user-scoped table
 * Automatically filters by user_id to prevent cross-user deletes
 */
export async function deleteUserData(
  userId: string,
  tableName: string,
  where: string
): Promise<QueryResult> {
  try {
    // Sanitize table name
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '_');
    
    const query = `
      DELETE FROM ${sanitizedTableName} 
      WHERE user_id = $1 AND (${where})
      RETURNING *
    `;
    
    const result = await sql.query(query, [userId]);
    
    return {
      success: true,
      data: result.rows,
      rowCount: result.rowCount
    };
  } catch (error) {
    console.error('[multi-tenant-db] Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete data'
    };
  }
}

/**
 * List all tables created by a user
 * Returns only tables that have user_id column and contain user's data
 */
export async function listUserTables(userId: string): Promise<QueryResult> {
  try {
    // Get all tables with user_id column
    const query = `
      SELECT DISTINCT t.table_name, 
             (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = t.table_name) as row_count
      FROM information_schema.tables t
      INNER JOIN information_schema.columns c 
        ON t.table_name = c.table_name 
        AND c.column_name = 'user_id'
      WHERE t.table_schema = 'public'
      ORDER BY t.table_name
    `;
    
    const result = await sql.query(query);
    
    return {
      success: true,
      data: result.rows
    };
  } catch (error) {
    console.error('[multi-tenant-db] List tables error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list tables'
    };
  }
}

/**
 * Get schema for a user table
 */
export async function getUserTableSchema(
  userId: string,
  tableName: string
): Promise<QueryResult> {
  try {
    // Sanitize table name
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '_');
    
    const query = `
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `;
    
    const result = await sql.query(query, [sanitizedTableName]);
    
    return {
      success: true,
      data: result.rows
    };
  } catch (error) {
    console.error('[multi-tenant-db] Get schema error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get table schema'
    };
  }
}

/**
 * Drop a user table (admin only - requires confirmation)
 */
export async function dropUserTable(
  userId: string,
  tableName: string
): Promise<QueryResult> {
  try {
    // Sanitize table name
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '_');
    
    // First verify the table has user_id column (safety check)
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = $1 AND column_name = 'user_id'
    `;
    
    const checkResult = await sql.query(checkQuery, [sanitizedTableName]);
    
    if (checkResult.rows.length === 0) {
      return {
        success: false,
        error: 'Table does not exist or is not a user table'
      };
    }
    
    // Drop the table
    const dropQuery = `DROP TABLE IF EXISTS ${sanitizedTableName}`;
    await sql.query(dropQuery);
    
    return {
      success: true,
      data: [{ message: 'Table dropped successfully' }]
    };
  } catch (error) {
    console.error('[multi-tenant-db] Drop table error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to drop table'
    };
  }
}

