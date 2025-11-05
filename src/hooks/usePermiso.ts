import { useCallback } from 'preact/hooks';
import { Services } from '@/services';
import { Permiso } from '@/types';
import { useAsync } from './useAsync';

export function usePermiso(id: string | null) {
  const detailState = useAsync<Permiso>(
    () => (id ? Services.permisos.getById(id) : Promise.resolve(null)),
    [id]
  );

  const firmarPermiso = useCallback(async () => {
    if (!id) return;
    const updated = await Services.permisos.firmar(id);
    detailState.setData(updated); // Optimistic update
    await detailState.refetch();
    return updated;
  }, [id, detailState.refetch, detailState.setData]);

  const firmarAptitudMedica = useCallback(async () => {
    if (!id) return;
    const updated = await Services.permisos.firmarAptitudMedica(id);
    detailState.setData(updated);
    await detailState.refetch();
    return updated;
  }, [id, detailState.refetch, detailState.setData]);

  const aplazarPermiso = useCallback(
    async (motivo: string) => {
      if (!id) return;
      const updated = await Services.permisos.aplazar(id, motivo);
      detailState.setData(updated);
      await detailState.refetch();
      return updated;
    },
    [id, detailState.refetch, detailState.setData]
  );

  const completarMonitoreo = useCallback(async () => {
    if (!id) return;
    const updated = await Services.permisos.completarMonitoreo(id);
    detailState.setData(updated);
    await detailState.refetch();
    return updated;
  }, [id, detailState.refetch, detailState.setData]);

  return {
    ...detailState,
    firmarPermiso,
    firmarAptitudMedica,
    aplazarPermiso,
    completarMonitoreo,
  };
}