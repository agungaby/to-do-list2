'use client';

type Props = {
  user: { name: string } | null;
  onLogout: () => void;
  onCancel: () => void;
};

export default function TaskLogoutView({ user, onLogout, onCancel }: Props) {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-black outline-4 rounded shadow text-center">
      <h1 className="text-xl font-bold mb-4">Konfirmasi Logout</h1>
      <p className="mb-6">
        {user ? (
          <>
            Apakah kamu yakin ingin logout dari akun,{' '}
            <span className="font-semibold text-purple-600 text-2xl">{user.name}</span>❓
          </>
        ) : (
          <>Apakah kamu yakin ingin logout?</>
        )}
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
        >
          Ya, Logout
        </button>
        <button
          onClick={onCancel}
          className="border px-4 py-2 rounded hover:bg-green-950"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
