import { CreatePermisoDTO, Permiso, UserRole, Aprobacion, LecturaGases } from '@/types';
import type { PermisoService } from './PermisoService';

const MOCK_PERMISOS: Permiso[] = [];
let nextId = 1;

const createAprobacion = (rol: UserRole): Aprobacion => ({
  id: crypto.randomUUID(),
  rolFirmante: rol,
  estado: 'PENDIENTE',
});

const getNextRolToSign = (permiso: Permiso): UserRole | null => {
  const next = permiso.aprobaciones.find(a => a.estado === 'PENDIENTE');
  return next?.rolFirmante ?? null;
};

export class MockPermisoService implements PermisoService {
  async list(filtros: any): Promise<Permiso[]> {
    await new Promise(res => setTimeout(res, 300));
    return JSON.parse(JSON.stringify(MOCK_PERMISOS));
  }

  async getById(id: string): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 200));
    const permiso = MOCK_PERMISOS.find(p => p.id === id);
    if (!permiso) throw new Error('Permiso no encontrado');
    return JSON.parse(JSON.stringify(permiso));
  }

  async create(input: CreatePermisoDTO): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 500));

    const solicitanteId = 'u2'; 
    const solicitanteNombre = 'Jorge (Solicitante)';

    const newPermiso: Permiso = {
      id: String(nextId++),
      numero: `P-${String(nextId).padStart(5, '0')}`,
      estado: 'PENDIENTE',
      solicitanteId: solicitanteId,
      solicitante: { id: solicitanteId, nombre: solicitanteNombre },
      fechaSolicitud: new Date().toISOString(),
      ...input,
      ats: {
        id: crypto.randomUUID(),
        ...input.ats
      },
      documentos: input.documentos.map(d => ({
        id: crypto.randomUUID(),
        tipo: d.tipo,
        nombreArchivo: d.file.name,
        url: URL.createObjectURL(d.file), 
      })),
      aprobaciones: [
        createAprobacion('SOLICITANTE'),
        createAprobacion('TRABAJADOR'),
        createAprobacion('APROBADOR_HSEQ'),
        createAprobacion('APROBADOR_AREA'),
      ],
      aprobacionMedica: input.tiposTrabajo.includes('ALTURAS') ? createAprobacion('DOCTORA') : null,
      monitoreo: input.tiposTrabajo.includes('ESPACIOS_CONFINADOS') ? { ...createAprobacion('INSPECTOR') } : null,
    };

    MOCK_PERMISOS.push(newPermiso);
    return JSON.parse(JSON.stringify(newPermiso));
  }

  async firmar(id: string, firmaUrl: string): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 400));
    const permiso = MOCK_PERMISOS.find(p => p.id === id);
    if (!permiso) throw new Error('Permiso no encontrado');

    const nextRole = getNextRolToSign(permiso);
    if (!nextRole) throw new Error('No hay aprobaciones pendientes');

    const aprobacion = permiso.aprobaciones.find(a => a.rolFirmante === nextRole);
    if (aprobacion) {
      aprobacion.estado = 'FIRMADO';
      aprobacion.fechaFirma = new Date().toISOString();
      aprobacion.usuarioFirma = { id: `mock-${nextRole}-id`, nombre: `Firma ${nextRole}` };
      aprobacion.firmaUrl = firmaUrl;
    }
    
    const allSigned = permiso.aprobaciones.every(a => a.estado === 'FIRMADO');
    const medSigned = !permiso.aprobacionMedica || permiso.aprobacionMedica.estado === 'FIRMADO';
    const monSigned = !permiso.monitoreo || permiso.monitoreo.estado === 'FIRMADO';
    
    if(allSigned && medSigned && monSigned) {
      permiso.estado = 'ACTIVO';
    }

    return JSON.parse(JSON.stringify(permiso));
  }

  async firmarAptitudMedica(id: string, firmaUrl: string): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 400));
    const permiso = MOCK_PERMISOS.find(p => p.id === id);
    if (!permiso) throw new Error('Permiso no encontrado');
    if (!permiso.aprobacionMedica) throw new Error('Este permiso no requiere aprobación médica');

    permiso.aprobacionMedica.estado = 'FIRMADO';
    permiso.aprobacionMedica.fechaFirma = new Date().toISOString();
    permiso.aprobacionMedica.usuarioFirma = { id: 'mock-doctora-id', nombre: 'Doctora Mock' };
    permiso.aprobacionMedica.firmaUrl = firmaUrl;

    const allSigned = permiso.aprobaciones.every(a => a.estado === 'FIRMADO');
    const monSigned = !permiso.monitoreo || permiso.monitoreo.estado === 'FIRMADO';

    if(allSigned && monSigned) {
      permiso.estado = 'ACTIVO';
    }

    return JSON.parse(JSON.stringify(permiso));
  }

  async aplazar(id: string, motivo: string): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 400));
    const permiso = MOCK_PERMISOS.find(p => p.id === id);
    if (!permiso) throw new Error('Permiso no encontrado');
    permiso.estado = 'APLAZADO';
    return JSON.parse(JSON.stringify(permiso));
  }

  async completarMonitoreo(id: string, firmaUrl: string, lecturaInicial: LecturaGases, lecturaPeriodica: LecturaGases | null): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 400));
    const permiso = MOCK_PERMISOS.find(p => p.id === id);
    if (!permiso) throw new Error('Permiso no encontrado');
    if (!permiso.monitoreo) throw new Error('Este permiso no requiere monitoreo');

    permiso.monitoreo.estado = 'FIRMADO';
    permiso.monitoreo.fechaFirma = new Date().toISOString();
    permiso.monitoreo.usuarioFirma = { id: 'mock-inspector-id', nombre: 'Inspector Mock' };
    permiso.monitoreo.firmaUrl = firmaUrl;
    permiso.monitoreo.lecturaInicial = lecturaInicial;
    permiso.monitoreo.lecturaPeriodica = lecturaPeriodica || undefined;

    const allSigned = permiso.aprobaciones.every(a => a.estado === 'FIRMADO');
    const medSigned = !permiso.aprobacionMedica || permiso.aprobacionMedica.estado === 'FIRMADO';
    
    if(allSigned && medSigned) {
      permiso.estado = 'ACTIVO';
    }

    return JSON.parse(JSON.stringify(permiso));
  }

  async cerrarPermiso(id: string, observaciones: string, firmaUrl: string): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 400));
    const permiso = MOCK_PERMISOS.find(p => p.id === id);
    if (!permiso) throw new Error('Permiso no encontrado');
    
    permiso.estado = 'CERRADO';
    permiso.observacionesCierre = observaciones;
    
    const liderAprobacion = permiso.aprobaciones.find(a => a.rolFirmante === 'LIDER');
    if (liderAprobacion) {
        liderAprobacion.estado = 'FIRMADO';
        liderAprobacion.fechaFirma = new Date().toISOString();
        liderAprobacion.usuarioFirma = { id: 'mock-lider-id', nombre: 'Lider Cierre Mock' };
        liderAprobacion.firmaUrl = firmaUrl;
    } else {
        permiso.aprobaciones.push({
          id: crypto.randomUUID(),
          rolFirmante: 'LIDER',
          estado: 'FIRMADO',
          fechaFirma: new Date().toISOString(),
          usuarioFirma: { id: 'mock-lider-id', nombre: 'Lider Cierre Mock' },
          firmaUrl: firmaUrl,
        });
    }

    return JSON.parse(JSON.stringify(permiso));
  }
}