import { useCallback } from 'preact/hooks';
import { Services } from '@/services';
import { CreateUserDTO, UpdateUserDTO, User } from '@/types';
import { useAsync } from './useAsync';

export function useUsers() {
  const listState = useAsync<User[]>(() => Services.users.list(), []);

  const create = useCallback(async (input: CreateUserDTO) => {
    const created = await Services.users.create(input);
    await listState.refetch();     
    return created;
  }, [listState.refetch]);

  const update = useCallback(async (id: string, input: UpdateUserDTO) => {
    const updated = await Services.users.update(id, input);
    await listState.refetch();     
    return updated;
  }, [listState.refetch]);

  const remove = useCallback(async (id: string) => {
    const res = await Services.users.remove(id);
    await listState.refetch();     
    return res;
  }, [listState.refetch]);

  return { ...listState, create, update, remove };
}
