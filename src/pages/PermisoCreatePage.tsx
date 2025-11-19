import { FunctionalComponent } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { route } from 'preact-router';
import { usePermisos } from '@/hooks/usePermisos';
import { CreatePermisoDTO, Departamento, TipoTrabajo, TareaATS, PersonalAutorizado, Documento } from '@/types';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { LISTADO_PELIGROS, LISTADO_MEDIDAS } from '@/utils/constantes';
import { MOCK_PERSONNEL } from '@/services/mock-storage/personnel.mock';

// --- Constantes del formulario ---
const DEPARTAMENTOS_OPTIONS: Departamento[] = ['LOGISTICA', 'PRODUCCION', 'ADMINISTRACION', 'CALIDAD', 'HSE'];
const TIPOS_TRABAJO_OPTIONS: TipoTrabajo[] = ['FRIO', 'CALIENTE', 'ALTURAS', 'ESPACIOS_CONFINADOS', 'ELECTRICO', 'QUIMICOS', 'IZAJES', 'EXCAVACIONES'];
const DOCUMENTOS_EXTERNOS: Documento['tipo'][] = ['CEDULA', 'ANTECEDENTES', 'INDUCCION_HSE', 'IESS'];
const DOCUMENTOS_FRIO: Documento['tipo'][] = ['HERRAMIENTAS_IPT'];

const AREAS_POR_DEPARTAMENTO: Record<Departamento, string[]> = {
  LOGISTICA: ['BODEGA 1', 'BODEGA 2', 'BODEGA 3', 'BODEGA 4', 'BODEGA 5', 'BODEGA 6', 'AREA DE DESPACHO', 'BASCULA', 'OFICINA', 'OTROS'],
  PRODUCCION: ['EMPAQUE DE AVENA', 'EMPAQUE DE HARINA', 'MOLINO', 'OFICINA', 'OTROS'],
  ADMINISTRACION: ['OFICINA', 'BAÑOS', 'COMEDOR', 'OTROS'],
  CALIDAD: ['LABORATORIO', 'EMPAQUE DE AVENA', 'EMPAQUE DE HARINA', 'MOLINO', 'LOGISTICA', 'OTROS'],
  HSE: ['BODEGA 1', 'BODEGA 2', 'BODEGA 3', 'BODEGA 4', 'BODEGA 5', 'BODEGA 6', 'AREA DE DESPACHO', 'BASCULA', 'OFICINA', 'EMPAQUE DE AVENA', 'EMPAQUE DE HARINA', 'MOLINO', 'BAÑOS', 'COMEDOR', 'LABORATORIO', 'LOGISTICA', 'OTROS']
};

const formSectionClass = "p-4 sm:p-6 bg-gray-800 rounded-lg border border-gray-700 space-y-4";
const formLabelClass = "block text-sm font-medium text-gray-300 mb-1";
const formSelectClass = "py-2 px-3 w-full rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-rojo-moderna text-sm sm:text-base";
const formCheckboxLabelClass = "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-sm sm:text-base";
const formCheckboxClass = "h-4 w-4 sm:h-5 sm:w-5 rounded text-rojo-moderna bg-gray-600 border-gray-500 focus:ring-rojo-moderna flex-shrink-0";

// --- Componente Modal de Éxito (Reemplazo del Alert) ---
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl max-w-sm w-full text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¡Permiso Creado!</h3>
            <p className="text-gray-300 mb-6">El permiso de trabajo ha sido registrado exitosamente en el sistema.</p>
            <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-500 text-white justify-center">Aceptar</Button>
        </div>
    </div>
  );
};

