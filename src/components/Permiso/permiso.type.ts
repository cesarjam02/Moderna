import { UserId, UserRole } from './users.type';

export type PermisoEstado = 'PENDIENTE' | 'ACTIVO' | 'CERRADO' | 'APLAZADO';
export type Departamento = 'LOGISTICA' | 'PRODUCCION' | 'ADMINISTRACION' | 'CALIDAD' | 'HSE';
export type TipoTrabajo = 'FRIO' | 'CALIENTE' | 'ALTURAS' | 'ESPACIOS_CONFINADOS' | 'ELECTRICO' | 'QUIMICOS' | 'IZAJES' | 'EXCAVACIONES';

export interface TareaATS {
  id?: string;
  descripcion: string;
  peligros: string[];
  medidas: string[];
}

export interface AnalisisTrabajoSeguro {
  id: string;
  cantidadPersonas: number;
  tareas: TareaATS[];
}

export interface PersonalAutorizado {
  id?: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  tipo: 'PROPIO' | 'CONTRATISTA' | 'EXTERNO';
  actividad?: string;
}

export interface Documento {
  id: string;
  tipo: 'CEDULA' | 'ANTECEDENTES' | 'INDUCCION_HSE' | 'IESS' | 'HERRAMIENTAS_IPT' | 'APTITUD_MEDICA' | 'CERTIFICADO_ALTURA' | 'CERTIFICADO_IZAJE';
  nombreArchivo: string;
  url: string; 
}

export interface LecturaGases {
  o2: string;
  co: string;
  lel: string;
  h2s: string;
}

export interface Monitoreo extends Aprobacion {
  lecturaInicial?: LecturaGases;
  lecturaPeriodica?: LecturaGases;
}

export interface Aprobacion {
  id: string;
  rolFirmante: UserRole;
  estado: 'PENDIENTE' | 'FIRMADO';
  usuarioFirma?: {
    id: UserId;
    nombre: string;
  };
  fechaFirma?: string;
  firmaUrl?: string | null; 
}

export interface Permiso {
  id: string;
  numero: string; 
  estado: PermisoEstado;
  
  solicitanteId: UserId;
  solicitante: {
    id: UserId;
    nombre: string;
  };
  fechaSolicitud: string; 
  fechaInicio: string; 
  fechaCaducidad: string;
  descripcionGeneral: string;
  departamento: Departamento;
  area: string;
  maquinaria: string;
  tiposTrabajo: TipoTrabajo[];
  personalAutorizado: PersonalAutorizado[];
  contratista?: string;
  rucContratista?: string;

  ats: AnalisisTrabajoSeguro;

  documentos: Documento[];

  aprobaciones: Aprobacion[];
  aprobacionMedica: Aprobacion | null;
  monitoreo: Monitoreo | null; 
  
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
  personalAutorizado: Omit<PersonalAutorizado, 'id'>[];
  
  ats: {
    cantidadPersonas: number;
    tareas: Omit<TareaATS, 'id'>[];
  };

  documentos: {
    file: File;
    tipo: Documento['tipo'];
  }[];

  contratista?: string;
  rucContratista?: string;
}