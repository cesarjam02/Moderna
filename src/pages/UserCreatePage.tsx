import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { useUsers } from '@/hooks/useUsers';
import { Input } from '@/components/UI/Input';
import { Button } from '@/components/UI/Button';

export const UserCreatePage: FunctionalComponent<{ path?: string }> = () => {
  const { create } = useUsers();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  async function onSubmit(e: Event) {
    e.preventDefault();
    await create({ name, email });
    alert('Usuario creado (mock/API)');
    setName('');
    setEmail('');
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 400, display: 'grid', gap: '.75rem' }}>
      <h2>Crear usuario</h2>
      <label>
        Nombre
        <input value={name} onInput={(e: any) => setName(e.currentTarget.value)} />
      </label>
      <label>
        Email
        <input type="email" value={email} onInput={(e: any) => setEmail(e.currentTarget.value)} />
      </label>
      <button type="submit">Guardar</button>
    </form>
  );
};