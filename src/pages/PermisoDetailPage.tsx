import { FunctionalComponent } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { render } from 'preact/compat';
import { useAuth } from '@/contexts/AuthContext';
import { usePermiso } from '@/hooks/usePermiso';
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

// --- Helpers de Permisos y Roles ---

const hasRole = (user: { role: UserRole; roles?: UserRole[] }, role: UserRole): boolean => {
  if (user.roles && user.roles.length > 0) return user.roles.includes(role);
  return user.role === role;
};

const canSign = (permiso: Permiso, user: { role: UserRole; roles?: UserRole[]; id?: string }, userId?: string): Aprobacion | null => {
  const nextPendingApproval = permiso.aprobaciones.find(a => a.estado === 'PENDIENTE');
  if (!nextPendingApproval) return null;
  
  if (nextPendingApproval.usuarioAsignado) {
    if (nextPendingApproval.usuarioAsignado.id === userId) return nextPendingApproval;
    return null;
  }
  
  if (hasRole(user, nextPendingApproval.rolFirmante)) return nextPendingApproval;
  return null;
};

// Nota: Ya no usamos canSignMedico para un botón flotante, sino dentro de la caja médica
const canInitiateClose = (permiso: Permiso, user: { role: UserRole; roles?: UserRole[]; id?: string }): boolean => {
  return permiso.estado === 'ACTIVO' && permiso.solicitanteId === user.id;
};

