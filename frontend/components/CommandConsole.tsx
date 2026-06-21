/**
 * Task Console component for queuing safe task actions
 */

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { tasksApi, Task } from '@/lib/api';

interface ConsoleOutput {
  type: 'action' | 'response' | 'error';
  text: string;
  timestamp: Date;
}

export default function CommandConsole() {
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [outputs, setOutputs] = useState<ConsoleOutput[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const { token, addTask } = useAppStore();

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputs]);

  const addOutput = (type: ConsoleOutput['type'], text: string) => {
    setOutputs((prev) => [...prev, { type, text, timestamp: new Date() }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || !token) return;

    const safeTaskPattern = /^[A-Za-z0-9_:]{1,64}$/;
    if (!safeTaskPattern.test(command.trim())) {
      addOutput('error', 'Invalid task action. Use letters, numbers, underscores, or colons only.');
      return;
    }

    addOutput('action', `> ${command}`);
    setIsLoading(true);

    try {
      const task: Task = await tasksApi.execute(command, token);
      addTask(task);
      addOutput('response', `Task ${task.id} created: ${task.status}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addOutput('error', `Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setCommand('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="terminal">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-nebula-300">Task Console</h3>
        <button
          onClick={() => setOutputs([])}
          className="text-xs text-nebula-500 hover:text-nebula-300"
        >
          Clear
        </button>
      </div>

      {/* Output Area */}
      <div ref={outputRef} className="terminal-output mb-3 text-sm space-y-1">
        {outputs.length === 0 && (
          <p className="text-nebula-500 italic">
            Enter a safe task action...
          </p>
        )}
        {outputs.map((output, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-nebula-600 text-xs">
              {formatTime(output.timestamp)}
            </span>
            <span
              className={
                output.type === 'action'
                  ? 'text-nebula-400'
                  : output.type === 'error'
                  ? 'text-red-400'
                  : 'text-green-400'
              }
            >
              {output.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 text-yellow-400">
            <span className="animate-pulse">⏳</span>
            <span>Queueing task...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <span className="text-nebula-400">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder={token ? 'Enter task action...' : 'Login to queue task actions'}
          disabled={!token || isLoading}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-nebula-600"
        />
        <button
          type="submit"
          disabled={!token || isLoading || !command.trim()}
          className="px-3 py-1 bg-nebula-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-nebula-500"
        >
          Queue
        </button>
      </form>
    </div>
  );
}
