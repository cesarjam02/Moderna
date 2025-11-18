import { CreatePermisoDTO, Permiso } from '@/types';

export interface PermisoService {
  list(filtros: any): Promise<Permiso[]>;
  getById(id: string): Promise<Permiso>;
  create(input: CreatePermisoDTO): Promise<Permiso>;

  // Acciones del flujo de trabajo
  firmar(id: string): Promise<Permiso>;
  firmarAptitudMedica(id: string): Promise<Permiso>;
  aplazar(id: string, motivo: string): Promise<Permiso>;
  completarMonitoreo(id: string): Promise<Permiso>;
  descargarPDF(id: string): Promise<Blob>;
}