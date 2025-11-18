import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { useUsers } from '@/hooks/useUsers';
import { Input } from '@/components/UI/Input';
import { Button } from '@/components/UI/Button';
import { UserRole } from '@/types';

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

export const UserCreatePage: FunctionalComponent<{ path?: string }> = () => {
  const { create, loading } = useUsers();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState<string>('');

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!role) {
      setError('Debe seleccionar un rol');
      return;
    }

    try {
      await create({ name: name.trim(), email: email.trim(), password, role });
      alert('Usuario creado exitosamente');
      // Limpiar formulario
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      // Redirigir a la lista de usuarios
      route('/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el usuario');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Crear Nuevo Usuario</h1>
        <p className="text-gray-400 text-sm sm:text-base">Complete los datos para crear un nuevo perfil de usuario</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="p-4 sm:p-6 lg:p-8 bg-gray-800 rounded-lg border border-gray-700 space-y-6"
      >
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg">
            {error}
          </div>
        )}

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
            Contraseña <span className="text-red-400">*</span>
          </span>
          <Input
            type="password"
            value={password}
            onInput={(e: any) => setPassword(e.currentTarget.value)}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
          <p className="text-xs text-gray-400 mt-1">La contraseña debe tener al menos 6 caracteres</p>
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
            <option value="">Seleccione un rol...</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">Seleccione el rol que tendrá el usuario en el sistema</p>
        </label>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={() => route('/users')}
            className="flex-1 bg-gray-600 text-white hover:bg-gray-500"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-rojo-moderna text-white hover:bg-rojo-moderna-dark disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </div>
      </form>
    </div>
  );
};