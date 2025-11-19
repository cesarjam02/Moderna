// src/services/mock-storage/personnel.mock.ts

export interface WorkerMock {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  tipo: 'INTERNO' | 'EXTERNO';
  cargo?: string;
}

export const MOCK_PERSONNEL: WorkerMock[] = [
  { id: 'w1', nombres: 'Carlos Alberto', apellidos: 'Andrade Ruiz', cedula: '1715489652', tipo: 'INTERNO', cargo: 'Operador de Molino' },
  { id: 'w2', nombres: 'Maria Fernanda', apellidos: 'Lopez Torres', cedula: '0923568974', tipo: 'INTERNO', cargo: 'Analista de Calidad' },
  { id: 'w3', nombres: 'Juan Esteban', apellidos: 'Perez Gomez', cedula: '1104523698', tipo: 'INTERNO', cargo: 'Mecánico Industrial' },
  { id: 'w4', nombres: 'Sofia Alejandra', apellidos: 'Vargas Diaz', cedula: '0603214587', tipo: 'INTERNO', cargo: 'Supervisor HSE' },
  { id: 'w5', nombres: 'Luis Antonio', apellidos: 'Mendez Castro', cedula: '1802587412', tipo: 'INTERNO', cargo: 'Electricista' },
  
  { id: 'w6', nombres: 'Pedro Jose', apellidos: 'Ramirez Silva', cedula: '1758963214', tipo: 'EXTERNO', cargo: 'Albañil - Constructora A' },
  { id: 'w7', nombres: 'Ana Gabriela', apellidos: 'Suarez Pinto', cedula: '0954123658', tipo: 'EXTERNO', cargo: 'Técnico de Redes' },
  { id: 'w8', nombres: 'Diego Fernando', apellidos: 'Castro Molina', cedula: '1152369874', tipo: 'EXTERNO', cargo: 'Soldador Externo' },
  { id: 'w9', nombres: 'Elena Beatriz', apellidos: 'Diaz Vega', cedula: '0658741236', tipo: 'EXTERNO', cargo: 'Limpieza Industrial' },
  { id: 'w10', nombres: 'Javier Eduardo', apellidos: 'Rios Luna', cedula: '1852369741', tipo: 'EXTERNO', cargo: 'Contratista General' },
];