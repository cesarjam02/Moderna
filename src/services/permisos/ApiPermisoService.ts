import { http } from '@/services/http';
import { CreatePermisoDTO, Permiso, LecturaGases } from '@/types';
import type { PermisoService } from './PermisoService';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const P_BASE = `${BASE}/permisos`;

export class ApiPermisoService implements PermisoService {
  list(filtros: any): Promise<Permiso[]> {
    const query = new URLSearchParams(filtros).toString();
    return http<Permiso[]>(`${P_BASE}?${query}`);
  }

  getById(id: string): Promise<Permiso> {
    return http<Permiso>(`${P_BASE}/${id}`);
  }

  create(input: CreatePermisoDTO): Promise<Permiso> {
    const formData = new FormData();
    
    const dataDto = { ...input, documentos: undefined };
    formData.append('data', JSON.stringify(dataDto));

    input.documentos.forEach(doc => {
      formData.append(doc.tipo, doc.file, doc.file.name);
    });

    return http<Permiso>(`${P_BASE}`, {
      method: 'POST',
      body: formData,
    });
  }

  firmar(id: string, firmaUrl: string): Promise<Permiso> {
    return http<Permiso>(`${P_BASE}/${id}/firmar`, { 
      method: 'POST',
      body: { firmaUrl } 
    });
  }

  firmarAptitudMedica(id: string, firmaUrl: string): Promise<Permiso> {
    return http<Permiso>(`${P_BASE}/${id}/firmar-medico`, { 
      method: 'POST',
      body: { firmaUrl }
    });
  }

  aplazar(id: string, motivo: string): Promise<Permiso> {
    return http<Permiso>(`${P_BASE}/${id}/aplazar`, {
      method: 'POST',
      body: { motivo },
    });
  }

  completarMonitoreo(id: string, firmaUrl: string, lecturaInicial: LecturaGases, lecturaPeriodica: LecturaGases | null): Promise<Permiso> {
    return http<Permiso>(`${P_BASE}/${id}/monitoreo`, { 
      method: 'POST',
      body: { firmaUrl, lecturaInicial, lecturaPeriodica }
    });
  }

  cerrarPermiso(id: string, observaciones: string, firmaUrl: string): Promise<Permiso> {
    return http<Permiso>(`${P_BASE}/${id}/cerrar`, { 
      method: 'POST',
      body: { observaciones, firmaUrl }
    });
  }
}