'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Table {
  table_name: string;
  row_count: number;
}

interface Column {
  name: string;
  type: string;
  constraints?: string;
}

export default function BackendBuilder() {
  const [activeTab, setActiveTab] = useState<'tables' | 'create' | 'data'>('tables');
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  
  // Create table state
  const [newTableName, setNewTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([
    { name: 'id', type: 'SERIAL', constraints: 'PRIMARY KEY' }
  ]);
  
  // Data management state
  const [tableData, setTableData] = useState<any[]>([]);
  const [insertData, setInsertData] = useState<Record<string, string>>({});

  // Load tables on mount
  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/backend/list-tables');
      const result = await response.json();
      
      if (result.success) {
        setTables(result.data || []);
      } else {
        toast.error(result.error || 'Failed to load tables');
      }
    } catch (error) {
      toast.error('Failed to load tables');
      console.error(error);
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
      const response = await fetch('/api/backend/create-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName: newTableName,
          columns: columns
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Table created successfully!');
        setNewTableName('');
        setColumns([{ name: 'id', type: 'SERIAL', constraints: 'PRIMARY KEY' }]);
        loadTables();
        setActiveTab('tables');
      } else {
        toast.error(result.error || 'Failed to create table');
      }
    } catch (error) {
      toast.error('Failed to create table');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'TEXT', constraints: '' }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: keyof Column, value: string) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], [field]: value };
    setColumns(updated);
  };

  const loadTableData = async (tableName: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/backend/query-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName, limit: 100 })
      });

      const result = await response.json();

      if (result.success) {
        setTableData(result.data || []);
        setSelectedTable(tableName);
        setActiveTab('data');
      } else {
        toast.error(result.error || 'Failed to load data');
      }
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInsertData = async () => {
    if (!selectedTable) {
      toast.error('Please select a table');
      return;
    }

    if (Object.keys(insertData).length === 0) {
      toast.error('Please enter some data');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/backend/insert-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName: selectedTable,
          data: insertData
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Data inserted successfully!');
        setInsertData({});
        loadTableData(selectedTable);
      } else {
        toast.error(result.error || 'Failed to insert data');
      }
    } catch (error) {
      toast.error('Failed to insert data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Backend Builder</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Build your database backend with automatic user isolation
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4 px-4">
          <button
            onClick={() => setActiveTab('tables')}
            className={`py-3 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'tables'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            My Tables
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`py-3 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Create Table
          </button>
          {selectedTable && (
            <button
              onClick={() => setActiveTab('data')}
              className={`py-3 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'data'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Data: {selectedTable}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Tables</h3>
              <button
                onClick={loadTables}
                disabled={loading}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {tables.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No tables yet. Create your first table to get started!</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {tables.map((table) => (
                  <div
                    key={table.table_name}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 cursor-pointer"
                    onClick={() => loadTableData(table.table_name)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{table.table_name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {table.row_count} row{table.row_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <button className="text-blue-500 hover:text-blue-600 text-sm">
                        View Data →
                      </button>
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Table</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Table Name
                </label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="e.g., users, posts, products"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Columns
                  </label>
                  <button
                    onClick={addColumn}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    + Add Column
                  </button>
                </div>

                <div className="space-y-2">
                  {columns.map((col, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={col.name}
                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                        placeholder="Column name"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      />
                      <select
                        value={col.type}
                        onChange={(e) => updateColumn(index, 'type', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
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
                        value={col.constraints || ''}
                        onChange={(e) => updateColumn(index, 'constraints', e.target.value)}
                        placeholder="Constraints (optional)"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      />
                      {index > 0 && (
                        <button
                          onClick={() => removeColumn(index)}
                          className="px-3 py-2 text-red-500 hover:text-red-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateTable}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Table'}
              </button>
            </div>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && selectedTable && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Data in {selectedTable}
            </h3>

            {tableData.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No data in this table yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {Object.keys(tableData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {tableData.map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((value: any, j) => (
                          <td key={j} className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Insert New Data
              </h4>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Enter data as JSON: {`{ "column": "value", "column2": "value2" }`}
              </div>
              <textarea
                value={JSON.stringify(insertData, null, 2)}
                onChange={(e) => {
                  try {
                    setInsertData(JSON.parse(e.target.value));
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                placeholder='{ "name": "John", "email": "john@example.com" }'
              />
              <button
                onClick={handleInsertData}
                disabled={loading}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Inserting...' : 'Insert Data'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

