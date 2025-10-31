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
          setAuthState({
            user: response.user,
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

  const login = useCallback(async (credentials: LoginDTO) => {
    try {
      const response = await Services.auth.login(credentials);
      setAuthState({
        user: response.user,
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
      return authState.user?.role === role;
    },
    [authState.user]
  );

  const hasAnyRole = useCallback(
    (roles: User['role'][]) => {
      return authState.user ? roles.includes(authState.user.role) : false;
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

