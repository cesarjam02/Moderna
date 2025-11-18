import { CreatePermisoDTO, Permiso, UserRole, Aprobacion } from '@/types';
import type { PermisoService } from './PermisoService';

// --- Base de datos simulada ---
const MOCK_PERMISOS: Permiso[] = [];
let nextId = 1;

// --- Helpers de simulación ---

const createAprobacion = (rol: UserRole): Aprobacion => ({
  id: crypto.randomUUID(),
  rolFirmante: rol,
  estado: 'PENDIENTE',
});

const getNextRolToSign = (permiso: Permiso): UserRole | null => {
  const next = permiso.aprobaciones.find(a => a.estado === 'PENDIENTE');
  return next?.rolFirmante ?? null;
};

// --- Servicio Mock ---

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
    
    const numero = String(nextId++).padStart(6, '0');
    
    // Simula la cadena de aprobación
    const aprobaciones: Aprobacion[] = [
      createAprobacion('SOLICITANTE'),
      ...input.personalAutorizado.map(() => createAprobacion('TRABAJADOR')),
      createAprobacion('APROBADOR_HSEQ'),
      createAprobacion('APROBADOR_AREA'),
    ];

    // Simula la aprobación médica condicional (Req #9)
    const necesitaAptitudMedica = !input.tiposTrabajo.some(t => 
      ['FRIO', 'IZAJES', 'EXCAVACIONES'].includes(t)
    );

    // Solo crear monitoreo si se seleccionó ESPACIOS_CONFINADOS
    const tieneEspaciosConfinados = input.tiposTrabajo.includes('ESPACIOS_CONFINADOS');

    const nuevoPermiso: Permiso = {
      id: crypto.randomUUID(),
      numero: numero,
      estado: 'PENDIENTE',
      solicitanteId: 'user-solicitante-mock-id', // Asumido
      fechaSolicitud: new Date().toISOString(),
      ...input,
      
      // Simula subida de archivos (Req #8)
      documentos: input.documentos.map(d => ({
        id: crypto.randomUUID(),
        tipo: d.tipo,
        nombreArchivo: d.file.name,
        url: `/mock/uploads/${d.file.name}`,
      })),
      
      aprobaciones,
      aprobacionMedica: necesitaAptitudMedica 
        ? createAprobacion('DOCTORA') 
        : null,
      monitoreo: tieneEspaciosConfinados ? createAprobacion('INSPECTOR') : null,
    };

    MOCK_PERMISOS.push(nuevoPermiso);
    return JSON.parse(JSON.stringify(nuevoPermiso));
  }

  async firmar(id: string): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 400));
    const permiso = MOCK_PERMISOS.find(p => p.id === id);
    if (!permiso) throw new Error('Permiso no encontrado');

    const nextRol = getNextRolToSign(permiso);
    if (!nextRol) throw new Error('No hay más firmas pendientes');

    const aprobacion = permiso.aprobaciones.find(
      a => a.rolFirmante === nextRol && a.estado === 'PENDIENTE'
    );
    
    if (aprobacion) {
      aprobacion.estado = 'FIRMADO';
      aprobacion.fechaFirma = new Date().toISOString();
      aprobacion.usuarioFirma = { id: 'mock-user-id', nombre: 'Usuario Mock' };
    }

    // Si ya no quedan firmas, activar permiso
    if (!getNextRolToSign(permiso)) {
      permiso.estado = 'ACTIVO';
    }
    
    return JSON.parse(JSON.stringify(permiso));
  }

  async firmarAptitudMedica(id: string): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 400));
    const permiso = MOCK_PERMISOS.find(p => p.id === id);
    if (!permiso) throw new Error('Permiso no encontrado');
    if (!permiso.aprobacionMedica) throw new Error('Este permiso no requiere aptitud médica');
    
    permiso.aprobacionMedica.estado = 'FIRMADO';
    permiso.aprobacionMedica.fechaFirma = new Date().toISOString();
    permiso.aprobacionMedica.usuarioFirma = { id: 'mock-doctora-id', nombre: 'Doctora Mock' };
    
    return JSON.parse(JSON.stringify(permiso));
  }

  async aplazar(id: string, motivo: string): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 300));
    const permiso = MOCK_PERMISOS.find(p => p.id === id);
    if (!permiso) throw new Error('Permiso no encontrado');
    
    permiso.estado = 'APLAZADO';
    // En una app real, guardaríamos el 'motivo' en algún lado.
    
    return JSON.parse(JSON.stringify(permiso));
  }

  async completarMonitoreo(id: string): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 400));
    const permiso = MOCK_PERMISOS.find(p => p.id === id);
    if (!permiso) throw new Error('Permiso no encontrado');
    if (permiso.estado !== 'ACTIVO') throw new Error('El permiso debe estar activo');
    if (!permiso.monitoreo) throw new Error('Este permiso no requiere monitoreo continuo');
    
    permiso.monitoreo.estado = 'FIRMADO';
    permiso.monitoreo.fechaFirma = new Date().toISOString();
    permiso.monitoreo.usuarioFirma = { id: 'mock-inspector-id', nombre: 'Inspector Mock' };
    permiso.estado = 'CERRADO';
    
    return JSON.parse(JSON.stringify(permiso));
  }

  async descargarPDF(id: string): Promise<Blob> {
    await new Promise(res => setTimeout(res, 300));
    const permiso = MOCK_PERMISOS.find(p => p.id === id);
    if (!permiso) throw new Error('Permiso no encontrado');
    
    // Verificar que todas las aprobaciones principales estén firmadas
    const todasFirmadas = permiso.aprobaciones.every(a => a.estado === 'FIRMADO');
    const aptitudMedicaFirmada = !permiso.aprobacionMedica || permiso.aprobacionMedica.estado === 'FIRMADO';
    
    if (!todasFirmadas || !aptitudMedicaFirmada) {
      throw new Error('El permiso debe estar completamente aprobado para descargarlo');
    }
    
    // Simular generación de PDF
    const pdfContent = `PERMISO DE TRABAJO N° ${permiso.numero}\n\n${JSON.stringify(permiso, null, 2)}`;
    return new Blob([pdfContent], { type: 'application/pdf' });
  }
}