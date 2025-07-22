'use client';

type Props = {
  email: string;
  password: string;
  alert: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onSubmit: () => void;
};

export default function TaskLoginView({ email, password, alert, setEmail, setPassword, onSubmit }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-black p-8 rounded shadow-md max-w-md w-full outline-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {alert && (
          <div
            className={`mb-4 p-2 text-center rounded ${
              alert.toLowerCase().includes('success') || alert.toLowerCase().includes('welcome')
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {alert}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={onSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Log In
        </button>

        <p className="text-center mt-4">
          doesn't have some account?{' '}
          <a href="/register" className="text-purple-400 font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