const getPendingClosingRole = (permiso: Permiso): UserRole | null => {
  if (permiso.estado !== 'EN_CIERRE') return null;
  return permiso.aprobacionesCierre?.find(a => a.estado === 'PENDIENTE')?.rolFirmante || null;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '---';
  return date.toLocaleString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const PermisoDetailPage: FunctionalComponent<{ id: string }> = ({ id }) => {
  const { user } = useAuth();
  const { 
    data: permiso, 
    loading, 
    error, 
    firmarPermiso, 
    firmarAptitudMedica, 
    cerrarPermiso, 
    firmarEtapaCierre 
  } = usePermiso(id);

  const [showSignModal, setShowSignModal] = useState(false);
  const [showMedicoModal, setShowMedicoModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  
  const [showClosingInspectorModal, setShowClosingInspectorModal] = useState(false);
  const [showClosingSignModal, setShowClosingSignModal] = useState(false);
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Timeline SIN la doctora (ahora ella tiene su propia caja)
  const timelineRegular = useMemo(() => {
    if (!permiso) return [];
    return [...permiso.aprobaciones];
  }, [permiso]);

  if (loading) return <p className="p-8 text-white">Cargando permiso...</p>;
  if (error) return <p className="p-8 text-red-400">Error: {error.message}</p>;
  if (!permiso) return <p className="p-8 text-white">Permiso no encontrado.</p>;

  // --- Lógica ---
  const nextApproval = user ? canSign(permiso, user, user.id) : null;
  const userCanInitiateClose = user ? canInitiateClose(permiso, user) : false;
  
  const pendingClosingRole = getPendingClosingRole(permiso);
  const isMyTurnToClose = user && pendingClosingRole && hasRole(user, pendingClosingRole);

  const esHseq = user ? hasRole(user, 'APROBADOR_HSEQ') : false;
  const puedeDescargar = permiso.estado === 'CERRADO' && esHseq;

  // --- Handlers ---
  const handleConfirmSignPrincipal = async (f: string) => { 
    try { await firmarPermiso(f); } catch (e) { alert(e instanceof Error ? e.message : 'Error'); } 
  };

  const handleConfirmSignMedico = async (f: string) => { 
    await firmarAptitudMedica(f); 
  };

  const handleConfirmClose = async (obs: string, f: string) => { 
    await cerrarPermiso(obs, f); 
  };
  
  const handleConfirmClosingInspector = async (f: string, l1: LecturaGases, l2: LecturaGases, l3: LecturaGases) => { 
    await firmarEtapaCierre(f, l1, l2, l3); 
  };
  
  const handleConfirmClosingSign = async (f: string) => { 
    await firmarEtapaCierre(f); 
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
      if (pdfContainer) document.body.removeChild(pdfContainer); 
      setIsGeneratingPdf(false); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Cabecera */}
      <div className={`${sectionClass} flex flex-col sm:flex-row justify-between items-start gap-4`}>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Permiso de Trabajo N° {permiso.numero}</h1>
          <p className="text-gray-400 text-sm sm:text-base">Solicitado por: {permiso.solicitante.nombre}</p>
        </div>
        <Badge estado={permiso.estado} />
      </div>

      {/* --- CAJA EXCLUSIVA PARA APTITUD MÉDICA (SI APLICA) --- */}
      {permiso.aprobacionMedica && (
        <div className={`${sectionClass} border-l-4 ${permiso.aprobacionMedica.estado === 'FIRMADO' ? 'border-l-green-500' : 'border-l-blue-500'}`}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              🏥 Aptitud Médica
              {permiso.aprobacionMedica.estado === 'FIRMADO' 
                ? <span className="bg-green-900 text-green-200 text-xs px-2 py-1 rounded border border-green-700">APROBADO</span>
                : <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded border border-blue-700">PENDIENTE</span>
              }
            </h2>
          </div>

          {permiso.aprobacionMedica.estado === 'FIRMADO' ? (
            <div className="text-gray-300 bg-gray-900/50 p-3 rounded border border-gray-600">
              <p><strong>Firmado por:</strong> {permiso.aprobacionMedica.usuarioFirma?.nombre || 'Doctora'}</p>
              <p><strong>Fecha:</strong> {formatDate(permiso.aprobacionMedica.fechaFirma)}</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 italic">Se requiere la aprobación del área médica para activar este permiso.</p>
              {user && hasRole(user, 'DOCTORA') && (
                <Button onClick={() => setShowMedicoModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white whitespace-nowrap">
                  Firmar Aptitud Médica
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Timeline Apertura (RESTO DE FIRMAS) */}
      <div className={sectionClass}>
        <h2 className="text-xl font-semibold mb-4 text-white">Flujo de Aprobación (Operativo)</h2>
        <ApprovalTimeline aprobaciones={timelineRegular} />
      </div>
      
      {/* Botón de Acción para el Flujo Regular */}
      {nextApproval && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4 text-white">Acción Requerida</h2>
          <p className="text-gray-300 mb-4">Se requiere su firma como <strong>{nextApproval.usuarioAsignado ? nextApproval.usuarioAsignado.nombre : nextApproval.rolFirmante}</strong>.</p>
          <Button onClick={() => setShowSignModal(true)} className="w-full !py-3 text-lg bg-rojo-moderna text-white hover:bg-rojo-moderna-dark">Revisar y Firmar Permiso Principal</Button>
        </div>
      )}

      {/* Botón Iniciar Cierre */}
      {userCanInitiateClose && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4 text-white">Cierre de Permiso</h2>
          <Button onClick={() => setShowCloseModal(true)} className="w-full !py-3 text-lg bg-gray-600 text-white hover:bg-gray-500">Iniciar Cierre del Permiso</Button>
        </div>
      )}

      {/* Sección Fase de Cierre */}
      {(permiso.estado === 'EN_CIERRE' || permiso.estado === 'CERRADO') && (
        <div className={`${sectionClass} border-yellow-500/50`}>
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Proceso de Cierre</h2>
          <ApprovalTimeline aprobaciones={permiso.aprobacionesCierre || []} />
          
          {permiso.estado === 'EN_CIERRE' && isMyTurnToClose && (
            <div className="mt-4 p-4 bg-yellow-500/10 rounded border border-yellow-500/30">
              <p className="mb-3 text-yellow-200">Es su turno para aprobar el cierre como: <strong>{pendingClosingRole}</strong></p>
              {pendingClosingRole === 'INSPECTOR' ? (
                <Button onClick={() => setShowClosingInspectorModal(true)} className="bg-yellow-600 text-white">Registrar Gases Finales y Firmar</Button>
              ) : (
                <Button onClick={() => setShowClosingSignModal(true)} className="bg-green-600 text-white">Firmar Cierre</Button>
              )}
            </div>
          )}
          
          {permiso.monitoreo?.lecturaFinal && (
            <div className="mt-4 text-sm text-gray-300 border-t border-gray-700 pt-2">
              <strong>Lectura Final Registrada:</strong> O2: {permiso.monitoreo.lecturaFinal.o2}% | LEL: {permiso.monitoreo.lecturaFinal.lel}%
            </div>
          )}
        </div>
      )}
      
      {/* Descarga PDF */}
      {puedeDescargar && (
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4 text-white">Documento Final</h2>
          <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded mb-3 text-sm text-blue-200">
             ℹ️ Documento disponible exclusivamente para el perfil APROBADOR_HSEQ.
          </div>
          <Button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="w-full !py-3 text-lg bg-green-600 text-white hover:bg-green-500 disabled:bg-gray-500">
            {isGeneratingPdf ? 'Generando...' : 'Descargar Permiso Completo (PDF)'}
          </Button>
        </div>
      )}
      
      {/* Detalles */}
      <div className={sectionClass}>
        <h2 className="text-xl font-semibold mb-4 text-white">Detalles Generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div><strong className="text-white">Departamento:</strong> {permiso.departamento}</div>
          <div><strong className="text-white">Área:</strong> {permiso.area}</div>
          <div><strong className="text-white">Equipo/Máquina:</strong> {permiso.maquinaria}</div>
          <div><strong className="text-white">Fecha Inicio:</strong> {formatDate(permiso.fechaInicio)}</div>
          <div><strong className="text-white">Fecha Fin:</strong> {formatDate(permiso.fechaCaducidad)}</div>
          <div><strong className="text-white">Contratista:</strong> {permiso.contratista || 'N/A'}</div>
        </div>
        <div className="mt-4 text-sm text-gray-300">
            <strong className="text-white">Descripción:</strong>
            <p className="mt-1 whitespace-pre-wrap">{permiso.descripcionGeneral}</p>
        </div>
      </div>
      
      <div className={sectionClass}>
        <h2 className="text-xl font-semibold mb-4 text-white">Tipos de Trabajo</h2>
        <div className="flex flex-wrap gap-3">{permiso.tiposTrabajo.map(tipo => <Tag key={tipo} tipo={tipo} />)}</div>
      </div>
      
      <div className={sectionClass}>
        <h2 className="text-xl font-semibold mb-4 text-white">Personal Autorizado</h2>
        <ul className="list-disc pl-5 text-gray-300">{(permiso.personalAutorizado || []).map((p, i) => <li key={p.id || i}>{p.nombres} {p.apellidos} ({p.cedula})</li>)}</ul>
      </div>

      {/* Modales */}
      <SignatureModal isOpen={showSignModal} onClose={() => setShowSignModal(false)} onConfirm={handleConfirmSignPrincipal} title={`Firmar`} />
      <SignatureModal isOpen={showMedicoModal} onClose={() => setShowMedicoModal(false)} onConfirm={handleConfirmSignMedico} title="Firmar Aptitud Médica" />
      <CloseModal isOpen={showCloseModal} onClose={() => setShowCloseModal(false)} onConfirm={handleConfirmClose} />
      <MonitorModal isOpen={showClosingInspectorModal} onClose={() => setShowClosingInspectorModal(false)} onConfirm={handleConfirmClosingInspector} title="Monitoreo Final (Cierre)" />
      <SignatureModal isOpen={showClosingSignModal} onClose={() => setShowClosingSignModal(false)} onConfirm={handleConfirmClosingSign} title={`Firma de Cierre: ${pendingClosingRole}`} />
    </div>
  );
};