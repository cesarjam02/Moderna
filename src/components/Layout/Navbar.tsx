import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/Button';
import logoImage from '@/images/logoblanco.png';

export const Navbar: FunctionalComponent = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    route('/');
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-rojo-moderna text-white shadow-lg">
      {/* Logo y Título */}
      <div className="flex items-center gap-4">
        <img
          src={logoImage}
          alt="Moderna Alimentos"
          className="h-10 w-auto object-contain"
        />
        <span className="font-bold text-lg">Moderna Alimentos S.A.</span>
      </div>

      {/* Navegación */}
      <nav className="flex items-center gap-6">
        {!isAuthenticated && (
          <>
            <a href="/" className="font-medium hover:text-red-100 transition-colors">Inicio</a>
            <a href="/productos" className="font-medium hover:text-red-100 transition-colors">Productos</a>
            <a href="/nosotros" className="font-medium hover:text-red-100 transition-colors">Nosotros</a>
            <a href="/contacto" className="font-medium hover:text-red-100 transition-colors">Contacto</a>
          </>
        )}

        {isAuthenticated ? (
          <>
            {/* Info de Usuario */}
            <div className="flex items-center gap-3 px-4 py-2 bg-black/20 rounded-lg">
              <span className="text-xl">👤</span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user?.name}</span>
                <span className="text-xs opacity-80 capitalize">({user?.role})</span>
              </div>
            </div>
            
            {/* Botón Logout */}
            <Button
              onClick={handleLogout}
              className="bg-black/30 text-white font-medium hover:bg-black/40"
            >
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <>
            {/* Botón Login */}
            <Button
              onClick={() => route('/login')}
              className="bg-white text-rojo-moderna font-bold hover:bg-gray-100"
            >
              Iniciar Sesión
            </Button>
          </>
        )}
      </nav>
    </header>
  );
};