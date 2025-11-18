import { useCallback } from 'preact/hooks';
import { Services } from '@/services';
import { Permiso, LecturaGases } from '@/types';
import { useAsync } from './useAsync';

export function usePermiso(id: string | null) {
  const detailState = useAsync<Permiso>(
    () => (id ? Services.permisos.getById(id) : Promise.resolve(null)),
    [id]
  );

  const firmarPermiso = useCallback(async (firmaUrl: string) => {
    if (!id) return;
    const updated = await Services.permisos.firmar(id, firmaUrl);
    detailState.setData(updated);
    await detailState.refetch();
    return updated;
  }, [id, detailState.refetch, detailState.setData]);

  const firmarAptitudMedica = useCallback(async (firmaUrl: string) => {
    if (!id) return;
    const updated = await Services.permisos.firmarAptitudMedica(id, firmaUrl);
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

  const completarMonitoreo = useCallback(async (
    firmaUrl: string, 
    lecturaInicial: LecturaGases, 
    lecturaPeriodica: LecturaGases | null
  ) => {
    if (!id) return;
    const updated = await Services.permisos.completarMonitoreo(id, firmaUrl, lecturaInicial, lecturaPeriodica);
    detailState.setData(updated);
    await detailState.refetch();
    return updated;
  }, [id, detailState.refetch, detailState.setData]);

  const cerrarPermiso = useCallback(async (observaciones: string, firmaUrl: string) => {
    if (!id) return;
    const updated = await Services.permisos.cerrarPermiso(id, observaciones, firmaUrl);
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
    cerrarPermiso
  };
}