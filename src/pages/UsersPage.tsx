import { FunctionalComponent } from 'preact';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/Button';

export const UsersPage: FunctionalComponent<{ path?: string }> = () => {
  const { data, loading, error, remove } = useUsers();
  const { isAuthenticated } = useAuth();

  const textColor = isAuthenticated ? '#ffffff' : '#1a1a1a';

  if (loading) return <p style={{ color: textColor }}>Cargando usuarios...</p>;
  if (error) return <p style={{ color: textColor }}>Error: {error.message}</p>;

  return (
    <div>
      <h2 style={{ color: textColor }}>Usuarios</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.map(u => (
          <li
            key={u.id}
            style={{
              display: 'flex',
              gap: '.5rem',
              alignItems: 'center',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              backgroundColor: isAuthenticated ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa',
              borderRadius: '8px',
              border: isAuthenticated ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #eee',
            }}
          >
            <span style={{ color: textColor, flex: 1 }}>
              {u.name} — {u.email} — {u.role}
            </span>
            <Button onClick={() => remove(u.id)}>Eliminar</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};