'use client';

import TaskExpiredView from './TaskExpiredView';
import { useRouter } from 'next/navigation';

export default function TaskExpiredContainer() {
  const router = useRouter();

  const handleLoginClick = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');


    router.push('/login');
  };

  return <TaskExpiredView onLoginClick={handleLoginClick} />;
}
