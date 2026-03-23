/**
 * Agents Page
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useAppStore } from '@/lib/store';
import { agentsApi } from '@/lib/agentsApi';
import AgentCard from '@/components/AgentCard';

export default function AgentsPage() {
  const { token, agents, setAgents, addAgent, removeAgent } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const agentList = await agentsApi.getAgents();
        setAgents(agentList);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [setAgents]);

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newAgent.name.trim()) return;

    setIsCreating(true);
    try {
      const agent = await agentsApi.create(newAgent, token);
      addAgent(agent);
      setNewAgent({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create agent:', error);
      alert('Failed to create agent');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAgent = async (id: number) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      await agentsApi.delete(id, token);
      removeAgent(id);
    } catch (error) {
      console.error('Failed to delete agent:', error);
      alert('Failed to delete agent');
    }
  };

  return (
    <>
      <Head>
        <title>Quantum-N3BULA | Agents</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">AI Agents</h1>
            <p className="text-nebula-400">
              Manage and monitor your AI-ops agents.
            </p>
          </div>

          {token && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-nebula-600 rounded-lg hover:bg-nebula-500 transition-colors"
            >
              {showCreateForm ? 'Cancel' : '+ Add Agent'}
            </button>
          )}
        </div>

        {/* Create Agent Form */}
        {showCreateForm && (
          <form
            onSubmit={handleCreateAgent}
            className="bg-nebula-900/50 rounded-xl p-4 border border-nebula-700 space-y-4"
          >
            <h3 className="font-semibold">Create New Agent</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-nebula-400 mb-1">
                  Agent Name *
                </label>
                <input
                  type="text"
                  value={newAgent.name}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, name: e.target.value })
                  }
                  placeholder="e.g., data-processor-1"
                  className="w-full bg-nebula-950 border border-nebula-700 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-nebula-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newAgent.description}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, description: e.target.value })
                  }
                  placeholder="Optional description"
                  className="w-full bg-nebula-950 border border-nebula-700 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isCreating || !newAgent.name.trim()}
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Agent'}
            </button>
          </form>
        )}

        {/* Agents Grid */}
        {loading ? (
          <div className="text-center py-8">
            <span className="animate-pulse text-2xl">⏳</span>
            <p className="text-nebula-400 mt-2">Loading agents...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12 bg-nebula-900/30 rounded-xl border border-nebula-800">
            <span className="text-4xl">🤖</span>
            <p className="text-nebula-400 mt-4">No agents registered yet</p>
            {token && (
              <p className="text-sm text-nebula-500 mt-2">
                Click the button above to add your first agent
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onDelete={token ? handleDeleteAgent : undefined}
              />
            ))}
          </div>
        )}

        <div className="text-sm text-nebula-500 text-center">
          {agents.length} agent{agents.length !== 1 ? 's' : ''} registered
        </div>
      </div>
    </>
  );
}
