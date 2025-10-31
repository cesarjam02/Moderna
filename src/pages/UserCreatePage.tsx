import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/UI/Input';
import { Button } from '@/components/UI/Button';

export const UserCreatePage: FunctionalComponent<{ path?: string }> = () => {
  const { create } = useUsers();
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const textColor = isAuthenticated ? '#ffffff' : '#1a1a1a';

  async function onSubmit(e: Event) {
    e.preventDefault();
    await create({ name, email });
    alert('Usuario creado (mock/API)');
    setName('');
    setEmail('');
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: 400,
        display: 'grid',
        gap: '.75rem',
        padding: '1.5rem',
        backgroundColor: isAuthenticated ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        borderRadius: '12px',
        border: isAuthenticated ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #eee',
      }}
    >
      <h2 style={{ color: textColor, margin: '0 0 1rem 0' }}>Crear usuario</h2>
      <label style={{ color: textColor, display: 'grid', gap: '0.5rem' }}>
        Nombre
        <input
          value={name}
          onInput={(e: any) => setName(e.currentTarget.value)}
          style={{
            padding: '0.5rem',
            border: isAuthenticated ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #ddd',
            borderRadius: '6px',
            backgroundColor: isAuthenticated ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
            color: textColor,
          }}
        />
      </label>
      <label style={{ color: textColor, display: 'grid', gap: '0.5rem' }}>
        Email
        <input
          type="email"
          value={email}
          onInput={(e: any) => setEmail(e.currentTarget.value)}
          style={{
            padding: '0.5rem',
            border: isAuthenticated ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #ddd',
            borderRadius: '6px',
            backgroundColor: isAuthenticated ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
            color: textColor,
          }}
        />
      </label>
      <button
        type="submit"
        style={{
          padding: '0.75rem',
          backgroundColor: '#d32f2f',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Guardar
      </button>
    </form>
  );
};