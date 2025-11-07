import { FunctionalComponent, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input'; // Re-usaremos el Input, pero lo adaptamos

export const LoginPage: FunctionalComponent<{ path?: string }> = () => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    route('/');
    return null;
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      route('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Clases para el Input en tema claro
  const inputClass = "py-2 px-3 w-full rounded-md bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rojo-moderna focus:border-rojo-moderna";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-500">Ingresa tus credenciales para acceder</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
              className={inputClass} // Aplicamos clase de tema claro
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className={inputClass} // Aplicamos clase de tema claro
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rojo-moderna text-white hover:bg-rojo-moderna-dark focus:ring-rojo-moderna"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* --- (REEMPLAZADO) --- */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
          <strong className="block mb-2 text-gray-700">
            Usuarios de prueba (pass: user123):
          </strong>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span>Admin: ana@example.com</span>
            <span>HSEQ: wilson@example.com</span>
            <span>Solicitante: jorge@example.com</span>
            <span>Área: nelson@example.com</span>
            <span>Trabajador: maria@example.com</span>
            <span>Doctora: medica@example.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};