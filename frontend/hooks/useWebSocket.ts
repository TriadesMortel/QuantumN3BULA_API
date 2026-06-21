/**
 * WebSocket Hook for live updates from backend
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import type { Task, Log } from '@/lib/api';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:18080/ws';

interface TaskUpdateMessage {
  event: 'task_started' | 'task_completed' | 'task_failed';
  task_id: number;
  status?: string;
  result?: string;
}

interface LogMessage extends Omit<Log, 'id' | 'created_at'> {
  event: 'log';
  id?: number;
  created_at?: string;
}

type WebSocketMessage = TaskUpdateMessage | LogMessage | { event: string; [key: string]: unknown };

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setWsConnected, setLastEvent, updateTask, addLog } = useAppStore();

  const connect = useCallback(function connect() {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          setLastEvent(data);

          // Handle different event types
          if (data.event === 'task_started' || data.event === 'task_completed' || data.event === 'task_failed') {
            const taskMsg = data as TaskUpdateMessage;
            if (taskMsg.task_id) {
              // Create a partial task update with required fields
              const partialUpdate: Partial<Task> & { id: number } = {
                id: taskMsg.task_id,
                status: taskMsg.status || 'unknown',
                result: taskMsg.result ?? null,
              };
              updateTask(partialUpdate as Task);
            }
          } else if (data.event === 'log') {
            const logMsg = data as LogMessage;
            // Create a log entry with default values for missing fields
            const logEntry: Log = {
              id: logMsg.id || Date.now(),
              level: logMsg.level,
              message: logMsg.message,
              source: logMsg.source ?? null,
              task_id: logMsg.task_id ?? null,
              agent_id: logMsg.agent_id ?? null,
              created_at: logMsg.created_at || new Date().toISOString(),
            };
            addLog(logEntry);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnected(false);
        wsRef.current = null;

        // Reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws.close();
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
    }
  }, [setWsConnected, setLastEvent, updateTask, addLog]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { connect, disconnect, sendMessage };
}
