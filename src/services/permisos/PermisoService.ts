import { CreatePermisoDTO, Permiso, LecturaGases } from '@/types';

export interface PermisoService {
  list(filtros: any): Promise<Permiso[]>;
  getById(id: string): Promise<Permiso>;
  create(input: CreatePermisoDTO): Promise<Permiso>;

  firmar(id: string, firmaUrl: string): Promise<Permiso>;
  firmarAptitudMedica(id: string, firmaUrl: string): Promise<Permiso>;
  aplazar(id: string, motivo: string): Promise<Permiso>;
  completarMonitoreo(
    id: string, 
    firmaUrl: string, 
    lecturaInicial: LecturaGases, 
    lecturaPeriodica: LecturaGases | null
  ): Promise<Permiso>;
  cerrarPermiso(id: string, observaciones: string, firmaUrl: string): Promise<Permiso>;
}