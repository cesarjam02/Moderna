import { FunctionalComponent, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';

export const LoginPage: FunctionalComponent<{ path?: string }> = () => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si ya está autenticado, redirigir al home
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

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          padding: '2.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f0f0f0',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              color: '#1a1a1a',
              margin: '0 0 0.5rem 0',
              fontSize: '2rem',
              fontWeight: '600',
            }}
          >
            Iniciar Sesión
          </h1>
          <p style={{ color: '#666', margin: 0, fontSize: '0.95rem' }}>
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              border: '1px solid #fcc',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#333',
                fontWeight: '500',
                fontSize: '0.9rem',
              }}
            >
              Correo electrónico
            </label>
            <Input
              type="email"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#333',
                fontWeight: '500',
                fontSize: '0.9rem',
              }}
            >
              Contraseña
            </label>
            <Input
              type="password"
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              placeholder="••••••••"
              required
              disabled={loading}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#b71c1c';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#d32f2f';
              }
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#666',
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
            Usuarios de prueba:
          </strong>
          <div style={{ lineHeight: '1.6' }}>
            <div>Admin: ana@example.com / admin123</div>
            <div>Manager: carlos@example.com / manager123</div>
            <div>User: maria@example.com / user123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

