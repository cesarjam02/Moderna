import { UserId, UserRole } from './users.type';

export * from './users.type';
export * from './company.type';
export * from './auth.type';

// --- Tipos Centrales ---

export type PermisoEstado = 'PENDIENTE' | 'ACTIVO' | 'EN_CIERRE' | 'CERRADO' | 'APLAZADO';

export type Departamento = 'LOGISTICA' | 'PRODUCCION' | 'ADMINISTRACION' | 'CALIDAD' | 'HSE';

export type TipoTrabajo = 
  | 'FRIO' 
  | 'CALIENTE' 
  | 'ALTURAS' 
  | 'ESPACIOS_CONFINADOS' 
  | 'ELECTRICO' 
  | 'QUIMICOS' 
  | 'IZAJES' 
  | 'EXCAVACIONES'
  | 'EXCAVACIONES / ZANJAS';

export interface TareaATS {
  id: string;
  descripcion: string;
  peligros: string[]; 
  medidas: string[]; 
}

export interface AnalisisTrabajoSeguro {
  id?: string;
  cantidadPersonas: number;
  tareas: TareaATS[]; 
}

export interface PersonalAutorizado {
  id?: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  tipo: 'INTERNO' | 'EXTERNO';
  actividad?: string;
}

export interface Documento {
  id: string;
  tipo: 'CEDULA' | 'ANTECEDENTES' | 'INDUCCION_HSE' | 'IESS' | 'HERRAMIENTAS_IPT' | 'APTITUD_MEDICA' | 'CERTIFICADO_ALTURA' | 'CERTIFICADO_IZAJE';
  nombreArchivo: string;
  url: string; 
  personalId?: string; 
}

export interface Aprobacion {
  id: string;
  rolFirmante: UserRole; 
  estado: 'PENDIENTE' | 'FIRMADO';
  usuarioAsignado?: { id: UserId; nombre: string; };
  usuarioFirma?: { id: UserId; nombre: string; };
  fechaFirma?: string; 
  firmaUrl?: string | null; 
}

export interface LecturaGases {
  o2: string;
  co: string;
  lel: string;
  h2s: string;
}

export interface Monitoreo extends Aprobacion {
  // LAS 3 LECTURAS REQUERIDAS PARA CIERRE DE ESPACIOS CONFINADOS
  lecturaInicial?: LecturaGases;
  lecturaIntermedia?: LecturaGases;
  lecturaFinal?: LecturaGases;
}

export interface Permiso {
  id: string;
  numero: string; 
  estado: PermisoEstado;
  
  solicitanteId: UserId;
  solicitante: { id: UserId; nombre: string; };
  fechaSolicitud: string; 
  fechaInicio: string; 
  fechaCaducidad: string;
  descripcionGeneral: string;
  departamento: Departamento;
  area: string;
  maquinaria: string;
  localidad?: string;
  tiposTrabajo: TipoTrabajo[];
  personalAutorizado: PersonalAutorizado[];
  contratista?: string;
  rucContratista?: string;

  ats: AnalisisTrabajoSeguro;
  documentos: Documento[];

  aprobaciones: Aprobacion[];
  aprobacionMedica: Aprobacion | null;
  
  // El inspector llena esto al cierre si es necesario
  monitoreo: Monitoreo | null; 
  
  aprobacionesCierre: Aprobacion[]; 
  observacionesCierre?: string;
}

export interface CreatePermisoDTO {
  fechaInicio: string;
  fechaCaducidad: string;
  descripcionGeneral: string;
  departamento: Departamento;
  area: string;
  maquinaria: string;
  tiposTrabajo: TipoTrabajo[];
  personalAutorizado: (Omit<PersonalAutorizado, 'id'> & { id?: string })[];
  ats: {
    cantidadPersonas: number;
    tareas: Omit<TareaATS, 'id'>[];
  };
  documentos: Array<{ tipo: Documento['tipo'], file: File, personalId: string }>;
  contratista?: string;
  rucContratista?: string;
}