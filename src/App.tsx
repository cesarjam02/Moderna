import { Router } from 'preact-router';
import { Layout } from '@/components/Layout/Container';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Home } from '@/pages/Home';
import { UsersPage } from '@/pages/UsersPage';
import { UserCreatePage } from '@/pages/UserCreatePage';

export function App() {
  return (
    <Layout>
      <Navbar />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '1rem' }}>
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