import { FunctionalComponent } from 'preact';
import { useAuth } from '@/contexts/AuthContext';

export const Layout: FunctionalComponent<{ children: preact.ComponentChildren }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Usamos gris-900 para un look oscuro más suave y gris-100 para el claro
  const themeClass = isAuthenticated
    ? 'bg-gray-900 text-gray-100' // Tema Oscuro
    : 'bg-gray-100 text-gray-900'; // Tema Claro

  return (
    <div className={`min-h-screen ${themeClass}`}>
      {children}
    </div>
  );
};