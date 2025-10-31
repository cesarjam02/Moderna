import { Link } from 'preact-router/match';

export function Sidebar() {
  return (
    <aside style={{ width: 220, borderRight: '1px solid #eee', padding: '1rem' }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '.5rem' }}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/users">Users</Link></li>
          <li><Link href="/users/new">Create User</Link></li>
        </ul>
      </nav>
    </aside>
  );
}