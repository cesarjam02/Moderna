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
      // Forzar actualización de la lista de permisos para que las notificaciones se actualicen
      window.dispatchEvent(new CustomEvent('permiso-updated'));
      return created;
    },
    [listState.refetch]
  );

  return { ...listState, create };
}