import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useState } from 'preact/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/Button';
import logoImage from '@/images/logoblanco.png';

export const Navbar: FunctionalComponent = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

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
            {/* Info de Usuario - Responsive */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
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