import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { useAuth } from '@/contexts/AuthContext';
import { usePermisos } from '@/hooks/usePermisos';
import { Permiso } from '@/types';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Badge } from '@/components/UI/Badge';
import { Tag } from '@/components/UI/Tag';
import { ConvenioModal } from '@/components/Modals/ConvenioModal';

export const PermisosPage: FunctionalComponent<{ path?: string }> = () => {
  const { hasAnyRole, user } = useAuth();
  const [filtros, setFiltros] = useState({});
  const [showConvenioModal, setShowConvenioModal] = useState(false);
  const { data: permisos, loading, error } = usePermisos(filtros);
  
  // Solo estos roles pueden crear permisos
  const puedeCrearPermiso = hasAnyRole(['admin', 'SOLICITANTE', 'user']);

  const handleFiltroChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleNuevoPermiso = () => {
    setShowConvenioModal(true);
  };

  const handleAcceptConvenio = () => {
    route('/permisos/nuevo');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Permisos de Trabajo</h1>
          <p className="text-gray-400 text-sm sm:text-base">Moderna Alimentos S.A.</p>
        </div>
        {puedeCrearPermiso && (
          <Button
            onClick={handleNuevoPermiso}
            className="bg-rojo-moderna text-white hover:bg-rojo-moderna-dark w-full sm:w-auto"
          >
            + Nuevo Permiso
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 p-4 sm:p-6 bg-gray-800 rounded-lg border border-gray-700">
        <input 
          name="fechaInicio" 
          type="date" 
          onInput={handleFiltroChange}
          className="py-2 sm:py-3 px-3 sm:px-4 text-base sm:text-lg rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-rojo-moderna"
        />
        <input 
          name="fechaFin" 
          type="date" 
          onInput={handleFiltroChange}
          className="py-2 sm:py-3 px-3 sm:px-4 text-base sm:text-lg rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-rojo-moderna"
        />
        <input 
          name="solicitante" 
          onInput={handleFiltroChange} 
          placeholder="Buscar por solicitante..."
          className="flex-1 py-2 sm:py-3 px-3 sm:px-4 text-base sm:text-lg rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rojo-moderna"
        />
      </div>

      {loading && <p>Cargando permisos...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {permisos?.map(permiso => (
          <PermisoCard key={permiso.id} permiso={permiso} />
        ))}
      </div>

      <ConvenioModal
        isOpen={showConvenioModal}
        onClose={() => setShowConvenioModal(false)}
        onAccept={handleAcceptConvenio}
        solicitanteName={user?.name || 'Usuario'}
      />
    </div>
  );
};

const PermisoCard: FunctionalComponent<{ permiso: Permiso }> = ({ permiso }) => {
  const getProximoPaso = (p: Permiso) => {
    if (p.estado === 'CERRADO') return 'Permiso archivado';
    if (p.aprobacionMedica?.estado === 'PENDIENTE') return `Firma pendiente: ${p.aprobacionMedica.rolFirmante}`;
    const proximaFirma = p.aprobaciones.find(a => a.estado === 'PENDIENTE');
    if (proximaFirma) return `Firma pendiente: ${proximaFirma.rolFirmante}`;
    if (p.estado === 'ACTIVO' && p.monitoreo?.estado === 'PENDIENTE') return `Firma pendiente: ${p.monitoreo.rolFirmante}`;
    return 'Revisión final';
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Permiso N° {permiso.numero}</h3>
          <span className="text-sm text-gray-400">
            Solicitud: {new Date(permiso.fechaSolicitud).toLocaleDateString()}
          </span>
        </div>
        <Badge estado={permiso.estado} />
      </div>

      <div className="mb-4 text-sm text-gray-300">
        <div><strong>Descripción:</strong> {permiso.descripcionGeneral || 'N/A'}</div>
        <div><strong>Área:</strong> {permiso.area}</div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {permiso.tiposTrabajo.map(tipo => <Tag key={tipo} tipo={tipo} />)}
      </div>

      {/* Empuja los botones al fondo */}
      <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div className="text-xs sm:text-sm">
          <strong className="text-gray-200">Próximo paso:</strong>
          <span className="text-gray-400 ml-2 block sm:inline">
            {getProximoPaso(permiso)}
          </span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {permiso.estado === 'ACTIVO' && (
            <Button className="bg-gray-700 text-white hover:bg-gray-600 flex-1 sm:flex-none text-sm">
              Imprimir
            </Button>
          )}
          <Button
            onClick={() => route(`/permisos/${permiso.id}`)}
            className="bg-rojo-moderna text-white hover:bg-rojo-moderna-dark flex-1 sm:flex-none text-sm"
          >
            Ver Detalles
          </Button>
        </div>
      </div>
    </div>
  );
};