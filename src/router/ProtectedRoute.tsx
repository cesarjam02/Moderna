import { FunctionalComponent } from 'preact';
import { route } from 'preact-router';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  path: string;
  component: FunctionalComponent<any>;
  roles: UserRole[]; // Los roles que SÍ tienen acceso
}

export const ProtectedRoute: FunctionalComponent<ProtectedRouteProps> = ({ component: Component, roles, ...rest }) => {
  const { user, loading, hasAnyRole } = useAuth();

  if (loading) {
    // AppContent ya muestra un "Cargando..." global
    return null;
  }

  if (!user || !hasAnyRole(roles)) {
    // Si no está logueado o no tiene el rol, redirige al Home
    // Usamos 'true' para reemplazar la entrada del historial
    route('/', true);
    return null;
  }

  // Si tiene el rol, muestra la página solicitada
  return <Component {...rest} />;
};