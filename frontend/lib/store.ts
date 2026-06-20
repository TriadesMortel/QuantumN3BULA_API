import { create } from 'zustand';
import type { Agent, Log, SystemStatus, Task, User } from '@/lib/api';

interface AppState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;

  systemStatus: SystemStatus | null;
  setSystemStatus: (status: SystemStatus) => void;

  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Partial<Task> & { id: Task['id'] }) => void;

  logs: Log[];
  setLogs: (logs: Log[]) => void;
  addLog: (log: Log) => void;

  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  addAgent: (agent: Agent) => void;
  removeAgent: (id: number) => void;

  wsConnected: boolean;
  setWsConnected: (connected: boolean) => void;
  lastEvent: unknown | null;
  setLastEvent: (event: unknown) => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  consoleLogs: string[];
  addConsoleLog: (log: string) => void;
  clearConsoleLogs: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  clearAuth: () => set({ token: null, user: null }),

  systemStatus: null,
  setSystemStatus: (systemStatus) => set({ systemStatus }),

  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (task) =>
    set((state) => {
      const taskId = String(task.id);
      return {
        tasks: state.tasks.map((item) =>
          String(item.id) === taskId ? { ...item, ...task } : item
        ),
      };
    }),

  logs: [],
  setLogs: (logs) => set({ logs }),
  addLog: (log) =>
    set((state) => ({ logs: [log, ...state.logs].slice(0, 500) })),

  agents: [],
  setAgents: (agents) => set({ agents }),
  addAgent: (agent) =>
    set((state) => ({ agents: [agent, ...state.agents] })),
  removeAgent: (id) =>
    set((state) => ({ agents: state.agents.filter((agent) => agent.id !== id) })),

  wsConnected: false,
  setWsConnected: (wsConnected) => set({ wsConnected }),
  lastEvent: null,
  setLastEvent: (lastEvent) => set({ lastEvent }),

  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  consoleLogs: ['[SYSTEM] N3BULA OS Initialized...'],
  addConsoleLog: (log) =>
    set((state) => ({
      consoleLogs: [
        ...state.consoleLogs,
        `[${new Date().toLocaleTimeString()}] ${log}`,
      ],
    })),
  clearConsoleLogs: () => set({ consoleLogs: [] }),
}));
