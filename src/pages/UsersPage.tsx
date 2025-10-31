import { FunctionalComponent } from 'preact';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/UI/Button';

export const UsersPage: FunctionalComponent<{ path?: string }> = () => {
  const { data, loading, error, remove } = useUsers();

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Usuarios</h2>
      <ul>
        {data?.map(u => (
          <li key={u.id} style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            <span>{u.name} — {u.email} — {u.role}</span>
            <Button onClick={() => remove(u.id)}>Eliminar</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};