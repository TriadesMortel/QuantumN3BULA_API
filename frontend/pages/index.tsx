/**
 * Home / Overview Page
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useAppStore } from '@/lib/store';
import { statusApi, tasksApi, logsApi } from '@/lib/api';
import StatusCard from '@/components/StatusCard';
import CommandConsole from '@/components/CommandConsole';
import TaskList from '@/components/TaskList';
import LogStream from '@/components/LogStream';

export default function HomePage() {
  const { systemStatus, setSystemStatus, tasks, setTasks, logs, setLogs } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [status, taskList, logList] = await Promise.all([
          statusApi.getStatus(),
          tasksApi.list(),
          logsApi.list({ limit: 20 }),
        ]);
        setSystemStatus(status);
        setTasks(taskList);
        setLogs(logList);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh status every 30 seconds
    const interval = setInterval(async () => {
      try {
        const status = await statusApi.getStatus();
        setSystemStatus(status);
      } catch (error) {
        console.error('Failed to refresh status:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [setSystemStatus, setTasks, setLogs]);

  const formatUptime = (seconds?: number) => {
    if (seconds === undefined) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <Head>
        <title>Quantum-N3BULA | Dashboard</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">System Overview</h1>
          <p className="text-nebula-400">
            Monitor system health, execute commands, and track tasks.
          </p>
        </div>

        {/* Status Cards */}
        {loading ? (
          <div className="text-center py-8">
            <span className="animate-pulse text-2xl">⏳</span>
            <p className="text-nebula-400 mt-2">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatusCard
              title="System Status"
              value={systemStatus?.status || 'Unknown'}
              icon="💚"
              status={
                systemStatus?.status === 'online'
                  ? 'healthy'
                  : systemStatus?.status === 'degraded'
                  ? 'degraded'
                  : 'error'
              }
            />
            <StatusCard
              title="Uptime"
              value={formatUptime(systemStatus?.uptime)}
              icon="⏱️"
            />
            <StatusCard
              title="Active Agents"
              value={systemStatus?.active_agents || 0}
              icon="🤖"
            />
            <StatusCard
              title="Pending Tasks"
              value={systemStatus?.active_tasks || 0}
              icon="📋"
            />
          </div>
        )}

        {/* Command Console */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Execute Commands</h2>
          <CommandConsole />
        </div>

        {/* Recent Tasks and Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Recent Tasks</h2>
            <div className="bg-nebula-900/30 rounded-xl p-4 border border-nebula-800">
              <TaskList tasks={tasks} limit={5} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Recent Logs</h2>
            <div className="bg-nebula-900/30 rounded-xl p-4 border border-nebula-800 max-h-80 overflow-y-auto">
              <LogStream logs={logs} limit={10} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
