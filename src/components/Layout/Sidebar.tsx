import { Link } from 'preact-router/match';
import { useState } from 'preact/hooks';
import { useAuth } from '@/contexts/AuthContext';

const baseLinkClass = "block py-2.5 px-4 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-150";
const activeLinkClass = "bg-rojo-moderna/10 text-rojo-moderna font-semibold";

export function Sidebar() {
  const { hasRole, hasAnyRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-20 left-2 sm:left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 lg:w-56
          border-r border-gray-700
          bg-gray-800
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
          p-4
          overflow-y-auto
        `}
      >
        <nav>
          <ul className="space-y-2">
            {/* 1. Home (Todos lo ven) */}
            <li>
              <Link
                href="/"
                className={baseLinkClass}
                activeClassName={activeLinkClass}
                onClick={closeSidebar}
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
                  onClick={closeSidebar}
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
                  onClick={closeSidebar}
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
                  onClick={closeSidebar}
                >
                  Create User
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
}