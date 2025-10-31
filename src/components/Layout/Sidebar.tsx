import { Link } from 'preact-router/match';

export function Sidebar() {
  return (
    <aside
      style={{
        width: 220,
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
      }}
    >
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '.5rem' }}>
          <li>
            <Link
              href="/"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.5rem',
                borderRadius: '6px',
                display: 'block',
                transition: 'background-color 0.2s ease',
              }}
              activeStyle={{
                backgroundColor: 'rgba(211, 47, 47, 0.2)',
                color: '#d32f2f',
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/users"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.5rem',
                borderRadius: '6px',
                display: 'block',
                transition: 'background-color 0.2s ease',
              }}
              activeStyle={{
                backgroundColor: 'rgba(211, 47, 47, 0.2)',
                color: '#d32f2f',
              }}
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              href="/users/new"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.5rem',
                borderRadius: '6px',
                display: 'block',
                transition: 'background-color 0.2s ease',
              }}
              activeStyle={{
                backgroundColor: 'rgba(211, 47, 47, 0.2)',
                color: '#d32f2f',
              }}
            >
              Create User
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}