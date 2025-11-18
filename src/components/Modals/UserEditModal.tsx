import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { User, UserRole } from '@/types';

// Lista de todos los roles disponibles
const ROLES: UserRole[] = [
  'admin',
  'manager',
  'user',
  'SOLICITANTE',
  'TRABAJADOR',
  'APROBADOR_HSEQ',
  'APROBADOR_AREA',
  'DOCTORA',
  'INSPECTOR',
  'LIDER'
];

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: { name?: string; email?: string; role?: UserRole; active?: boolean }) => Promise<void>;
  user: User | null;
}

export const UserEditModal: FunctionalComponent<UserEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setActive(user.active);
      setError('');
    }
  }, [isOpen, user]);

  if (!isOpen || !user) {
    return null;
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validación básica
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      setError('El email es obligatorio');
      setLoading(false);
      return;
    }
    if (!role) {
      setError('Debe seleccionar un rol');
      setLoading(false);
      return;
    }

    try {
      await onSave(user.id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        active,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">Editar Usuario</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="block text-sm font-medium text-gray-300 mb-1">
              Nombre <span className="text-red-400">*</span>
            </span>
            <Input
              value={name}
              onInput={(e: any) => setName(e.currentTarget.value)}
              placeholder="Nombre completo del usuario"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-300 mb-1">
              Email <span className="text-red-400">*</span>
            </span>
            <Input
              type="email"
              value={email}
              onInput={(e: any) => setEmail(e.currentTarget.value)}
              placeholder="usuario@ejemplo.com"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-300 mb-1">
              Rol <span className="text-red-400">*</span>
            </span>
            <select
              value={role}
              onInput={(e: any) => setRole(e.currentTarget.value as UserRole)}
              className="w-full py-2 px-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-rojo-moderna"
              required
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={active}
              onChange={(e: any) => setActive(e.currentTarget.checked)}
              className="h-5 w-5 rounded text-rojo-moderna bg-gray-600 border-gray-500 focus:ring-rojo-moderna"
            />
            <span className="text-sm font-medium text-gray-300">Usuario activo</span>
          </label>

          <div className="flex gap-4 justify-end pt-4 border-t border-gray-700">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white hover:bg-gray-500 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-rojo-moderna text-white hover:bg-rojo-moderna-dark px-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

