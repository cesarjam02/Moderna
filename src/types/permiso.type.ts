import { UserId, UserRole } from './users.type';

// --- Tipos Centrales ---

/** El objeto principal del Permiso de Trabajo. Contiene toda la información. */
export interface Permiso {
  id: string;
  numero: string; // Ej: "000009"
  estado: PermisoEstado;
  
  // Paso 1: Información General
  solicitanteId: UserId;
  solicitante: {
    id: UserId;
    nombre: string;
  };
  fechaSolicitud: string; // ISO Date
  fechaInicio: string; // ISO Date
  fechaCaducidad: string; // ISO Date
  descripcionGeneral: string;
  departamento: Departamento;
  area: string;
  maquinaria: string;
  tiposTrabajo: TipoTrabajo[];
  personalAutorizado: PersonalAutorizado[];

  // Paso 2: Análisis de Trabajo Seguro (ATS)
  ats: AnalisisTrabajoSeguro;

  // Documentos adjuntos (Requerimiento #8)
  documentos: Documento[];

  // Flujo de Aprobaciones
  aprobaciones: Aprobacion[]; // Las 4 firmas principales (Solicitante, HSEQ, etc.)
  aprobacionMedica: Aprobacion | null; // Firma de la Doctora (Requerimiento #9)
  monitoreo: Aprobacion | null; // Firma del Inspector (solo si ESPACIOS_CONFINADOS)
}

/** Define el estado actual del permiso en su ciclo de vida. (Requerimiento #2) */
export type PermisoEstado = 'PENDIENTE' | 'ACTIVO' | 'CERRADO' | 'APLAZADO';

/** Departamentos fijos de la empresa. (Requerimiento #3) */
export type Departamento = 'LOGISTICA' | 'PRODUCCION' | 'ADMINISTRACION' | 'CALIDAD' | 'HSE';

/** Tipos de trabajo que activan diferentes lógicas. */
export type TipoTrabajo = 
  | 'FRIO' 
  | 'CALIENTE' 
  | 'ALTURAS' 
  | 'ESPACIOS_CONFINADOS' 
  | 'ELECTRICO' 
  | 'QUIMICOS' 
  | 'IZAJES' 
  | 'EXCAVACIONES';


// --- Sub-Interfaces ---

/** * Representa una Tarea individual dentro del ATS.
 * Cada tarea tiene sus propios peligros y medidas. (Requerimiento #6)
 */
export interface TareaATS {
  id: string;
  descripcion: string;
  peligros: string[]; // Array de peligros seleccionados para ESTA tarea
  medidas: string[]; // Array de medidas seleccionadas para ESTA tarea
}

/** El Análisis de Trabajo Seguro completo. */
export interface AnalisisTrabajoSeguro {
  cantidadPersonas: number;
  tareas: TareaATS[]; // Un permiso puede tener múltiples tareas
}

/** Representa a una persona (interna o externa) que participará en el trabajo. */
export interface PersonalAutorizado {
  id: string; // Puede ser un ID de User o un DNI/cédula
  nombres: string;
  apellidos: string;
  cedula: string;
  tipo: 'INTERNO' | 'EXTERNO';
}

/** * Representa un documento adjunto al permiso. 
 * Requerido para personal EXTERNO. (Requerimiento #8)
 */
export interface Documento {
  id: string;
  tipo: 'CEDULA' | 'ANTECEDENTES' | 'INDUCCION_HSE' | 'IESS' | 'HERRAMIENTAS_IPT' | 'APTITUD_MEDICA' | 'CERTIFICADO_ALTURA' | 'CERTIFICADO_IZAJE';
  nombreArchivo: string;
  url: string; // URL al archivo almacenado (ej. S3, Firebase Storage)
}

/** * Representa una única firma en cualquier parte del proceso 
 * (Aprobación principal, médica o monitoreo). 
 */
export interface Aprobacion {
  id: string;
  rolFirmante: UserRole; // El rol que DEBE firmar (ej. 'APROBADOR_HSEQ')
  estado: 'PENDIENTE' | 'FIRMADO';
  usuarioFirma?: {
    id: UserId;
    nombre: string;
  };
  fechaFirma?: string; // ISO Date
}


// --- DTOs (Data Transfer Objects) ---

/** * Objeto de datos necesario para crear un nuevo Permiso.
 * Es lo que se envía a la API desde el formulario de "Crear Permiso".
 */
export interface CreatePermisoDTO {
  // Info General
  fechaInicio: string;
  fechaCaducidad: string;
  descripcionGeneral: string;
  departamento: Departamento;
  area: string;
  maquinaria: string;
  tiposTrabajo: TipoTrabajo[];
  personalAutorizado: PersonalAutorizado[];
  
  // ATS
  ats: AnalisisTrabajoSeguro;

  // Documentos (asociados a cada persona autorizada)
  documentos: Array<{ tipo: Documento['tipo'], file: File, personalId: string }>; // Se usa 'File' para la subida
}