import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/Button';

export const Navbar: FunctionalComponent = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    route('/');
  };

  return (
    <header
      style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        backgroundColor: '#d32f2f', // rojo moderno
        color: 'white',
        borderBottom: '2px solid #b71c1c',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        Moderna Alimentos S.A.
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <NavLink href="/">Inicio</NavLink>
        <NavLink href="/productos">Productos</NavLink>
        <NavLink href="/nosotros">Nosotros</NavLink>
        <NavLink href="/contacto">Contacto</NavLink>
        {isAuthenticated ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                fontSize: '0.9rem',
              }}
            >
              <span>👤</span>
              <span>{user?.name}</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  opacity: 0.8,
                  textTransform: 'capitalize',
                }}
              >
                ({user?.role})
              </span>
            </div>
            <Button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <Button
            onClick={() => route('/login')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ffffff',
              color: '#d32f2f',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Iniciar Sesión
          </Button>
        )}
      </nav>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  children: preact.ComponentChildren;
}

const NavLink: FunctionalComponent<NavLinkProps> = ({ href, children }) => (
  <a
    href={href}
    style={{
      color: 'white',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: '0.95rem',
      transition: 'opacity 0.2s ease-in-out',
    }}
    onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
    onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
  >
    {children}
  </a>
);
