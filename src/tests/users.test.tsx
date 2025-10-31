import { render, screen } from '@testing-library/preact';
import { UsersPage } from '@/pages/UsersPage';

vi.mock('@/hooks/useUsers', () => ({
  useUsers: () => ({ data: [{ id: '1', name: 'Test', email: 't@e.co', role: 'user', active: true, createdAt: '' }], loading: false, error: null, remove: vi.fn() })
}));

it('renderiza usuarios', () => {
  render(<UsersPage />);
  expect(screen.getByText(/Usuarios/)).toBeTruthy();
  expect(screen.getByText(/Test/)).toBeTruthy();
});