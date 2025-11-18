import { Link } from 'preact-router/match';
import { useAuth } from '@/contexts/AuthContext';

const baseLinkClass = "block py-2.5 px-4 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-150";
const activeLinkClass = "bg-rojo-moderna/10 text-rojo-moderna font-semibold";

export function Sidebar() {
  // Usamos el hook de Auth para obtener los roles
  const { hasRole, hasAnyRole } = useAuth();

  return (
    <aside className="w-56 border-r border-gray-700 p-4 bg-gray-800">
      <nav>
        <ul className="space-y-2">
          {/* 1. Home (Todos lo ven) */}
          <li>
            <Link
              href="/"
              className={baseLinkClass}
              activeClassName={activeLinkClass}
            >
              Home
            </Link>
          </li>
          
          {/* 2. Permisos (Todos los roles del flujo lo ven) */}
          {hasAnyRole(['admin', 'LIDER', 'APROBADOR_HSEQ', 'APROBADOR_AREA', 'SOLICITANTE', 'TRABAJADOR', 'DOCTORA', 'INSPECTOR', 'user', 'manager']) && (
            <li>
              <Link
                href="/permisos"
                className={baseLinkClass}
                activeClassName={activeLinkClass}
              >
                Permisos de Trabajo
              </Link>
            </li>
          )}

          {/* 3. Users (Solo Admin y Manager) */}
          {hasAnyRole(['admin', 'manager']) && (
            <li>
              <Link
                href="/users"
                className={baseLinkClass}
                activeClassName={activeLinkClass}
              >
                Users
              </Link>
            </li>
          )}
          
          {/* 4. Create User (Solo Admin) */}
          {hasRole('admin') && (
            <li>
              <Link
                href="/users/new"
                className={baseLinkClass}
                activeClassName={activeLinkClass}
              >
                Create User
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}