import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { render } from 'preact/compat';
import { useAuth } from '@/contexts/AuthContext';
import { usePermiso } from '@/hooks/usePermiso';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/UI/Button';
import { Badge } from '@/components/UI/Badge';
import { Tag } from '@/components/UI/Tag';
import { ApprovalTimeline } from '@/components/Permiso/ApprovalTimeline';
import { SignatureModal } from '@/components/Permiso/SignatureModal';
import { PermisoPDF } from '@/components/Permiso/PermisoPDF';
import { exportToPdf } from '@/utils/pdfGenerator';
import { Aprobacion, Permiso, UserRole, LecturaGases } from '@/types';
import { MonitorModal } from '@/components/Modals/MonitorModal';
import { CloseModal } from '@/components/Modals/CloseModal';

const sectionClass = "p-6 bg-gray-800 rounded-lg border border-gray-700";

// Helper para verificar si un usuario tiene un rol específico
const hasRole = (user: { role: UserRole; roles?: UserRole[] }, role: UserRole): boolean => {
  if (user.roles && user.roles.length > 0) {
    return user.roles.includes(role);
  }
  return user.role === role;
};

const canSign = (permiso: Permiso, user: { role: UserRole; roles?: UserRole[]; id?: string }, userId?: string): Aprobacion | null => {
  const nextPendingApproval = permiso.aprobaciones.find(a => a.estado === 'PENDIENTE');
  if (!nextPendingApproval) return null;
  
  // Si la próxima aprobación es SOLICITANTE, solo el solicitante específico puede firmar
  if (nextPendingApproval.rolFirmante === 'SOLICITANTE') {
    if (hasRole(user, 'SOLICITANTE') && userId && userId === permiso.solicitanteId) {
      return nextPendingApproval;
    }
    return null;
  }
  
  // Para otros roles, verificar que el SOLICITANTE ya haya firmado
  const solicitanteAprobacion = permiso.aprobaciones.find(a => a.rolFirmante === 'SOLICITANTE');
  if (!solicitanteAprobacion || solicitanteAprobacion.estado !== 'FIRMADO') {
    return null; // El solicitante debe firmar primero
  }
  
  // Si el usuario tiene el rol necesario, puede firmar
  if (hasRole(user, nextPendingApproval.rolFirmante)) {
    return nextPendingApproval;
  }
  
  return null;
};

const canSignMedico = (permiso: Permiso, user: { role: UserRole; roles?: UserRole[] }): boolean => {
  return hasRole(user, 'DOCTORA') &&
         !!permiso.aprobacionMedica &&
         permiso.aprobacionMedica.estado === 'PENDIENTE';
};

const canMonitor = (permiso: Permiso, user: { role: UserRole; roles?: UserRole[] }): boolean => {
  const allMainApprovalsDone = permiso.aprobaciones
    .filter(a => a.rolFirmante !== 'LIDER')
    .every(a => a.estado === 'FIRMADO');

  return hasRole(user, 'INSPECTOR') &&
         !!permiso.monitoreo &&
         permiso.monitoreo.estado === 'PENDIENTE' &&
         allMainApprovalsDone;
};

