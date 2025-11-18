import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { usePermiso } from '@/hooks/usePermiso';
import { Button } from '@/components/UI/Button';
import { Badge } from '@/components/UI/Badge';
import { Tag } from '@/components/UI/Tag';
import { ApprovalTimeline } from '@/components/Permiso/ApprovalTimeline';
import { SignatureModal } from '@/components/Permiso/SignatureModal';

// --- Clases de Tailwind Reutilizables ---
const sectionClass = "p-6 bg-gray-800 rounded-lg border border-gray-700";

export const PermisoDetailPage: FunctionalComponent<{ id: string }> = ({ id }) => {
  const { user } = useAuth();
  const { 
    data: permiso, 
    loading, 
    error, 
    firmarPermiso, 
    firmarAptitudMedica, 
    completarMonitoreo,
    descargarPDF
  } = usePermiso(id);

  const [showSignModal, setShowSignModal] = useState(false);
  const [showMedicoModal, setShowMedicoModal] = useState(false);
  const [showMonitoreoModal, setShowMonitoreoModal] = useState(false);

  if (loading) return <p className="p-8">Cargando permiso...</p>;
  if (error) return <p className="p-8 text-red-400">Error: {error.message}</p>;
  if (!permiso) return <p className="p-8">Permiso no encontrado.</p>;

  const getNextSignerRol = (p: typeof permiso) => p.aprobaciones.find(a => a.estado === 'PENDIENTE')?.rolFirmante;
  const canSign = getNextSignerRol(permiso) === user?.role;
  const canSignMedico = permiso.aprobacionMedica?.estado === 'PENDIENTE' && user?.role === 'DOCTORA';
  const tieneEspaciosConfinados = permiso.tiposTrabajo.includes('ESPACIOS_CONFINADOS');
  const canSignMonitoreo = tieneEspaciosConfinados && permiso.estado === 'ACTIVO' && permiso.monitoreo?.estado === 'PENDIENTE' && user?.role === 'INSPECTOR';
  
  // Verificar si todas las aprobaciones principales están completas (incluyendo APROBADOR_AREA)
  const todasAprobacionesCompletas = permiso.aprobaciones.every(a => a.estado === 'FIRMADO');
  const aptitudMedicaCompleta = !permiso.aprobacionMedica || permiso.aprobacionMedica.estado === 'FIRMADO';
  const puedeDescargar = todasAprobacionesCompletas && aptitudMedicaCompleta;

  const handleOpenSignModal = (type: 'principal' | 'medico' | 'monitoreo') => {
    if (type === 'principal') setShowSignModal(true);
    if (type === 'medico') setShowMedicoModal(true);
    if (type === 'monitoreo') setShowMonitoreoModal(true);
  };

  const handleConfirmSignPrincipal = async () => {
    await firmarPermiso();
  };

  const handleConfirmSignMedico = async () => {
    await firmarAptitudMedica();
  };

  const handleConfirmSignMonitoreo = async () => {
    await completarMonitoreo();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Permiso N° {permiso.numero}</h1>
          <p className="text-gray-400">{permiso.descripcionGeneral}</p>
        </div>
        <Badge estado={permiso.estado} />
      </div>

      <div className="flex flex-wrap gap-2">
        {permiso.tiposTrabajo.map(tipo => <Tag key={tipo} tipo={tipo} />)}
      </div>

      {/* Aquí puedes añadir más secciones de "Solo Lectura" (Info General, ATS) */}

      <div className={sectionClass}>
        <h2 className="text-xl font-semibold mb-4">Progreso de Aprobaciones</h2>
        <ApprovalTimeline aprobaciones={permiso.aprobaciones} />
      </div>

      {permiso.aprobacionMedica && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Aptitud Médica</h2>
          <ApprovalTimeline aprobaciones={[permiso.aprobacionMedica]} />
          {canSignMedico && (
            <Button
              onClick={() => handleOpenSignModal('medico')}
              className="w-full mt-6 bg-green-600 text-white hover:bg-green-500"
            >
              Firmar Aptitud Médica
            </Button>
          )}
        </div>
      )}

      {tieneEspaciosConfinados && permiso.estado === 'ACTIVO' && (
         <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Seguimiento del Monitoreo Continuo</h2>
          <ApprovalTimeline aprobaciones={[permiso.monitoreo]} />
          {canSignMonitoreo && (
            <Button
              onClick={() => handleOpenSignModal('monitoreo')}
              className="w-full mt-6 bg-green-600 text-white hover:bg-green-500"
            >
              Completar y Cerrar Permiso
            </Button>
          )}
        </div>
      )}

      {canSign && (
        <Button
          onClick={() => handleOpenSignModal('principal')}
          className="w-full !py-3 text-lg bg-rojo-moderna text-white hover:bg-rojo-moderna-dark"
        >
          Revisar y Firmar Permiso Principal
        </Button>
      )}

      {puedeDescargar && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Permiso Completamente Aprobado</h2>
          <p className="text-gray-300 mb-4">
            Todas las aprobaciones han sido completadas. El permiso está listo para descargar.
          </p>
          <Button
            onClick={descargarPDF}
            className="w-full !py-3 text-lg bg-green-600 text-white hover:bg-green-500"
          >
            📥 Descargar Permiso de Trabajo (PDF)
          </Button>
        </div>
      )}

      {/* Modales de Firma */}
      <SignatureModal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
        onConfirm={handleConfirmSignPrincipal}
        title="Firmar Permiso Principal"
      />
      <SignatureModal
        isOpen={showMedicoModal}
        onClose={() => setShowMedicoModal(false)}
        onConfirm={handleConfirmSignMedico}
        title="Firmar Aptitud Médica"
      />
      <SignatureModal
        isOpen={showMonitoreoModal}
        onClose={() => setShowMonitoreoModal(false)}
        onConfirm={handleConfirmSignMonitoreo}
        title="Completar Monitoreo Continuo"
      />
    </div>
  );
};