/**
 * Agent Card component
 */

import { Agent } from '@/lib/api';

interface AgentCardProps {
  agent: Agent;
  onDelete?: (id: number) => void;
}

export default function AgentCard({ agent, onDelete }: AgentCardProps) {
  const getStatusIndicator = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      active: { color: 'status-active', label: 'Active' },
      inactive: { color: 'status-inactive', label: 'Inactive' },
      busy: { color: 'status-pending', label: 'Busy' },
      error: { color: 'status-error', label: 'Error' },
    };
    return statusMap[status] || statusMap.inactive;
  };

  const statusInfo = getStatusIndicator(agent.status);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-4 bg-nebula-900/50 rounded-xl border border-nebula-800 hover:border-nebula-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🤖</span>
          <div>
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
              <span className="text-xs text-nebula-400">{statusInfo.label}</span>
            </div>
          </div>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(agent.id)}
            className="text-red-500 hover:text-red-400 text-sm"
            title="Delete agent"
          >
            ✕
          </button>
        )}
      </div>

      {agent.description && (
        <p className="text-sm text-nebula-400 mb-3">{agent.description}</p>
      )}

      <div className="text-xs text-nebula-500 space-y-1">
        <p>ID: {agent.id}</p>
        <p>Created: {formatDate(agent.created_at)}</p>
        <p>Last Heartbeat: {formatDate(agent.last_heartbeat)}</p>
      </div>
    </div>
  );
}
