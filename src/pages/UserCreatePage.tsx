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
    <form
      onSubmit={onSubmit}
      className="max-w-xl p-8 bg-gray-800 rounded-lg border border-gray-700 space-y-4"
    >
      <h2 className="text-2xl font-bold">Crear usuario</h2>
      <label className="block">
        <span className="block text-sm font-medium text-gray-300 mb-1">Nombre</span>
        <Input
          value={name}
          onInput={(e: any) => setName(e.currentTarget.value)}
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-gray-300 mb-1">Email</span>
        <Input
          type="email"
          value={email}
          onInput={(e: any) => setEmail(e.currentTarget.value)}
        />
      </label>
      <Button
        type="submit"
        className="w-full bg-rojo-moderna text-white hover:bg-rojo-moderna-dark"
      >
        Guardar
      </Button>
    </form>
  );
};