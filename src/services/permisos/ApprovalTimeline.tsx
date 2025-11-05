import { FunctionalComponent } from 'preact';
import { Aprobacion } from '@/types';

interface ApprovalTimelineProps {
  aprobaciones: Aprobacion[];
}

export const ApprovalTimeline: FunctionalComponent<ApprovalTimelineProps> = ({ aprobaciones }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {aprobaciones.map(ap => (
        <ApprovalItem key={ap.id} aprobacion={ap} />
      ))}
    </div>
  );
};

const ApprovalItem: FunctionalComponent<{ aprobacion: Aprobacion }> = ({ aprobacion }) => {
  const isSigned = aprobacion.estado === 'FIRMADO';
  
  const iconClass = isSigned
    ? 'bg-green-500/20 text-green-300'
    : 'bg-gray-700 text-gray-400';
  
  return (
    <div className="flex items-center">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 ${iconClass}`}>
        <span className="font-bold text-lg">{isSigned ? '✓' : '🕓'}</span>
      </div>
      
      <div className={isSigned ? 'opacity-100' : 'opacity-60'}>
        <div className="font-semibold text-white">
          {isSigned ? aprobacion.usuarioFirma.nombre : `Pendiente: ${aprobacion.rolFirmante}`}
        </div>
        <div className="text-sm text-gray-400">
          {isSigned
            ? `Firmado el ${new Date(aprobacion.fechaFirma).toLocaleString()}`
            : `Firma pendiente de ${aprobacion.rolFirmante}`
          }
        </div>
      </div>
    </div>
  );
};