import { createContext } from 'preact';
import { useContext, useState, useEffect, useCallback } from 'preact/hooks';
import { Services } from '@/services';
import { AuthState, LoginDTO, User } from '@/types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  hasRole: (role: User['role']) => boolean;
  hasAnyRole: (roles: User['role'][]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: preact.ComponentChildren }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await Services.auth.getCurrentUser();
        if (response) {
          // Asegurar que siempre tenga roles inicializados
          const userWithRoles = {
            ...response.user,
            roles: response.user.roles && response.user.roles.length > 0 
              ? response.user.roles 
              : [response.user.role],
          };
          setAuthState({
            user: userWithRoles,
            token: response.token,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Escuchar eventos de actualización de usuario para refrescar el usuario logueado
  useEffect(() => {
    const handleUserUpdated = async () => {
      try {
        const response = await Services.auth.getCurrentUser();
        if (response) {
          // Asegurar que siempre tenga roles inicializados
          const userWithRoles = {
            ...response.user,
            roles: response.user.roles && response.user.roles.length > 0 
              ? response.user.roles 
              : [response.user.role],
          };
          setAuthState(prev => ({
            ...prev,
            user: userWithRoles,
          }));
        }
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
      }
    };
    
    window.addEventListener('user-updated', handleUserUpdated);
    return () => {
      window.removeEventListener('user-updated', handleUserUpdated);
    };
  }, []);

  const login = useCallback(async (credentials: LoginDTO) => {
    try {
      const response = await Services.auth.login(credentials);
      // Asegurar que siempre tenga roles inicializados
      const userWithRoles = {
        ...response.user,
        roles: response.user.roles && response.user.roles.length > 0 
          ? response.user.roles 
          : [response.user.role],
      };
      setAuthState({
        user: userWithRoles,
        token: response.token,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await Services.auth.logout();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }, []);

  const hasRole = useCallback(
    (role: User['role']) => {
      if (!authState.user) return false;
      // Verificar en roles múltiples si existen
      if (authState.user.roles && authState.user.roles.length > 0) {
        return authState.user.roles.includes(role);
      }
      return authState.user.role === role;
    },
    [authState.user]
  );

  const hasAnyRole = useCallback(
    (roles: User['role'][]) => {
      if (!authState.user) return false;
      // Verificar en roles múltiples si existen
      if (authState.user.roles && authState.user.roles.length > 0) {
        return roles.some(role => authState.user!.roles!.includes(role));
      }
      return roles.includes(authState.user.role);
    },
    [authState.user]
  );

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        loading,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}

