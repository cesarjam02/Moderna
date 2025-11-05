import { useCallback, useMemo } from 'preact/hooks';
import { Services } from '@/services';
import { CreatePermisoDTO, Permiso } from '@/types';
import { useAsync } from './useAsync';

// NOTE: We pass filters as a dependency to useAsync
export function usePermisos(filtros: any) {
  const filtroDeps = useMemo(() => JSON.stringify(filtros), [filtros]);

  const listState = useAsync<Permiso[]>(
    () => Services.permisos.list(filtros),
    [filtroDeps]
  );

  const create = useCallback(
    async (input: CreatePermisoDTO) => {
      const created = await Services.permisos.create(input);
      await listState.refetch();
      return created;
    },
    [listState.refetch]
  );

  return { ...listState, create };
}