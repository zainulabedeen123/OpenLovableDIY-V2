'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Table {
  table_name: string;
}

interface Column {
  name: string;
  type: string;
  constraints?: string;
}

export default function DatabaseManager() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'tables' | 'query' | 'create'>('tables');
  
  // Create Table State
  const [newTableName, setNewTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([
    { name: 'id', type: 'SERIAL', constraints: 'PRIMARY KEY' }
  ]);
  
  // Query State
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);

  // Check connection status on mount
  useEffect(() => {
    checkConnection();
    fetchTables();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/database/connection-status');
      const data = await response.json();
      setIsConnected(data.connected);
      
      if (!data.connected) {
        toast.error('Database not connected. Please configure POSTGRES_URL in your environment variables.');
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsConnected(false);
    }
  };

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/database/list-tables');
      const data = await response.json();
      
      if (data.success && data.data) {
        setTables(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tables:', error);
      toast.error('Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = async () => {
    if (!newTableName.trim()) {
      toast.error('Please enter a table name');
      return;
    }

    if (columns.length === 0) {
      toast.error('Please add at least one column');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/database/create-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName: newTableName,
          columns: columns
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Table "${newTableName}" created successfully!`);
        setNewTableName('');
        setColumns([{ name: 'id', type: 'SERIAL', constraints: 'PRIMARY KEY' }]);
        fetchTables();
        setActiveTab('tables');
      } else {
        toast.error(data.error || 'Failed to create table');
      }
    } catch (error) {
      console.error('Failed to create table:', error);
      toast.error('Failed to create table');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) {
      toast.error('Please enter a SQL query');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/database/execute-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery })
      });

      const data = await response.json();

      if (data.success) {
        setQueryResult(data);
        toast.success('Query executed successfully!');
      } else {
        toast.error(data.error || 'Query execution failed');
        setQueryResult({ success: false, error: data.error });
      }
    } catch (error) {
      console.error('Failed to execute query:', error);
      toast.error('Failed to execute query');
    } finally {
      setLoading(false);
    }
  };

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'TEXT', constraints: '' }]);
  };

  const updateColumn = (index: number, field: keyof Column, value: string) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setColumns(newColumns);
  };

  const removeColumn = (index: number) => {
    if (columns.length > 1) {
      setColumns(columns.filter((_, i) => i !== index));
    }
  };

  if (isConnected === false) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Database Not Connected</h3>
          <p className="text-gray-300 mb-4">
            Please configure your Vercel Postgres database connection.
          </p>
          <div className="bg-gray-800/50 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-300 mb-2">Add to your .env.local:</p>
            <code className="text-xs text-green-400">
              POSTGRES_URL="your-vercel-postgres-connection-string"
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🗄️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Database Manager</h2>
            <p className="text-green-100 text-sm">Powered by Vercel Postgres</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-white/5">
        <button
          onClick={() => setActiveTab('tables')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'tables'
              ? 'text-white border-b-2 border-green-500 bg-white/10'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📋 Tables ({tables.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'create'
              ? 'text-white border-b-2 border-green-500 bg-white/10'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ➕ Create Table
        </button>
        <button
          onClick={() => setActiveTab('query')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'query'
              ? 'text-white border-b-2 border-green-500 bg-white/10'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ⚡ Run Query
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Your Tables</h3>
              <button
                onClick={fetchTables}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm transition-colors disabled:opacity-50"
              >
                {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
              </button>
            </div>
            
            {tables.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📭</span>
                <p className="text-gray-300">No tables yet. Create your first table!</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {tables.map((table) => (
                  <div
                    key={table.table_name}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📊</span>
                        <span className="text-white font-medium">{table.table_name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Table Tab */}
        {activeTab === 'create' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Create New Table</h3>

            {/* Table Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Table Name
              </label>
              <input
                type="text"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="e.g., users, products, posts"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Columns */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  Columns
                </label>
                <button
                  onClick={addColumn}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm transition-colors"
                >
                  + Add Column
                </button>
              </div>

              <div className="space-y-3">
                {columns.map((column, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={column.name}
                      onChange={(e) => updateColumn(index, 'name', e.target.value)}
                      placeholder="Column name"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <select
                      value={column.type}
                      onChange={(e) => updateColumn(index, 'type', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="TEXT">TEXT</option>
                      <option value="INTEGER">INTEGER</option>
                      <option value="SERIAL">SERIAL</option>
                      <option value="BOOLEAN">BOOLEAN</option>
                      <option value="TIMESTAMP">TIMESTAMP</option>
                      <option value="VARCHAR(255)">VARCHAR(255)</option>
                      <option value="JSONB">JSONB</option>
                    </select>
                    <input
                      type="text"
                      value={column.constraints || ''}
                      onChange={(e) => updateColumn(index, 'constraints', e.target.value)}
                      placeholder="Constraints (optional)"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {columns.length > 1 && (
                      <button
                        onClick={() => removeColumn(index)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white transition-colors"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateTable}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-lg text-white font-medium transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : '✨ Create Table'}
            </button>
          </div>
        )}

        {/* Query Tab */}
        {activeTab === 'query' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Execute SQL Query</h3>

            {/* SQL Editor */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SQL Query
              </label>
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="SELECT * FROM users LIMIT 10;"
                rows={8}
                className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
              />
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecuteQuery}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-lg text-white font-medium transition-all disabled:opacity-50 mb-6"
            >
              {loading ? 'Executing...' : '⚡ Execute Query'}
            </button>

            {/* Query Result */}
            {queryResult && (
              <div className="bg-gray-900/50 border border-white/10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Result:</h4>
                {queryResult.success ? (
                  <div>
                    <p className="text-green-400 text-sm mb-2">
                      ✅ Query executed successfully! ({queryResult.rowCount} rows)
                    </p>
                    {queryResult.data && queryResult.data.length > 0 && (
                      <div className="overflow-x-auto">
                        <pre className="text-xs text-gray-300 bg-black/30 p-3 rounded overflow-auto max-h-96">
                          {JSON.stringify(queryResult.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-red-400 text-sm">
                    ❌ Error: {queryResult.error}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

