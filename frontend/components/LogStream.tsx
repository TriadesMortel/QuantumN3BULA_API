/**
 * Log Stream component
 */

import { Log } from '@/lib/api';

interface LogStreamProps {
  logs: Log[];
  limit?: number;
}

export default function LogStream({ logs, limit }: LogStreamProps) {
  const displayLogs = limit ? logs.slice(0, limit) : logs;

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      debug: 'text-gray-400',
      info: 'text-blue-400',
      warning: 'text-yellow-400',
      error: 'text-red-400',
      critical: 'text-red-500 font-bold',
    };
    return colors[level] || colors.info;
  };

  const getLevelIcon = (level: string) => {
    const icons: Record<string, string> = {
      debug: '🔍',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      critical: '🚨',
    };
    return icons[level] || icons.info;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-nebula-500">
        <p>No logs available</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 font-mono text-sm">
      {displayLogs.map((log) => (
        <div
          key={log.id}
          className="flex items-start gap-2 px-2 py-1 rounded hover:bg-nebula-900/50"
        >
          <span className="text-nebula-600 text-xs whitespace-nowrap">
            {formatDate(log.created_at)}
          </span>
          <span>{getLevelIcon(log.level)}</span>
          <span className={getLevelColor(log.level)}>
            [{log.level.toUpperCase()}]
          </span>
          {log.source && (
            <span className="text-nebula-500">[{log.source}]</span>
          )}
          <span className="text-nebula-200 flex-1">{log.message}</span>
        </div>
      ))}
    </div>
  );
}
