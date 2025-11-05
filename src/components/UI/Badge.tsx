import { FunctionalComponent } from 'preact';
import { PermisoEstado } from '@/types';

interface BadgeProps {
  estado: PermisoEstado;
}

// Clases de Tailwind para cada estado (diseño oscuro)
const COLORS: Record<PermisoEstado, string> = {
  PENDIENTE: 'bg-yellow-500/20 text-yellow-300',
  ACTIVO: 'bg-green-500/20 text-green-300',
  CERRADO: 'bg-gray-500/20 text-gray-300',
  APLAZADO: 'bg-red-500/20 text-red-300',
};

export const Badge: FunctionalComponent<BadgeProps> = ({ estado }) => {
  const colorClasses = COLORS[estado] || COLORS.CERRADO;
  
  return (
    <span
      className={`py-1 px-3 rounded-full text-xs font-semibold uppercase ${colorClasses}`}
    >
      {estado}
    </span>
  );
};