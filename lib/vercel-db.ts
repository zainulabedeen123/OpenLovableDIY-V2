/**
 * Vercel Postgres Database Management Utilities
 * Handles database creation, connection, and SQL execution
 */

import { sql } from '@vercel/postgres';

export interface DatabaseInfo {
  id: string;
  name: string;
  region: string;
  createdAt: string;
  connectionString?: string;
}

export interface QueryResult {
  success: boolean;
  data?: any[];
  rowCount?: number;
  error?: string;
  fields?: Array<{ name: string; dataTypeID: number }>;
}

/**
 * Execute a SQL query on the connected Vercel Postgres database
 */
export async function executeQuery(query: string): Promise<QueryResult> {
  try {
    console.log('[vercel-db] Executing query:', query.substring(0, 100) + '...');
    
    const result = await sql.query(query);
    
    return {
      success: true,
      data: result.rows,
      rowCount: result.rowCount,
      fields: result.fields?.map(f => ({ name: f.name, dataTypeID: f.dataTypeID }))
    };
  } catch (error) {
    console.error('[vercel-db] Query execution error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Create a new table in the database
 */
export async function createTable(tableName: string, columns: Array<{ name: string; type: string; constraints?: string }>): Promise<QueryResult> {
  try {
    const columnDefs = columns.map(col => {
      const parts = [col.name, col.type];
      if (col.constraints) {
        parts.push(col.constraints);
      }
      return parts.join(' ');
    }).join(', ');
    
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs})`;
    
    return await executeQuery(query);
  } catch (error) {
    console.error('[vercel-db] Table creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create table'
    };
  }
}

/**
 * List all tables in the database
 */
export async function listTables(): Promise<QueryResult> {
  const query = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;
  
  return await executeQuery(query);
}

/**
 * Get table schema information
 */
export async function getTableSchema(tableName: string): Promise<QueryResult> {
  const query = `
    SELECT 
      column_name,
      data_type,
      character_maximum_length,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_name = '${tableName}'
    ORDER BY ordinal_position
  `;
  
  return await executeQuery(query);
}

/**
 * Insert data into a table
 */
export async function insertData(tableName: string, data: Record<string, any>): Promise<QueryResult> {
  try {
    const columns = Object.keys(data);
    const values = Object.values(data);
    
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    
    const result = await sql.query(query, values);
    
    return {
      success: true,
      data: result.rows,
      rowCount: result.rowCount
    };
  } catch (error) {
    console.error('[vercel-db] Insert error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to insert data'
    };
  }
}

/**
 * Query data from a table
 */
export async function queryTable(tableName: string, where?: string, limit: number = 100): Promise<QueryResult> {
  let query = `SELECT * FROM ${tableName}`;
  
  if (where) {
    query += ` WHERE ${where}`;
  }
  
  query += ` LIMIT ${limit}`;
  
  return await executeQuery(query);
}

/**
 * Drop a table
 */
export async function dropTable(tableName: string): Promise<QueryResult> {
  const query = `DROP TABLE IF EXISTS ${tableName}`;
  return await executeQuery(query);
}

/**
 * Check if database connection is working
 */
export async function testConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    await sql.query('SELECT 1');
    return { connected: true };
  } catch (error) {
    console.error('[vercel-db] Connection test failed:', error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Connection failed'
    };
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<QueryResult> {
  const query = `
    SELECT 
      schemaname,
      tablename,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
      pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY size_bytes DESC
  `;
  
  return await executeQuery(query);
}

