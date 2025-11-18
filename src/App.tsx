import { Router } from 'preact-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout/Container';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';

// --- (NUEVO) Importar el protector de rutas ---
import { ProtectedRoute } from '@/router/ProtectedRoute';

// --- Páginas existentes ---
import { Home } from '@/pages/Home';
import { LoginPage } from '@/pages/LoginPage';
import { UsersPage } from '@/pages/UsersPage';
import { UserCreatePage } from '@/pages/UserCreatePage';

// --- Páginas de Permisos ---
import { PermisosPage } from '@/pages/PermisosPage';
import { PermisoCreatePage } from '@/pages/PermisoCreatePage';
import { PermisoDetailPage } from '@/pages/PermisoDetailPage';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  // Si no está autenticado, mostrar solo el contenido público
  if (!isAuthenticated) {
    return (
      <Layout>
        <main className="min-h-screen">
          <Router>
            <Home path="/" />
            <LoginPage path="/login" />
          </Router>
        </main>
      </Layout>
    );
  }

  // Si está autenticado, mostrar el layout del dashboard
  return (
    <Layout>
      <Navbar />
      {/* NOTE: La 'calculación' de altura es necesaria para que 
        el sidebar y el main ocupen el resto de la pantalla 
        después del Navbar de 64px (h-16).
      */}
      <div className="flex relative" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full lg:w-auto">
          <Router>
            <Home path="/" />
            
            {/* --- Rutas de Permisos (Protegidas) --- */}
            <ProtectedRoute 
              path="/permisos" 
              component={PermisosPage} 
              roles={['admin', 'LIDER', 'APROBADOR_HSEQ', 'APROBADOR_AREA', 'SOLICITANTE', 'TRABAJADOR', 'DOCTORA', 'INSPECTOR', 'user', 'manager']} 
            />
            <ProtectedRoute 
              path="/permisos/nuevo" 
              component={PermisoCreatePage} 
              // Solo admin, solicitantes y usuarios base pueden crear
              roles={['admin', 'SOLICITANTE', 'user']} 
            />
            <ProtectedRoute 
              path="/permisos/:id" 
              component={PermisoDetailPage} 
              // Todos los roles involucrados pueden ver un permiso
              roles={['admin', 'LIDER', 'APROBADOR_HSEQ', 'APROBADOR_AREA', 'SOLICITANTE', 'TRABAJADOR', 'DOCTORA', 'INSPECTOR', 'user', 'manager']} 
            />
            
            {/* --- Rutas de Admin (Protegidas) --- */}
            <ProtectedRoute 
              path="/users" 
              component={UsersPage} 
              roles={['admin', 'manager']} 
            />
            <ProtectedRoute 
              path="/users/new" 
              component={UserCreatePage} 
              roles={['admin']} 
            />
            
          </Router>
        </main>
      </div>
    </Layout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}