// --- Validaciones ---
const validateStep1 = (formData: Partial<CreatePermisoDTO>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!formData.fechaInicio) errors.push('La fecha de inicio es obligatoria');
  if (!formData.fechaCaducidad) errors.push('La fecha de caducidad es obligatoria');
  if (!formData.descripcionGeneral?.trim()) errors.push('La descripción general es obligatoria');
  if (!formData.departamento) errors.push('Debe seleccionar un departamento');
  if (!formData.area?.trim()) errors.push('El área es obligatoria');
  if (!formData.maquinaria?.trim()) errors.push('El equipo o maquinaria es obligatorio');
  if (!formData.tiposTrabajo?.length) errors.push('Debe seleccionar al menos un tipo de trabajo');
  if (!formData.personalAutorizado?.length) errors.push('Debe agregar al menos una persona autorizada');
  return { isValid: errors.length === 0, errors };
};

const validateStep2 = (formData: Partial<CreatePermisoDTO>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!formData.ats?.cantidadPersonas || formData.ats.cantidadPersonas < 1) errors.push('La cantidad de personas expuestas debe ser al menos 1');
  if (!formData.ats?.tareas?.length) {
    errors.push('Debe agregar al menos una tarea en el ATS');
  } else {
    formData.ats.tareas.forEach((tarea, index) => {
      if (!tarea.descripcion?.trim()) errors.push(`La tarea ${index + 1} debe tener una descripción`);
      if (!tarea.peligros?.length) errors.push(`La tarea ${index + 1} debe tener al menos un peligro identificado`);
      if (!tarea.medidas?.length) errors.push(`La tarea ${index + 1} debe tener al menos una medida de control`);
    });
  }
  return { isValid: errors.length === 0, errors };
};

export const PermisoCreatePage: FunctionalComponent<{ path?: string }> = () => {
  const [step, setStep] = useState(1);
  const { create, loading } = usePermisos({});
  const [formData, setFormData] = useState<Partial<CreatePermisoDTO>>({
    tiposTrabajo: [],
    personalAutorizado: [],
    ats: { cantidadPersonas: 1, tareas: [] },
    documentos: [],
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false); // Estado para el modal

  const handleNextStep = () => {
    const validation = validateStep1(formData);
    if (validation.isValid) {
      setValidationErrors([]);
      
      // --- MEJORA: AUTOCOMPLETAR CANTIDAD DE PERSONAS ---
      const cantidadCalculada = formData.personalAutorizado?.length || 1;
      
      setFormData(prev => ({ 
        ...prev, 
        ats: { 
            // Mantener tareas si ya existen (por si el usuario vuelve atrás)
            ...(prev.ats || { tareas: [] }),
            cantidadPersonas: cantidadCalculada 
        } 
      }));
      
      setStep(2);
    } else {
      setValidationErrors(validation.errors);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const step1Validation = validateStep1(formData);
    const step2Validation = validateStep2(formData);
    const allErrors = [...step1Validation.errors, ...step2Validation.errors];
    
    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      return;
    }
    
    setValidationErrors([]);
    try {
      await create(formData as CreatePermisoDTO);
      // En lugar de alert, mostramos el modal
      setShowSuccess(true);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const handleSuccessClose = () => {
      setShowSuccess(false);
      route('/permisos');
  };
  
  const step1Validation = validateStep1(formData);
  const step2Validation = validateStep2(formData);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Crear Nuevo Permiso de Trabajo</h1>
      
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <h3 className="font-semibold mb-2">Por favor complete los siguientes campos obligatorios:</h3>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (<li key={index}>{error}</li>))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <Step1InfoGeneral 
            formData={formData} 
            setFormData={setFormData} 
            onFieldChange={() => setValidationErrors([])}
          />
        )}
        {step === 2 && (
          <Step2ATS 
            formData={formData} 
            setFormData={setFormData}
            onFieldChange={() => setValidationErrors([])}
          />
        )}

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Button 
            type="button" 
            onClick={() => { setValidationErrors([]); step === 1 ? route('/permisos') : setStep(1); }} 
            className="bg-gray-600 text-white hover:bg-gray-500 w-full sm:w-auto text-sm sm:text-base"
          >
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </Button>

          {step === 1 && (
            <Button 
              type="button" 
              onClick={handleNextStep} 
              disabled={!step1Validation.isValid}
              className="bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base"
            >
              Siguiente: ATS
            </Button>
          )}
          {step === 2 && (
            <Button 
              type="submit" 
              disabled={loading || !step1Validation.isValid || !step2Validation.isValid} 
              className="bg-green-600 text-white hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base"
            >
              {loading ? 'Creando...' : 'Crear Permiso'}
            </Button>
          )}
        </div>
      </form>

      <SuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
    </div>
  );
};

