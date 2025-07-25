'use client';

import { useEffect, useState } from 'react';
import { TASKS_API_LOGS } from '@/lib/api';
import TaskLogsView from './TaskLogsView';

type LogEntry = {
  id: number;
  user_id: number;
  action: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
};

type User = {
  id: number;
  username: string;
  email: string;
};

export default function TaskLogsContainer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token not found');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(TASKS_API_LOGS, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setLogs(data);
      } catch (err: any) {
        setError('Failed to fetch logs: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <TaskLogsView
      user={user}
      logs={logs}
      error={error}
      loading={loading}
    />
  );
}
