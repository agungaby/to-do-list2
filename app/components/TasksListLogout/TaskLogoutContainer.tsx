'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TASKS_API_LOGOUT } from '@/lib/api';
import TaskLogoutView from './TaskLogoutView';

type User = {
  id: number;
  name: string;
};

export default function TaskLogoutContainer() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Gagal parse user:', e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(TASKS_API_LOGOUT, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleCancel = () => {
    router.back();
  };

  return <TaskLogoutView user={user} onLogout={handleLogout} onCancel={handleCancel} />;
}
