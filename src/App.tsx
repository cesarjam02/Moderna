import { Router } from 'preact-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout/Container';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Home } from '@/pages/Home';
import { LoginPage } from '@/pages/LoginPage';
import { UsersPage } from '@/pages/UsersPage';
import { UserCreatePage } from '@/pages/UserCreatePage';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Cargando...</div>
      </div>
    );
  }

  // Si no está autenticado, mostrar solo el contenido sin Navbar ni Sidebar
  if (!isAuthenticated) {
    return (
      <Layout>
        <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
          <Router>
            <Home path="/" />
            <LoginPage path="/login" />
          </Router>
        </main>
      </Layout>
    );
  }

  // Si está autenticado, mostrar Navbar y Sidebar
  return (
    <Layout>
      <Navbar />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '1rem', backgroundColor: 'transparent' }}>
          <Router>
            <Home path="/" />
            <UsersPage path="/users" />
            <UserCreatePage path="/users/new" />
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