'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TASKS_API_REGISTER } from '@/lib/api';
import TaskRegisterView from './TaskRegistertView';

export default function TaskRegisterContainer() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [alert, setAlert] = useState('');
  const [match, setMatch] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'confirm') {
      setMatch(form.password === value);
    }
    if (name === 'password') {
      setMatch(form.confirm === value);
    }
  };

  const handleRegister = async () => {
    const { username, email, password, confirm } = form;

    if (!username || !email || !password || !confirm) {
      setAlert('Please fill in all fields');
      return;
    }

    if (password !== confirm) {
      setAlert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(TASKS_API_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
          password_confirmation: confirm,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert(data.message || 'Registration failed');
        return;
      }

      setAlert('Registration successful! Redirecting...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      setAlert('Something went wrong. Please try again.');
    }
  };

  return (
    <TaskRegisterView
      form={form}
      alert={alert}
      match={match}
      onChange={handleChange}
      onSubmit={handleRegister}
    />
  );
}
