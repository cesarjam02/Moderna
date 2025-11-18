import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/UI/Button';
import { User } from '@/types';
import { UserEditModal } from '@/components/Modals/UserEditModal';

export const UsersPage: FunctionalComponent<{ path?: string }> = () => {
  const { data, loading, error, remove, update } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-400">Error: {error.message}</p>;

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleSave = async (id: string, updates: { name?: string; email?: string; role?: any; active?: boolean }) => {
    await update(id, updates);
    setEditingUser(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      await remove(id);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Usuarios</h2>
      <div className="space-y-3">
        {data?.map(u => (
          <div
            key={u.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
          >
            <div className="flex-1 w-full sm:w-auto">
              <div className="text-gray-200 text-sm sm:text-base">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-semibold">{u.name}</span>
                  <span className="hidden sm:inline">—</span>
                  <span className="text-gray-300 break-all">{u.email}</span>
                  <span className="hidden sm:inline">—</span>
                  <span className="font-semibold capitalize">{u.role}</span>
                  {!u.active && <span className="text-xs text-red-400">(Inactivo)</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleEdit(u)}
                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                title="Editar usuario"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <Button
                onClick={() => handleDelete(u.id)}
                className="bg-red-600 text-white hover:bg-red-500 flex-1 sm:flex-none text-sm"
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingUser && (
        <UserEditModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
          user={editingUser}
        />
      )}
    </div>
  );
};