/**
 * Task List component
 */

import { Task } from '@/lib/api';

interface TaskListProps {
  tasks: Task[];
  limit?: number;
}

export default function TaskList({ tasks, limit }: TaskListProps) {
  const displayTasks = limit ? tasks.slice(0, limit) : tasks;

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      running: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      completed: 'bg-green-500/20 text-green-300 border-green-500/50',
      failed: 'bg-red-500/20 text-red-300 border-red-500/50',
      cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
    };

    return (
      <span
        className={`px-2 py-0.5 text-xs rounded-full border ${
          statusStyles[status] || statusStyles.pending
        }`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-nebula-500">
        <p>No tasks yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayTasks.map((task) => (
        <div
          key={task.id}
          className="p-3 bg-nebula-900/50 rounded-lg border border-nebula-800 hover:border-nebula-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-nebula-400 text-sm">#{task.id}</span>
              <span className="font-medium">{task.name}</span>
              {getStatusBadge(task.status)}
            </div>
            <span className="text-xs text-nebula-500">
              {formatDate(task.created_at)}
            </span>
          </div>
          <div className="text-sm text-nebula-400 font-mono bg-black/20 px-2 py-1 rounded">
            {task.command}
          </div>
          {task.result && (
            <div className="mt-2 text-sm text-green-400">
              Result: {task.result}
            </div>
          )}
          {task.error && (
            <div className="mt-2 text-sm text-red-400">
              Error: {task.error}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
