type Task = {
  name: string;
  deadline: string;
  priority: 'low' | 'normal' | 'high';
  is_done: boolean;
};

type Props = {
  task: Task;
  formErrors: { name?: string; deadline?: string };
  onChange: (task: Task) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export default function TaskEditView({
  task,
  formErrors,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <div className="container max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Edit Tugas</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Tugas</label>
          <input
            className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : ''}`}
            value={task.name}
            onChange={(e) => onChange({ ...task, name: e.target.value })}
          />
          {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            className={`w-full p-2 border rounded ${formErrors.deadline ? 'border-red-500' : ''}`}
            value={task.deadline}
            onChange={(e) => onChange({ ...task, deadline: e.target.value })}
          />
          {formErrors.deadline && (
            <p className="text-red-600 text-sm mt-1">{formErrors.deadline}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prioritas</label>
          <select
            className="w-full p-2 border rounded"
            value={task.priority}
            onChange={(e) =>
              onChange({ ...task, priority: e.target.value as Task['priority'] })
            }
          >
            <option value="low">🟢 Rendah</option>
            <option value="normal">🟠 Normal</option>
            <option value="high">🔴 Tinggi</option>
          </select>
        </div>

        <div>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={task.is_done}
              onChange={(e) => onChange({ ...task, is_done: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Tugas Selesai</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-800"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
