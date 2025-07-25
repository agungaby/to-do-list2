'use client';

import Link from 'next/link';
import { link } from 'node:fs';

type Task = {
  id: number;
  name: string;
  deadline: string;
  priority: 'low' | 'normal' | 'high';
  is_done: boolean;
};

type Props = {
  user: any;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  name: string;
  deadline: string;
  priority: Task['priority'];
  search: string;
  statusFilter: 'all' | 'done' | 'undone';
  priorityFilter: 'all' | 'low' | 'normal' | 'high';
  countdown: number | null;
  formErrors: { name?: string; deadline?: string };
  setName: (val: string) => void;
  setDeadline: (val: string) => void;
  setPriority: (val: Task['priority']) => void;
  setSearch: (val: string) => void;
  setStatusFilter: (val: 'all' | 'done' | 'undone') => void;
  setPriorityFilter: (val: 'all' | 'low' | 'normal' | 'high') => void;
  handleAdd: (e: React.FormEvent) => void;
  toggleDone: (task: Task) => void;
  deleteTask: (id: number) => void;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default function TaskListView({
  user,
  tasks,
  loading,
  error,
  name,
  deadline,
  priority,
  search,
  statusFilter,
  priorityFilter,
  countdown,
  formErrors,
  setName,
  setDeadline,
  setPriority,
  setSearch,
  setStatusFilter,
  setPriorityFilter,
  handleAdd,
  toggleDone,
  deleteTask
}: Props) {
  const displayedTasks = tasks
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    .filter((t) =>
      statusFilter === 'all' ? true : statusFilter === 'done' ? t.is_done : !t.is_done,
    )
    .filter((t) => (priorityFilter === 'all' ? true : t.priority === priorityFilter));

  if (loading) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div className="container border border-gray-300 rounded-lg p-4 max-w-2xl mx-auto space-y-6 my-10">
      <h1 className="text-6xl pt-4">📅To-Do List📅</h1>

      {user && (
        <h1 className="text-3xl mb-4">
          Halo, <span className="font-semibold text-purple-600">{user.name}</span>👤! Selamat datang👋
        </h1>
      )}

      {countdown !== null && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
          Token akan kedaluwarsa dalam <span className="font-bold">{countdown}</span> detik. Kamu akan logout otomatis.
        </div>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari tugas…"
        className="w-full p-2 border rounded focus:outline-none"
      />

      <form
        onSubmit={handleAdd}
        className="bg-gray-50 p-4 rounded-xl shadow flex flex-col md:flex-row md:items-end gap-4 text-black"
      >
        <div className="flex-1 flex flex-col">
          <input
            className={`p-2 border rounded ${formErrors.name ? 'border-red-500' : ''}`}
            placeholder="Tambah tugas…"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
        </div>

        <div className="flex flex-col">
          <input
            type="date"
            className={`p-2 border rounded ${formErrors.deadline ? 'border-red-500' : ''}`}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          {formErrors.deadline && <p className="text-red-600 text-sm mt-1">{formErrors.deadline}</p>}
        </div>

        <select
          className="p-2 border rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task['priority'])}
        >
          <option value="low">🟢 Rendah</option>
          <option value="normal">🟠 Normal</option>
          <option value="high">🔴 Tinggi</option>
        </select>

        <button className="bg-indigo-600 hover:bg-indigo-950 text-white px-4 py-2 rounded">+</button>
      </form>

      <div className="space-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold">Status:</span>
            {(['all', 'done', 'undone'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={statusFilter === s ? 'underline font-medium' : 'text-gray-600 hover:underline'}
              >
                {s === 'all' ? '📘 Semua' : s === 'done' ? '✅ Selesai' : '📥 Belum'}
              </button>
            ))}
          </div>

          <Link href="/logout" className="text-red-600 hover:underline text-sm font-semibold">
            🚪 Log-Out
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold">Prioritas:</span>
          {(['all', 'high', 'normal', 'low'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={priorityFilter === p ? 'underline font-medium' : 'text-gray-600 hover:underline'}
            >
              {p === 'all'
                ? '📋 Semua'
                : p === 'high'
                ? '🔴 Tinggi'
                : p === 'normal'
                ? '🟠 Normal'
                : '🟢 Rendah'}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-4">
        {displayedTasks.length ? (
          displayedTasks.map((t) => (
            <li key={t.id} className="flex justify-between items-start p-4 bg-white rounded shadow border">
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={t.is_done} onChange={() => toggleDone(t)} />
                <div className={t.is_done ? 'line-through text-black' : ''}>
                  <div className="font-semibold text-purple-600">{t.name}</div>
                  <div className="text-sm text-gray-600">
                    🗓 {formatDate(t.deadline)}
                    <br />
                    🔥{' '}
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        t.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : t.priority === 'normal'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <button className="text-red-600 hover:text-red-800" onClick={() => deleteTask(t.id)}>
                  🗑 Hapus
                </button>
                <Link href={`/userserver/edit/${t.id}`} className="text-blue-600 hover:underline text-sm">
                  ✏ Edit
                </Link>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-400">Tidak ada tugas.</li>
        )}
      </ul>
      <div>
<Link href="userserver/logs">
  <button className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-full shadow-lg">
    📝 Log
  </button>
</Link>


      </div>
    </div>
    
  );
}
