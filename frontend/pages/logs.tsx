/**
 * Logs Page
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useAppStore } from '@/lib/store';
import { logsApi } from '@/lib/api';
import LogStream from '@/components/LogStream';

export default function LogsPage() {
  const { logs, setLogs } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logList = await logsApi.list({
          level: filter || undefined,
          limit: 100,
        });
        setLogs(logList);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [filter, setLogs]);

  const logLevels = ['', 'debug', 'info', 'warning', 'error', 'critical'];

  return (
    <>
      <Head>
        <title>Quantum-N3BULA | Logs</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">System Logs</h1>
            <p className="text-nebula-400">
              View and filter system log entries in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-nebula-400">Filter by level:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-nebula-900 border border-nebula-700 rounded-lg px-3 py-2 text-sm"
            >
              {logLevels.map((level) => (
                <option key={level} value={level}>
                  {level || 'All Levels'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <span className="animate-pulse text-2xl">⏳</span>
            <p className="text-nebula-400 mt-2">Loading logs...</p>
          </div>
        ) : (
          <div className="bg-nebula-900/30 rounded-xl p-4 border border-nebula-800 min-h-[600px]">
            <LogStream logs={logs} />
          </div>
        )}

        <div className="text-sm text-nebula-500 text-center">
          Showing {logs.length} log entries • Auto-refreshing every 10s
        </div>
      </div>
    </>
  );
}
