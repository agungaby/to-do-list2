'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TASKS_API_LOGIN } from '@/lib/api';
import TaskLoginView from './TaskLoginview';

export default function TaskLoginContainer() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState('');

  const showAlert = (msg: string) => {
    setAlert(msg);
    setTimeout(() => setAlert(''), 4000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(TASKS_API_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message =
          data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Login failed');
        showAlert(message);
        return;
      }

      const token = res.headers.get('Authorization')?.replace('Bearer ', '');
      const expiresAt = data.expires_at;
      const user = data.user;
      const name = user?.name || 'User';

      if (!token || !user) {
        showAlert('Login berhasil tapi data tidak lengkap.');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (expiresAt) localStorage.setItem('expires_at', expiresAt);

      showAlert(`Welcome ${name}👤`);
      setTimeout(() => router.push('/userserver'), 1000);
    } catch {
      showAlert('Something went wrong. Please try again.');
    }
  };

  return (
    <TaskLoginView
      email={email}
      password={password}
      alert={alert}
      setEmail={setEmail}
      setPassword={setPassword}
      onSubmit={handleLogin}
    />
  );
}