const Step1InfoGeneral = ({ formData, setFormData, onFieldChange }) => {
  const [newPersonalType, setNewPersonalType] = useState<'INTERNO' | 'EXTERNO'>('INTERNO');
  const [selectedWorkerId, setSelectedWorkerId] = useState('');

  const availableWorkers = useMemo(() => {
    return MOCK_PERSONNEL.filter(w => w.tipo === newPersonalType);
  }, [newPersonalType]);

  const handleInput = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'departamento') updated.area = '';
      return updated;
    });
    onFieldChange?.();
  };

  const handleDateChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    if (name === 'fechaInicio') {
      const maxCaducidad = new Date(new Date(value).getTime() + 7 * 24 * 60 * 60 * 1000);
      setFormData(prev => ({ ...prev, [name]: value, fechaCaducidad: maxCaducidad.toISOString().split('T')[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    onFieldChange?.();
  };

  const handleCheckbox = (e: Event, tipo: TipoTrabajo) => {
    const { checked } = e.target as HTMLInputElement;
    setFormData(prev => {
      const currentTipos = prev.tiposTrabajo || [];
      return { ...prev, tiposTrabajo: checked ? [...currentTipos, tipo] : currentTipos.filter(t => t !== tipo) };
    });
    onFieldChange?.();
  };

  const handleAddPersonal = () => {
    if (!selectedWorkerId) return;
    
    const worker = MOCK_PERSONNEL.find(w => w.id === selectedWorkerId);
    if (!worker) return;

    if (formData.personalAutorizado?.some(p => p.cedula === worker.cedula)) {
      alert('Este trabajador ya ha sido agregado.');
      return;
    }

    const newPersonal: PersonalAutorizado = { 
      id: worker.id, 
      nombres: worker.nombres, 
      apellidos: worker.apellidos,
      cedula: worker.cedula,
      tipo: newPersonalType 
    };
    
    setFormData(prev => ({ ...prev, personalAutorizado: [...prev.personalAutorizado, newPersonal] }));
    setSelectedWorkerId(''); 
    onFieldChange?.();
  };

  const handleFileChange = (e: Event, tipoDoc: Documento['tipo'], personalId: string) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    setFormData(prev => ({
      ...prev,
      documentos: [
        ...prev.documentos.filter(d => !(d.personalId === personalId && d.tipo === tipoDoc)), 
        { tipo: tipoDoc, file: file, personalId: personalId }
      ]
    }));
  };

  const handleRemovePersonal = (id: string) => {
    setFormData(prev => ({
      ...prev,
      personalAutorizado: prev.personalAutorizado.filter(p => p.id !== id),
      documentos: prev.documentos.filter(d => d.personalId !== id)
    }));
    onFieldChange?.();
  };

  const needsMedicaExterno = formData.tiposTrabajo.some(t => ['ALTURAS', 'ESPACIOS_CONFINADOS', 'QUIMICOS'].includes(t));
  const needsIPT = formData.tiposTrabajo.includes('FRIO');
  const needsAltura = formData.tiposTrabajo.includes('ALTURAS');
  const needsIzaje = formData.tiposTrabajo.includes('IZAJES');

  return (
    <div className="space-y-6">
      <div className={formSectionClass}>
        <h2 className="text-xl font-semibold text-white">Paso 1: Información General</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className={formLabelClass}>Fecha de Inicio <span className="text-red-400">*</span></span>
            <Input name="fechaInicio" type="date" value={formData.fechaInicio} onInput={handleDateChange} required />
          </label>
          <label className="block">
            <span className={formLabelClass}>Fecha de Caducidad (Máx. 7 días) <span className="text-red-400">*</span></span>
            <Input name="fechaCaducidad" type="date" value={formData.fechaCaducidad} onInput={handleDateChange} required />
          </label>
        </div>
        <label className="block">
          <span className={formLabelClass}>Descripción General del Trabajo <span className="text-red-400">*</span></span>
          <Input name="descripcionGeneral" value={formData.descripcionGeneral} onInput={handleInput} required />
        </label>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="block">
            <span className={formLabelClass}>Departamento <span className="text-red-400">*</span></span>
            <select name="departamento" value={formData.departamento || ''} onInput={handleInput} className={formSelectClass} required>
              <option value="">Seleccione...</option>
              {DEPARTAMENTOS_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="block">
            <span className={formLabelClass}>Área <span className="text-red-400">*</span></span>
            <select name="area" value={formData.area || ''} onInput={handleInput} className={formSelectClass} required disabled={!formData.departamento}>
              <option value="">{formData.departamento ? 'Seleccione un área...' : 'Primero seleccione un departamento'}</option>
              {formData.departamento && AREAS_POR_DEPARTAMENTO[formData.departamento]?.map(area => (<option key={area} value={area}>{area}</option>))}
            </select>
          </label>
          <label className="block">
            <span className={formLabelClass}>Equipo o Maquinaria <span className="text-red-400">*</span></span>
            <Input name="maquinaria" value={formData.maquinaria} onInput={handleInput} required />
          </label>
        </div>
      </div>
      
      <div className={formSectionClass}>
        <h3 className="text-lg font-semibold text-white">Tipos de Trabajo Involucrados <span className="text-red-400">*</span></h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TIPOS_TRABAJO_OPTIONS.map(tipo => (
            <label key={tipo} className={formCheckboxLabelClass}>
              <input type="checkbox" className={formCheckboxClass} checked={formData.tiposTrabajo.includes(tipo)} onChange={(e) => handleCheckbox(e, tipo)} />
              <span>{tipo}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={formSectionClass}>
        <h3 className="text-lg font-semibold text-white">Personal Autorizado <span className="text-red-400">*</span></h3>
        {formData.personalAutorizado.map(p => (
          <div key={p.id} className="flex items-center justify-between py-2 px-3 bg-gray-700 rounded text-sm">
            <span>{p.nombres} {p.apellidos} - C.I.: {p.cedula} ({p.tipo})</span>
            <Button type="button" onClick={() => handleRemovePersonal(p.id)} className="!py-1 !px-2 bg-red-600 text-white hover:bg-red-500 text-xs">Eliminar</Button>
          </div>
        ))}
        
        <div className="space-y-2 border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400 mb-2">Agregar nuevo personal:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3">
              <label className="block">
                <span className={formLabelClass}>Tipo</span>
                <select 
                  value={newPersonalType} 
                  onInput={(e) => {
                    setNewPersonalType((e.target as HTMLInputElement).value as any);
                    setSelectedWorkerId(''); 
                  }} 
                  className={formSelectClass}
                >
                  <option value="INTERNO">INTERNO</option>
                  <option value="EXTERNO">EXTERNO</option>
                </select>
              </label>
            </div>
            
            <div className="w-full sm:w-2/3">
              <label className="block">
                <span className={formLabelClass}>Seleccionar Trabajador</span>
                <select 
                  value={selectedWorkerId}
                  onInput={(e) => setSelectedWorkerId((e.target as HTMLInputElement).value)}
                  className={formSelectClass}
                >
                  <option value="">-- Buscar en lista --</option>
                  {availableWorkers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.nombres} {w.apellidos} - {w.cargo || w.cedula}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end mt-2">
            <Button 
              type="button" 
              onClick={handleAddPersonal} 
              className="bg-gray-600 text-white hover:bg-gray-500 whitespace-nowrap h-[42px]"
              disabled={!selectedWorkerId}
            >
              + Añadir a la lista
            </Button>
          </div>
        </div>
      </div>

      {formData.personalAutorizado.length > 0 && (
        <div className="space-y-4">
          {formData.personalAutorizado.map(personal => {
            const documentosPersona = formData.documentos.filter(d => d.personalId === personal.id);
            const esInterno = personal.tipo === 'INTERNO';
            const esExterno = personal.tipo === 'EXTERNO';
            
            return (
              <div key={personal.id} className="p-6 bg-yellow-500/10 rounded-lg border border-yellow-500/30 space-y-3">
                <h3 className="text-lg font-semibold text-yellow-300">
                  Documentos Requeridos para {personal.nombres} {personal.apellidos} ({personal.tipo})
                </h3>
                {esInterno && (
                  <FileInput label="Certificado de Aptitud Médica" tipo="APTITUD_MEDICA" personalId={personal.id} onChange={handleFileChange} fileSelected={documentosPersona.some(d => d.tipo === 'APTITUD_MEDICA')} />
                )}
                {esExterno && (
                  <>
                    {needsMedicaExterno && <FileInput label="Certificado de Aptitud Médica" tipo="APTITUD_MEDICA" personalId={personal.id} onChange={handleFileChange} fileSelected={documentosPersona.some(d => d.tipo === 'APTITUD_MEDICA')} />}
                    {DOCUMENTOS_EXTERNOS.map(tipo => (
                      <FileInput key={tipo} label={tipo} tipo={tipo} personalId={personal.id} onChange={handleFileChange} fileSelected={documentosPersona.some(d => d.tipo === tipo)} />
                    ))}
                    {needsIPT && <FileInput label="Listado Herramientas IPT" tipo="HERRAMIENTAS_IPT" personalId={personal.id} onChange={handleFileChange} fileSelected={documentosPersona.some(d => d.tipo === 'HERRAMIENTAS_IPT')} />}
                    {needsAltura && <FileInput label="Certificado de Altura" tipo="CERTIFICADO_ALTURA" personalId={personal.id} onChange={handleFileChange} fileSelected={documentosPersona.some(d => d.tipo === 'CERTIFICADO_ALTURA')} />}
                    {needsIzaje && <FileInput label="Certificado de Izaje" tipo="CERTIFICADO_IZAJE" personalId={personal.id} onChange={handleFileChange} fileSelected={documentosPersona.some(d => d.tipo === 'CERTIFICADO_IZAJE')} />}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Step2ATS = ({ formData, setFormData, onFieldChange }) => {
  const ats = formData.ats || { cantidadPersonas: 1, tareas: [] };
  const handleAtsInput = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({ ...prev, ats: { ...(prev.ats || { cantidadPersonas: 1, tareas: [] }), [name]: Number(value) } }));
    onFieldChange?.();
  };
  const handleAddTask = () => {
    setFormData(prev => ({ ...prev, ats: { ...(prev.ats || { cantidadPersonas: 1, tareas: [] }), tareas: [...(prev.ats?.tareas || []), { id: crypto.randomUUID(), descripcion: '', peligros: [], medidas: [] }] } }));
    onFieldChange?.();
  };
  const handleUpdateTask = (updatedTask: TareaATS) => {
    setFormData(prev => ({ ...prev, ats: { ...(prev.ats || { cantidadPersonas: 1, tareas: [] }), tareas: (prev.ats?.tareas || []).map(t => t.id === updatedTask.id ? updatedTask : t) } }));
    onFieldChange?.();
  };
  const handleRemoveTask = (id: string) => {
    setFormData(prev => ({ ...prev, ats: { ...(prev.ats || { cantidadPersonas: 1, tareas: [] }), tareas: (prev.ats?.tareas || []).filter(t => t.id !== id) } }));
    onFieldChange?.();
  };

  return (
    <div className="space-y-6">
      <div className={formSectionClass}>
        <h2 className="text-xl font-semibold text-white">Paso 2: Análisis de Trabajo Seguro (ATS)</h2>
        <label className="block">
          <span className={formLabelClass}>Cantidad de Personas Expuestas <span className="text-red-400">*</span></span>
          {/* Se muestra el valor que viene del estado (autocalculado o editado) */}
          <Input name="cantidadPersonas" type="number" min="1" value={ats.cantidadPersonas || 1} onInput={handleAtsInput} required />
        </label>
      </div>
      {(ats.tareas || []).map((tarea, index) => (<TareaATSForm key={tarea.id} index={index} tarea={tarea} onUpdate={handleUpdateTask} onRemove={handleRemoveTask} />))}
      <div className="space-y-2">
        <p className="text-sm text-gray-400"><span className="text-red-400">*</span> Debe agregar al menos una tarea</p>
        <Button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddTask(); }} className="w-full bg-gray-700 text-white hover:bg-gray-600">+ Añadir Tarea</Button>
      </div>
    </div>
  );
};

const TareaATSForm = ({ index, tarea, onUpdate, onRemove }) => {
  const handleInput = (e: Event) => onUpdate({ ...tarea, descripcion: (e.target as HTMLInputElement).value });
  const handleCheckbox = (e: Event, tipo: 'peligros' | 'medidas', valor: string) => {
    const { checked } = e.target as HTMLInputElement;
    onUpdate({ ...tarea, [tipo]: checked ? [...tarea[tipo], valor] : tarea[tipo].filter(v => v !== valor) });
  };
  return (
    <div className={`${formSectionClass} !p-4`}>
      <div className="flex justify-between items-center mb-3">
        <label className="text-lg font-semibold">Tarea {index + 1}</label>
        <Button type="button" onClick={() => onRemove(tarea.id)} className="!py-1 !px-3 bg-rojo-moderna text-white hover:bg-rojo-moderna-dark">X</Button>
      </div>
      <div>
        <label className="block mb-1"><span className="text-sm font-medium text-gray-300">Descripción de la Tarea <span className="text-red-400">*</span></span></label>
        <Input value={tarea.descripcion} onInput={handleInput} placeholder="Descripción de la Tarea" />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div><CheckboxList title="Peligros Identificados" items={LISTADO_PELIGROS} checkedItems={tarea.peligros} onChange={(e, item) => handleCheckbox(e, 'peligros', item)} /></div>
        <div><CheckboxList title="Medidas de Control" items={LISTADO_MEDIDAS} checkedItems={tarea.medidas} onChange={(e, item) => handleCheckbox(e, 'medidas', item)} /></div>
      </div>
    </div>
  );
};

const CheckboxList = ({ title, items, checkedItems, onChange }) => (
  <div className="border border-gray-700 rounded-lg p-4">
    <h4 className="font-semibold text-white mb-3">{title}</h4>
    <div className="max-h-56 overflow-y-auto space-y-2 pr-2">
      {items.map(item => (
        <label key={item} className="flex items-center gap-2 text-sm">
          <input type="checkbox" className={formCheckboxClass} checked={checkedItems.includes(item)} onChange={(e) => onChange(e, item)} />
          {item}
        </label>
      ))}
    </div>
  </div>
);

const FileInput = ({ label, tipo, personalId, onChange, fileSelected }) => (
  <label className="block">
    <span className={`${formLabelClass} !text-yellow-300`}>{label} {fileSelected && <span className="text-green-400">✓</span>}</span>
    <Input type="file" onChange={(e) => onChange(e, tipo, personalId)} className="!bg-gray-700" />
  </label>
);