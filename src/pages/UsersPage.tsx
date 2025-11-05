import { FunctionalComponent } from 'preact';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/UI/Button';

export const UsersPage: FunctionalComponent<{ path?: string }> = () => {
  const { data, loading, error, remove } = useUsers();

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-400">Error: {error.message}</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Usuarios</h2>
      <ul className="space-y-3">
        {data?.map(u => (
          <li
            key={u.id}
            className="flex items-center justify-between gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
          >
            <span className="text-gray-200">
              {u.name} — {u.email} — <span className="font-semibold capitalize">{u.role}</span>
            </span>
            <Button
              onClick={() => remove(u.id)}
              className="bg-rojo-moderna text-white hover:bg-rojo-moderna-dark"
            >
              Eliminar
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};