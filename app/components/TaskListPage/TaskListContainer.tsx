'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TASKS_API } from '@/lib/api';
import TaskListView from './TaskListView';

type Task = {
  id: number;
  name: string;
  deadline: string;
  priority: 'low' | 'normal' | 'high';
  is_done: boolean;
};

function notifyExpiredToken() {
  console.warn('401');
  window.location.href = '/expired';
}

function checkToken(): boolean {
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('expires_at');
  return !!token && !!expiresAt && new Date() < new Date(expiresAt);
}

function checkTokenOrLogout(): boolean {
  if (!checkToken()) {
    notifyExpiredToken();
    return false;
  }
  return true;
}

export default function TaskListContainer() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ name?: string; deadline?: string }>({});
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('normal');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'done' | 'undone'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'normal' | 'high'>('all');
  const [countdown, setCountdown] = useState<number | null>(null);
  const hasAlertedRef = useRef(false);

  const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const expiresAt = localStorage.getItem('expires_at');
      if (!expiresAt) return notifyExpiredToken();

      const now = new Date();
      const expiryDate = new Date(expiresAt);
      const timeLeft = Math.floor((expiryDate.getTime() - now.getTime()) / 1000);

      if (timeLeft <= 0) {
        notifyExpiredToken();
      } else if (timeLeft <= 10) {
        setCountdown(timeLeft);
        if (!hasAlertedRef.current) {
          alert(`Sesi kamu akan habis dalam ${timeLeft} detik!`);
          hasAlertedRef.current = true;
        }
      } else {
        setCountdown(null);
        hasAlertedRef.current = false;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const token = localStorage.getItem('token');
  console.log('Token saat ini:', token);
  if (!token) {
    console.warn('Token tidak ditemukan, redirect ke expired.');
    notifyExpiredToken();
  }

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    if (!checkTokenOrLogout()) return;

    try {
      const res = await fetch(TASKS_API, { headers: getHeaders() });
      console.log('Status code:', res.status);
      if (res.status === 401) {
        notifyExpiredToken();
        return;
      }

      const json = await res.json();
      setTasks(json.data.map((t: any) => ({ ...t, is_done: Boolean(t.is_done) })));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setError(null);

    const errors: { name?: string; deadline?: string } = {};
    if (!name.trim()) errors.name = 'Nama tugas wajib diisi';
    if (!deadline) errors.deadline = 'Tanggal deadline wajib diisi';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!checkTokenOrLogout()) return;

    try {
      const res = await fetch(TASKS_API, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, deadline, priority }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setName('');
      setDeadline('');
      setPriority('normal');
      fetchTasks();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const toggleDone = async (task: Task) => {
    if (!checkTokenOrLogout()) return;
    const updated = { ...task, is_done: !task.is_done };
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));

    try {
      const res = await fetch(`${TASKS_API}/${task.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e: any) {
      setError(e.message);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    }
  };

  const deleteTask = async (id: number) => {
    if (!checkTokenOrLogout()) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`${TASKS_API}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e: any) {
      setError(e.message);
      fetchTasks();
    }
  };

  return (
    <TaskListView
      user={user}
      tasks={tasks}
      loading={loading}
      error={error}
      name={name}
      deadline={deadline}
      priority={priority}
      search={search}
      statusFilter={statusFilter}
      priorityFilter={priorityFilter}
      countdown={countdown}
      formErrors={formErrors}
      setName={setName}
      setDeadline={setDeadline}
      setPriority={setPriority}
      setSearch={setSearch}
      setStatusFilter={setStatusFilter}
      setPriorityFilter={setPriorityFilter}
      handleAdd={handleAdd}
      toggleDone={toggleDone}
      deleteTask={deleteTask}
    />
  );
}