const canClose = (permiso: Permiso, user: { role: UserRole; roles?: UserRole[] }): boolean => {
  return hasRole(user, 'LIDER') &&
         permiso.estado === 'ACTIVO' &&
         !permiso.aprobaciones.find(a => a.rolFirmante === 'LIDER' && a.estado === 'FIRMADO');
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '---';
  return date.toLocaleString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const PermisoDetailPage: FunctionalComponent<{ id: string }> = ({ id }) => {
  const { user } = useAuth();
  const { markAsViewed } = useNotifications();
  const { 
    data: permiso, 
    loading, 
    error, 
    firmarPermiso, 
    firmarAptitudMedica, 
    completarMonitoreo,
    cerrarPermiso
  } = usePermiso(id);

  const [showSignModal, setShowSignModal] = useState(false);
  const [showMedicoModal, setShowMedicoModal] = useState(false);
  const [showMonitoreoModal, setShowMonitoreoModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Marcar notificaciones relacionadas como leídas cuando se carga el permiso
  useEffect(() => {
    if (permiso && user) {
      const userRole = user.role as UserRole;
      const userId = user.id;
      
      // Solo marcar las notificaciones que realmente corresponden a este usuario
      // Verificar si puede firmar aprobaciones principales
      const nextPendingApproval = permiso.aprobaciones.find(a => a.estado === 'PENDIENTE');
      if (nextPendingApproval) {
        if (nextPendingApproval.rolFirmante === 'SOLICITANTE' && hasRole(user, 'SOLICITANTE') && userId === permiso.solicitanteId) {
          markAsViewed(`sign-${permiso.id}`);
        } else if (hasRole(user, nextPendingApproval.rolFirmante)) {
          const solicitanteAprobacion = permiso.aprobaciones.find(a => a.rolFirmante === 'SOLICITANTE');
          if (solicitanteAprobacion && solicitanteAprobacion.estado === 'FIRMADO') {
            markAsViewed(`sign-${permiso.id}`);
          }
        }
      }
      
      // Verificar si puede firmar aprobación médica
      if (hasRole(user, 'DOCTORA') && permiso.aprobacionMedica && permiso.aprobacionMedica.estado === 'PENDIENTE') {
        markAsViewed(`medico-${permiso.id}`);
      }
      
      // Verificar si puede monitorear
      const allMainApprovalsDone = permiso.aprobaciones
        .filter(a => a.rolFirmante !== 'LIDER')
        .every(a => a.estado === 'FIRMADO');
      if (hasRole(user, 'INSPECTOR') && permiso.monitoreo && permiso.monitoreo.estado === 'PENDIENTE' && allMainApprovalsDone) {
        markAsViewed(`monitor-${permiso.id}`);
      }
      
      // Verificar si puede cerrar
      if (hasRole(user, 'LIDER') && permiso.estado === 'ACTIVO') {
        const liderAprobacion = permiso.aprobaciones.find(a => a.rolFirmante === 'LIDER');
        if (!liderAprobacion || liderAprobacion.estado !== 'FIRMADO') {
          markAsViewed(`close-${permiso.id}`);
        }
      }
    }
  }, [permiso?.id, user?.id, user?.role, user?.roles, markAsViewed]);

  if (loading) return <p className="p-8">Cargando permiso...</p>;
  if (error) return <p className="p-8 text-red-400">Error: {error.message}</p>;
  if (!permiso) return <p className="p-8">Permiso no encontrado.</p>;

  const userId = user?.id;
  const nextApproval = user ? canSign(permiso, user, userId) : null;
  const userCanSignMedico = user ? canSignMedico(permiso, user) : false;
  const userCanMonitor = user ? canMonitor(permiso, user) : false;
  const userCanClose = user ? canClose(permiso, user) : false;

  const puedeDescargar = permiso.estado === 'ACTIVO' || permiso.estado === 'CERRADO';

  const handleConfirmSignPrincipal = async (signatureDataUrl: string) => {
    try {
      await firmarPermiso(signatureDataUrl);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al firmar el permiso');
    }
  };

  const handleConfirmSignMedico = async (signatureDataUrl: string) => {
    await firmarAptitudMedica(signatureDataUrl);
  };

  const handleConfirmSignMonitoreo = async (signatureDataUrl: string, lecturaInicial: LecturaGases, lecturaPeriodica: LecturaGases | null) => {
    await completarMonitoreo(signatureDataUrl, lecturaInicial, lecturaPeriodica);
  };
  
  const handleConfirmClose = async (observaciones: string, signatureDataUrl: string) => {
    await cerrarPermiso(observaciones, signatureDataUrl);
  };

  const handleDownloadPdf = async () => {
    if (!permiso) return;
    setIsGeneratingPdf(true);

    const pdfContainerId = "pdf-generator-container";
    let pdfContainer = document.getElementById(pdfContainerId);

    if (!pdfContainer) {
      pdfContainer = document.createElement('div');
      pdfContainer.id = pdfContainerId;
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.top = '0';
      document.body.appendChild(pdfContainer);
    }
    
    render(<PermisoPDF permiso={permiso} id="pdf-content-to-print" />, pdfContainer);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      await exportToPdf('pdf-content-to-print', `permiso-${permiso.numero}`);
    } catch (err) {
      console.error(err);
      alert('Error al generar el PDF');
    } finally {
      render(null, pdfContainer);
      if (pdfContainer) {
        document.body.removeChild(pdfContainer);
      }
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      
      <div className={`${sectionClass} flex flex-col sm:flex-row justify-between items-start gap-4`}>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Permiso de Trabajo N° {permiso.numero}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Solicitado por: {permiso.solicitante.nombre}
          </p>
        </div>
        <Badge estado={permiso.estado} />
      </div>

      <div className={sectionClass}>
        <h2 className="text-xl font-semibold mb-4">Flujo de Aprobación</h2>
        <ApprovalTimeline 
          aprobaciones={permiso.aprobaciones}
          aprobacionMedica={permiso.aprobacionMedica}
          monitoreo={permiso.monitoreo}
        />
      </div>
      
      {nextApproval && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Acción Requerida</h2>
          <p className="text-gray-300 mb-4">
            Se requiere su firma para la aprobación de <strong>{nextApproval.rolFirmante}</strong>.
          </p>
          <Button
            onClick={() => setShowSignModal(true)}
            className="w-full !py-3 text-lg bg-rojo-moderna text-white hover:bg-rojo-moderna-dark"
          >
            Revisar y Firmar Permiso Principal
          </Button>
        </div>
      )}

      {userCanSignMedico && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Acción Requerida (Médico)</h2>
          <p className="text-gray-300 mb-4">
            Se requiere su firma para la <strong>Aptitud Médica</strong> de los trabajadores.
          </p>
          <Button
            onClick={() => setShowMedicoModal(true)}
            className="w-full !py-3 text-lg bg-blue-600 text-white hover:bg-blue-500"
          >
            Revisar y Firmar Aptitud Médica
          </Button>
        </div>
      )}

      {userCanMonitor && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Acción Requerida (Inspector)</h2>
          <p className="text-gray-300 mb-4">
            Se requiere el <strong>Monitoreo de Gases</strong> para activar este permiso.
          </p>
          <Button
            onClick={() => setShowMonitoreoModal(true)}
            className="w-full !py-3 text-lg bg-yellow-500 text-black hover:bg-yellow-400"
          >
            Realizar Monitoreo de Gases
          </Button>
        </div>
      )}

      {userCanClose && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Cierre de Permiso</h2>
          <p className="text-gray-300 mb-4">
            El trabajo ha finalizado. Firme para <strong>Cerrar el Permiso</strong>.
          </p>
          <Button
            onClick={() => setShowCloseModal(true)}
            className="w-full !py-3 text-lg bg-gray-600 text-white hover:bg-gray-500"
          >
            Cerrar Permiso
          </Button>
        </div>
      )}

      
      {puedeDescargar && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Documento</h2>
          <p className="text-gray-300 mb-4">
            El permiso está {permiso.estado} y puede ser descargado.
          </p>
          <Button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="w-full !py-3 text-lg bg-green-600 text-white hover:bg-green-500 disabled:bg-gray-500"
          >
            {isGeneratingPdf ? 'Generando...' : 'Descargar Permiso (PDF)'}
          </Button>
        </div>
      )}

      
      <div className={sectionClass}>
        <h2 className="text-xl font-semibold mb-4">Detalles Generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Departamento:</strong> {permiso.departamento}</div>
          <div><strong>Área:</strong> {permiso.area}</div>
          <div><strong>Equipo/Máquina:</strong> {permiso.maquinaria}</div>
          <div><strong>Fecha Inicio:</strong> {formatDate(permiso.fechaInicio)}</div>
          <div><strong>Fecha Fin:</strong> {formatDate(permiso.fechaCaducidad)}</div>
          <div><strong>Contratista:</strong> {permiso.contratista || 'N/A'}</div>
          <div><strong>RUC Contratista:</strong> {permiso.rucContratista || 'N/A'}</div>
        </div>
        <div className="mt-4 text-sm">
          <strong>Descripción del Trabajo:</strong>
          <p className="text-gray-300 mt-1 whitespace-pre-wrap">{permiso.descripcionGeneral}</p>
        </div>
      </div>
      
      <div className={sectionClass}>
        <h2 className="text-xl font-semibold mb-4">Tipos de Trabajo</h2>
        <div className="flex flex-wrap gap-3">
          {permiso.tiposTrabajo.map(tipo => (
            <Tag key={tipo} tipo={tipo} />
          ))}
        </div>
      </div>
      
      <div className={sectionClass}>
        <h2 className="text-xl font-semibold mb-4">Personal Autorizado</h2>
        <ul className="list-disc pl-5 text-gray-300">
          {(permiso.personalAutorizado || []).map((p, i) => (
            <li key={p.id || i}>{p.nombres} {p.apellidos} ({p.cedula}) - {p?.actividad || 'N/A'}</li>
          ))}
        </ul>
      </div>

      
      <div className={sectionClass}>
        <h2 className="text-xl font-semibold mb-4">Análisis de Trabajo Seguro (ATS)</h2>
        <div className="space-y-4">
          <p className="text-sm"><strong>Personas Expuestas:</strong> {permiso.ats.cantidadPersonas}</p>
          {(permiso.ats.tareas || []).map((tarea, index) => (
            <div key={tarea.id || index} className="border-b border-gray-700 pb-4">
              <h3 className="font-semibold text-white">Tarea: {tarea.descripcion}</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Peligros:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {tarea.peligros.map(p => <li key={p}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Medidas de Control:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {tarea.medidas.map(m => <li key={m}>{m}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      {permiso.monitoreo && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Monitoreo de Gases</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-400">Lectura Inicial</h4>
              <p>O2: {permiso.monitoreo.lecturaInicial?.o2 || 'N/A'}%</p>
              <p>CO: {permiso.monitoreo.lecturaInicial?.co || 'N/A'} ppm</p>
              <p>LEL: {permiso.monitoreo.lecturaInicial?.lel || 'N/A'}%</p>
              <p>H2S: {permiso.monitoreo.lecturaInicial?.h2s || 'N/A'} ppm</p>
            </div>
            {permiso.monitoreo.lecturaPeriodica && (
            <div>
              <h4 className="font-medium text-gray-400">Lectura Periódica</h4>
              <p>O2: {permiso.monitoreo.lecturaPeriodica.o2}%</p>
              <p>CO: {permiso.monitoreo.lecturaPeriodica.co} ppm</p>
              <p>LEL: {permiso.monitoreo.lecturaPeriodica.lel}%</p>
              <p>H2S: {permiso.monitoreo.lecturaPeriodica.h2s} ppm</p>
            </div>
            )}
          </div>
        </div>
      )}

      
      {permiso.documentos.length > 0 && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Documentos Adjuntos</h2>
          <ul className="list-disc pl-5 text-blue-400">
            {permiso.documentos.map(doc => (
              <li key={doc.id}>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {doc.nombreArchivo} ({doc.tipo})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {permiso.observacionesCierre && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Observaciones de Cierre</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{permiso.observacionesCierre}</p>
        </div>
      )}

      <SignatureModal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
        onConfirm={handleConfirmSignPrincipal}
        title={`Firmar como ${nextApproval?.rolFirmante}`}
      />
      <SignatureModal
        isOpen={showMedicoModal}
        onClose={() => setShowMedicoModal(false)}
        onConfirm={handleConfirmSignMedico}
        title="Firmar Aptitud Médica"
      />
      
      <MonitorModal
        isOpen={showMonitoreoModal}
        onClose={() => setShowMonitoreoModal(false)}
        onConfirm={handleConfirmSignMonitoreo}
      />
      <CloseModal
        isOpen={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        onConfirm={handleConfirmClose}
      />
      
    </div>
  );
};