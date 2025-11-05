import { FunctionalComponent } from 'preact';
import { TipoTrabajo } from '@/types';

interface TagProps {
  tipo: TipoTrabajo;
}

export const Tag: FunctionalComponent<TagProps> = ({ tipo }) => {
  return (
    <span
      className="py-1 px-2.5 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
    >
      {tipo}
    </span>
  );
};