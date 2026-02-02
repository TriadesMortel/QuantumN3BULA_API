// N3BULA API DEFINITION - VERSION SYNCHRONISÉE
// Correction: ajout de toutes les propriétés nécessaires

// --- 1. AGENTS ---
export interface Agent {
  id: number;
  name: string;
  type: 'Tactical' | 'Strategic' | 'Sentinel';
  status: 'online' | 'offline' | 'training';
  performance: number;
  lastUpdate?: string;
  description?: string;
  created_at: string;
  last_heartbeat: string;
}

export const getAgents = async (): Promise<Agent[]> => {
  return [
    {
      id: 1,
      name: 'CORTEX-ALPHA',
      type: 'Strategic',
      status: 'online',
      performance: 12.5,
      lastUpdate: new Date().toISOString(),
      description: 'Noyau tactique principal',
      created_at: new Date().toISOString(),
      last_heartbeat: new Date().toISOString()
    }
  ];
};

export const agentsApi = {
  getAgents: async (): Promise<Agent[]> => { return getAgents(); },
  getAgent: async (id: number): Promise<Agent | null> => {
    const agents = await getAgents();
    return agents.find(a => a.id === id) || null;
  }
};

// --- 2. TASKS ---
export interface Task {
  id: string | number;
  name: string;
  title: string;
  command: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  result?: string | null;
  error?: string | null;
}

export const tasksApi = {
  getTasks: async (): Promise<Task[]> => { return []; },
  list: async (): Promise<Task[]> => { return []; },
  
  createTask: async (task: Partial<Task>): Promise<Task> => {
    const now = new Date().toISOString();
    return {
      id: 'task-' + Math.random().toString(36).substr(2, 9),
      name: task.name || task.title || 'New Task',
      title: task.title || task.name || 'New Task',
      command: task.command || '',
      status: 'pending',
      priority: 'medium',
      created_at: now,
      ...task
    } as Task;
  },

  execute: async (command: string, token: string | null): Promise<Task> => {
    const now = new Date().toISOString();
    return {
      id: 'exec-' + Math.random().toString(36).substr(2, 9),
      name: 'Command: ' + command,
      title: 'Command: ' + command,
      command: command,
      status: 'running',
      priority: 'high',
      created_at: now
    } as Task;
  }
};

// --- 3. LOGS ---
export interface Log {
  id: string | number;
  created_at: string;
  level: string;
  message: string;
  source?: string | null;
  task_id?: number | null;
  agent_id?: number | null;
}

export const logsApi = {
  getLogs: async (params?: { level?: string; limit?: number }): Promise<Log[]> => {
    return [
      {
        id: 'log-1',
        created_at: new Date().toISOString(),
        level: 'success',
        message: 'N3BULA Core System Initialized',
        source: 'System'
      }
    ];
  },
  list: async (params?: { level?: string; limit?: number }): Promise<Log[]> => {
    return logsApi.getLogs(params);
  }
};

// --- 4. USER ---
export interface User {
  id: number;
  username: string;
  email?: string;
  role: 'admin' | 'user' | 'guest';
  created_at?: string;
}

export const authApi = {
  login: async (username: string, password: string): Promise<{ token: string; user: User }> => {
    return {
      token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
      user: {
        id: 1,
        username: username,
        role: 'admin'
      }
    };
  },
  register: async (userData: { username: string; password: string; email?: string }): Promise<{ token: string; user: User }> => {
    return {
      token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
      user: {
        id: Math.floor(Math.random() * 10000),
        username: userData.username,
        email: userData.email,
        role: 'user'
      }
    };
  },
  logout: async (): Promise<void> => {},
  getCurrentUser: async (): Promise<User | null> => null
};

// --- 5. SYSTEM STATUS ---
export interface SystemStatus {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  active_tasks: number;
  active_agents: number;
  uptime: number;
  status: 'online' | 'offline' | 'degraded';
}

export const statusApi = {
  getStatus: async (): Promise<SystemStatus> => {
    return {
      cpu_usage: 45,
      memory_usage: 62,
      disk_usage: 35,
      active_tasks: 3,
      active_agents: 2,
      uptime: 86400,
      status: 'online'
    };
  }
};
