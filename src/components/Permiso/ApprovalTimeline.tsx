import { FunctionalComponent } from 'preact';
import { Aprobacion } from '@/types';

interface ApprovalTimelineProps {
  aprobaciones: Aprobacion[];
}

export const ApprovalTimeline: FunctionalComponent<ApprovalTimelineProps> = ({ aprobaciones }) => {
  // Ordenar aprobaciones: primero las firmadas (por fecha), luego las pendientes (por orden)
  const sortedAprobaciones = [...aprobaciones].sort((a, b) => {
    if (a.estado === 'FIRMADO' && b.estado === 'FIRMADO') {
      return new Date(a.fechaFirma || 0).getTime() - new Date(b.fechaFirma || 0).getTime();
    }
    if (a.estado === 'FIRMADO') return -1;
    if (b.estado === 'FIRMADO') return 1;
    return 0;
  });

  return (
    <div className="space-y-3">
      {sortedAprobaciones.map(ap => (
        <ApprovalItem key={ap.id} aprobacion={ap} />
      ))}
    </div>
  );
};

// --- Sub-componente para cada item de firma ---
const ApprovalItem: FunctionalComponent<{ aprobacion: Aprobacion }> = ({ aprobacion }) => {
  const isSigned = aprobacion.estado === 'FIRMADO';
  
  return (
    <div className={`flex items-center p-3 rounded-lg border ${
      isSigned 
        ? 'bg-green-500/10 border-green-500/30' 
        : 'bg-gray-700/50 border-gray-600'
    }`}>
      <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
        isSigned 
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-gray-600 text-gray-400'
      }`}>
        {isSigned ? '✓' : '🕓'}
      </div>
      
      <div className="flex-1">
        <div className={`font-semibold ${isSigned ? 'text-white' : 'text-gray-400'}`}>
          {isSigned 
            ? `${aprobacion.rolFirmante}: ${aprobacion.usuarioFirma?.nombre || 'N/A'}` 
            : `Pendiente: ${aprobacion.rolFirmante}`
          }
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {isSigned && aprobacion.fechaFirma
            ? `Firmado el ${new Date(aprobacion.fechaFirma).toLocaleString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}`
            : `Esperando firma de ${aprobacion.rolFirmante}`
          }
        </div>
      </div>
    </div>
  );
};