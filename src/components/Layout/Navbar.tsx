import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useState } from 'preact/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/Button';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationsDropdown } from '@/components/Notifications/NotificationsDropdown';
import logoImage from '@/images/logoblanco.png';

export const Navbar: FunctionalComponent = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    await logout();
    route('/');
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-rojo-moderna text-white shadow-lg sticky top-0 z-30">
      {/* Logo y Título */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <img
          src={logoImage}
          alt="Moderna Alimentos"
          className="h-8 sm:h-10 w-auto object-contain flex-shrink-0"
        />
        <span className="font-bold text-sm sm:text-base lg:text-lg truncate">
          Moderna Alimentos S.A.
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        {!isAuthenticated && (
          <>
            <a href="/" className="hidden sm:inline font-medium hover:text-red-100 transition-colors text-sm lg:text-base">Inicio</a>
            <a href="/productos" className="hidden md:inline font-medium hover:text-red-100 transition-colors text-sm lg:text-base">Productos</a>
            <a href="/nosotros" className="hidden md:inline font-medium hover:text-red-100 transition-colors text-sm lg:text-base">Nosotros</a>
            <a href="/contacto" className="hidden sm:inline font-medium hover:text-red-100 transition-colors text-sm lg:text-base">Contacto</a>
          </>
        )}

        {isAuthenticated ? (
          <>
            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                aria-label="Notificaciones"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationsDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>

            {/* Info de Usuario - Responsive */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
              >
                <span className="text-lg sm:text-xl">👤</span>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-semibold truncate max-w-[120px] lg:max-w-none">{user?.name}</span>
                  <span className="text-xs opacity-80 capitalize">{user?.role}</span>
                </div>
              </button>

              {/* Menú desplegable para móvil */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 lg:hidden">
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">👤</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white">{user?.name}</span>
                          <span className="text-xs text-gray-400 capitalize">{user?.role}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Botón Logout - Desktop */}
            <Button
              onClick={handleLogout}
              className="hidden lg:flex bg-black/30 text-white font-medium hover:bg-black/40 text-sm px-4 py-2"
            >
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <>
            {/* Botón Login */}
            <Button
              onClick={() => route('/login')}
              className="bg-white text-rojo-moderna font-bold hover:bg-gray-100 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              <span className="hidden sm:inline">Iniciar Sesión</span>
              <span className="sm:hidden">Login</span>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
};