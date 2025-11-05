import { FunctionalComponent } from 'preact';
import { useAuth } from '@/contexts/AuthContext';
import { usePermiso } from '@/hooks/usePermiso';
import { Button } from '@/components/UI/Button';
import { Badge } from '@/components/UI/Badge';
import { Tag } from '@/components/UI/Tag';
import { ApprovalTimeline } from '@/components/Permiso/ApprovalTimeline';

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
    completarMonitoreo
  } = usePermiso(id);

  if (loading) return <p className="p-8">Cargando permiso...</p>;
  if (error) return <p className="p-8 text-red-400">Error: {error.message}</p>;
  if (!permiso) return <p className="p-8">Permiso no encontrado.</p>;

  const getNextSignerRol = (p: typeof permiso) => p.aprobaciones.find(a => a.estado === 'PENDIENTE')?.rolFirmante;
  const canSign = getNextSignerRol(permiso) === user?.role;
  const canSignMedico = permiso.aprobacionMedica?.estado === 'PENDIENTE' && user?.role === 'DOCTORA';
  const canSignMonitoreo = permiso.monitoreo?.estado === 'PENDIENTE' && user?.role === 'INSPECTOR';

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
              onClick={firmarAptitudMedica}
              className="w-full mt-6 bg-green-600 text-white hover:bg-green-500"
            >
              Firmar Aptitud Médica
            </Button>
          )}
        </div>
      )}

      {permiso.estado === 'ACTIVO' && (
         <div className={sectionClass}>
          <h2 className="text-xl font-semibold mb-4">Seguimiento del Monitoreo Continuo</h2>
          <ApprovalTimeline aprobaciones={[permiso.monitoreo]} />
          {canSignMonitoreo && (
            <Button
              onClick={completarMonitoreo}
              className="w-full mt-6 bg-green-600 text-white hover:bg-green-500"
            >
              Completar y Cerrar Permiso
            </Button>
          )}
        </div>
      )}

      {canSign && (
        <Button
          onClick={firmarPermiso}
          className="w-full !py-3 text-lg bg-rojo-moderna text-white hover:bg-rojo-moderna-dark"
        >
          Revisar y Firmar Permiso Principal
        </Button>
      )}
    </div>
  );
};