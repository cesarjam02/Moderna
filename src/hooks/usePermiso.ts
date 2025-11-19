import { useCallback } from 'preact/hooks';
import { Services } from '@/services';
import { Permiso, LecturaGases } from '@/types';
import { useAsync } from './useAsync';

export function usePermiso(id: string | null) {
  const detailState = useAsync<Permiso>(
    () => (id ? Services.permisos.getById(id) : Promise.resolve(null)),
    [id]
  );

  const updateLocalState = (updatedPermiso: Permiso) => {
    detailState.setData(updatedPermiso);
    window.dispatchEvent(new CustomEvent('permiso-updated'));
  };

  const firmarPermiso = useCallback(async (firmaUrl: string) => {
    if (!id) return;
    const updated = await Services.permisos.firmar(id, firmaUrl);
    updateLocalState(updated);
    return updated;
  }, [id, detailState.setData]);

  const firmarAptitudMedica = useCallback(async (firmaUrl: string) => {
    if (!id) return;
    const updated = await Services.permisos.firmarAptitudMedica(id, firmaUrl);
    updateLocalState(updated);
    return updated;
  }, [id, detailState.setData]);

  const aplazarPermiso = useCallback(async (motivo: string) => {
    if (!id) return;
    const updated = await Services.permisos.aplazar(id, motivo);
    updateLocalState(updated);
    return updated;
  }, [id, detailState.setData]);

  const completarMonitoreo = useCallback(async () => {
      return undefined;
  }, []);

  const cerrarPermiso = useCallback(async (observaciones: string, firmaUrl: string) => {
    if (!id) return;
    const updated = await Services.permisos.cerrarPermiso(id, observaciones, firmaUrl);
    updateLocalState(updated);
    return updated;
  }, [id, detailState.setData]);

  // ACTUALIZADO: Soporta 3 lecturas
  const firmarEtapaCierre = useCallback(async (firmaUrl: string, l1?: LecturaGases, l2?: LecturaGases, l3?: LecturaGases) => {
    if (!id) return;
    const updated = await Services.permisos.firmarCierre(id, firmaUrl, l1, l2, l3);
    updateLocalState(updated);
    return updated;
  }, [id, detailState.setData]);

  return {
    ...detailState,
    firmarPermiso,
    firmarAptitudMedica,
    aplazarPermiso,
    completarMonitoreo,
    cerrarPermiso,
    firmarEtapaCierre
  };
}