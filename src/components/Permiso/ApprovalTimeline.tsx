import { FunctionalComponent } from 'preact';
import { Aprobacion } from '@/types';

interface ApprovalTimelineProps {
  aprobaciones: Aprobacion[];
}

export const ApprovalTimeline: FunctionalComponent<ApprovalTimelineProps> = ({ aprobaciones }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {aprobaciones.map(ap => (
        <ApprovalItem key={ap.id} aprobacion={ap} />
      ))}
    </div>
  );
};

// --- Sub-componente para cada item de firma ---
const ApprovalItem: FunctionalComponent<{ aprobacion: Aprobacion }> = ({ aprobacion }) => {
  const isSigned = aprobacion.estado === 'FIRMADO';
  
  const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginRight: '1rem',
    backgroundColor: isSigned ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 255, 255, 0.1)',
    color: isSigned ? '#4caf50' : '#9e9e9e',
    fontSize: '1.25rem',
  };
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={iconStyle}>
        {isSigned ? '✓' : '🕓'}
      </div>
      
      <div style={{ opacity: isSigned ? 1 : 0.7 }}>
        <div style={{ fontWeight: '600' }}>
          {isSigned ? aprobacion.usuarioFirma.nombre : `Pendiente: ${aprobacion.rolFirmante}`}
        </div>
        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
          {isSigned
            ? `Firmado el ${new Date(aprobacion.fechaFirma).toLocaleString()}`
            : `Firma pendiente de ${aprobacion.rolFirmante}`
          }
        </div>
      </div>
    </div>
  );
};