import { CreatePermisoDTO, Permiso, UserRole, Aprobacion, LecturaGases } from '@/types';
import type { PermisoService } from './PermisoService';

const MOCK_PERMISOS: Permiso[] = [];
let nextId = 1;

const createAprobacion = (rol: UserRole, asignado?: { id: string; nombre: string }): Aprobacion => ({
  id: crypto.randomUUID(),
  rolFirmante: rol,
  estado: 'PENDIENTE',
  usuarioAsignado: asignado 
});

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
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) throw new Error('Usuario no autenticado');
    const user = JSON.parse(userStr);

    const aprobaciones: Aprobacion[] = [];
    // 1. Solicitante
    aprobaciones.push(createAprobacion('SOLICITANTE', { id: user.id, nombre: user.name }));
    // 2. Trabajadores
    if (input.personalAutorizado && input.personalAutorizado.length > 0) {
      input.personalAutorizado.forEach((p) => {
        aprobaciones.push(createAprobacion('TRABAJADOR', { id: p.id || crypto.randomUUID(), nombre: `${p.nombres} ${p.apellidos}` }));
      });
    } else {
      aprobaciones.push(createAprobacion('TRABAJADOR'));
    }
    // 3. Aprobadores
    aprobaciones.push(createAprobacion('APROBADOR_HSEQ'));
    aprobaciones.push(createAprobacion('APROBADOR_AREA'));

    const newPermiso: Permiso = {
      id: String(nextId++),
      numero: `P-${String(nextId).padStart(5, '0')}`,
      estado: 'PENDIENTE',
      solicitanteId: user.id,
      solicitante: { id: user.id, nombre: user.name },
      fechaSolicitud: new Date().toISOString(),
      ...input,
      ats: { id: crypto.randomUUID(), ...input.ats, tareas: input.ats.tareas.map(t => ({ ...t, id: t.id || crypto.randomUUID() })) },
      documentos: input.documentos.map(d => ({ id: crypto.randomUUID(), ...d, url: URL.createObjectURL(d.file), personalId: d.personalId })),
      aprobaciones,
      aprobacionesCierre: [],
      aprobacionMedica: input.tiposTrabajo.includes('ALTURAS') ? createAprobacion('DOCTORA') : null,
      monitoreo: null, // Inicializado en null, se crea al cierre si es necesario
    };

    MOCK_PERMISOS.push(newPermiso);
    return JSON.parse(JSON.stringify(newPermiso));
  }

  async firmar(id: string, firmaUrl: string): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 400));
    const pIdx = MOCK_PERMISOS.findIndex(p => p.id === id);
    if (pIdx === -1) throw new Error('Permiso no encontrado');
    const permiso = MOCK_PERMISOS[pIdx];
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');

    const pend = permiso.aprobaciones.find(a => a.estado === 'PENDIENTE');
    if (!pend) throw new Error('No hay aprobaciones pendientes');

    if (pend.usuarioAsignado && pend.usuarioAsignado.id !== user.id) throw new Error(`Turno de: ${pend.usuarioAsignado.nombre}`);
    if (!pend.usuarioAsignado) {
      const roles = user.roles || [user.role];
      if (!roles.includes(pend.rolFirmante)) throw new Error(`Rol requerido: ${pend.rolFirmante}`);
    }

    pend.estado = 'FIRMADO';
    pend.fechaFirma = new Date().toISOString();
    pend.usuarioFirma = { id: user.id, nombre: user.name };
    pend.firmaUrl = firmaUrl;
    
    const allS = permiso.aprobaciones.every(a => a.estado === 'FIRMADO');
    const medS = !permiso.aprobacionMedica || permiso.aprobacionMedica.estado === 'FIRMADO';
    // Monitoreo no bloquea la activación (se hace al cierre)
    if(allS && medS) permiso.estado = 'ACTIVO';

    return JSON.parse(JSON.stringify(permiso));
  }

  async cerrarPermiso(id: string, obs: string, f: string): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 400));
    const pIdx = MOCK_PERMISOS.findIndex(p => p.id === id);
    if (pIdx === -1) throw new Error('Permiso no encontrado');
    const permiso = MOCK_PERMISOS[pIdx];
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    
    if (user.id !== permiso.solicitanteId) throw new Error('Solo solicitante inicia cierre');

    permiso.estado = 'EN_CIERRE';
    permiso.observacionesCierre = obs;
    
    const cierres: Aprobacion[] = [
      { 
        id: crypto.randomUUID(), 
        rolFirmante: 'SOLICITANTE', 
        estado: 'FIRMADO', 
        fechaFirma: new Date().toISOString(), 
        usuarioFirma: { id: user.id, nombre: user.name }, 
        firmaUrl: f, 
        usuarioAsignado: { id: user.id, nombre: user.name } 
      }
    ];
    
    if (permiso.tiposTrabajo.some(t => ['QUIMICOS', 'ESPACIOS_CONFINADOS'].includes(t))) {
      cierres.push(createAprobacion('INSPECTOR'));
    }
    cierres.push(createAprobacion('APROBADOR_HSEQ'), createAprobacion('APROBADOR_AREA'));
    permiso.aprobacionesCierre = cierres;

    return JSON.parse(JSON.stringify(permiso));
  }

  async firmarCierre(id: string, firmaUrl: string, l1?: LecturaGases, l2?: LecturaGases, l3?: LecturaGases): Promise<Permiso> {
    await new Promise(res => setTimeout(res, 400));
    const pIdx = MOCK_PERMISOS.findIndex(p => p.id === id);
    if (pIdx === -1) throw new Error('Permiso no encontrado');
    const permiso = MOCK_PERMISOS[pIdx];
    if (permiso.estado !== 'EN_CIERRE') throw new Error('No está en cierre');

    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const pend = permiso.aprobacionesCierre.find(a => a.estado === 'PENDIENTE');
    if (!pend) throw new Error('No hay firmas pendientes');

    const roles = user.roles || [user.role];
    if (!roles.includes(pend.rolFirmante)) throw new Error(`Rol requerido: ${pend.rolFirmante}`);

    if (pend.rolFirmante === 'INSPECTOR') {
      if (!l1 || !l2 || !l3) throw new Error('Se requieren las 3 lecturas de gases');
      permiso.monitoreo = {
        id: crypto.randomUUID(),
        rolFirmante: 'INSPECTOR',
        estado: 'FIRMADO',
        fechaFirma: new Date().toISOString(),
        usuarioFirma: { id: user.id, nombre: user.name },
        firmaUrl: firmaUrl,
        lecturaInicial: l1,
        lecturaIntermedia: l2,
        lecturaFinal: l3
      };
    }

    pend.estado = 'FIRMADO';
    pend.fechaFirma = new Date().toISOString();
    pend.usuarioFirma = { id: user.id, nombre: user.name };
    pend.firmaUrl = firmaUrl;

    if (permiso.aprobacionesCierre.every(a => a.estado === 'FIRMADO')) {
      permiso.estado = 'CERRADO';
    }

    return JSON.parse(JSON.stringify(permiso));
  }

  async firmarAptitudMedica(id: string, f: string) {
      const p = await this.getById(id);
      if(p.aprobacionMedica) { 
        p.aprobacionMedica.estado='FIRMADO'; 
        p.aprobacionMedica.fechaFirma=new Date().toISOString(); 
        p.aprobacionMedica.usuarioFirma={id:'doc', nombre:'Doctora'}; 
        p.aprobacionMedica.firmaUrl=f; 
      }
      const all=p.aprobaciones.every(a=>a.estado==='FIRMADO'); 
      const med=!p.aprobacionMedica||p.aprobacionMedica.estado==='FIRMADO';
      if(all&&med) p.estado='ACTIVO';
      return JSON.parse(JSON.stringify(p));
  }

  async completarMonitoreo() { return {} as any; } 

  async aplazar(id: string, m: string) { 
    const p = await this.getById(id); 
    p.estado='APLAZADO'; 
    return JSON.parse(JSON.stringify(p)); 
  }
}