'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TASKS_API } from '@/lib/api';
import TaskEditView from './TaskEditView';

type Task = {
  name: string;
  deadline: string;
  priority: 'low' | 'normal' | 'high';
  is_done: boolean;
};

export default function TaskEditContainer() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [task, setTask] = useState<Task>({
    name: '',
    deadline: '',
    priority: 'normal',
    is_done: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ name?: string; deadline?: string }>({});

  const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`${TASKS_API}/${id}`, { headers: getHeaders() });
        if (res.status === 500) {
          router.replace('/expired');
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = json.data;

        setTask({
          name: data.name,
          deadline: data.deadline?.slice(0, 10) ?? '',
          priority: data.priority,
          is_done: Boolean(data.is_done),
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setError(null);

    const errors: { name?: string; deadline?: string } = {};
    if (!task.name.trim()) errors.name = 'Nama tugas wajib diisi';
    if (!task.deadline) errors.deadline = 'Tanggal deadline wajib diisi';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const res = await fetch(`${TASKS_API}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ ...task, is_done: task.is_done }),
      });

      if (res.status === 500) {
        router.replace('/expired');
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      router.push('/userserver');
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <TaskEditView
      task={task}
      formErrors={formErrors}
      onChange={setTask}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
