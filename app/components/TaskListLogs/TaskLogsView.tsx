type LogEntry = {
  id: number;
  user_id: number;
  action: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
};

type User = {
  id: number;
  username: string;
  email: string;
};

type TaskLogsViewProps = {
  user: User | null;
  logs: LogEntry[];
  error: string;
  loading: boolean;
};

export default function TaskLogsView({ user, logs, error, loading }: TaskLogsViewProps) {
  if (loading) return <p className="p-4 text-gray-500">Loading logs...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Task Logs</h1>

      {user && (
        <p className="text-sm text-gray-600 mb-4">
          Logged in as: <strong>{user.username}</strong> ({user.email})
        </p>
      )}

      {logs.length === 0 ? (
        <p className="text-gray-600">No logs available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Action</th>
              <th className="border px-4 py-2">IP Address</th>
              <th className="border px-4 py-2">User Agent</th>
              <th className="border px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center">{log.user_id}</td>
                <td className="border px-4 py-2 text-center">{log.action}</td>
                <td className="border px-4 py-2 text-center">{log.ip_address}</td>
                <td className="border px-4 py-2 text-center">{log.user_agent}</td>
                <td className="border px-4 py-2 text-center">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
