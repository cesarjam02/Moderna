import { FunctionalComponent } from 'preact';
import { Permiso, TipoTrabajo, Aprobacion, Monitoreo } from '@/types';
import logo from '@/images/logo.png';

interface PermisoPDFProps {
  permiso: Permiso | null;
  id: string;
}

// Helper para formatear fechas (DD/MM/AAAA)
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Helper para formatear fecha y hora (DD/MM/AAAA HH:MM)
const formatDateTime = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Checkbox: FunctionalComponent<{ label: string; checked: boolean }> = ({ label, checked }) => (
  <div style={{ display: 'flex', alignItems: 'center', fontSize: '9px', lineHeight: '1' }}>
    <div style={{
      width: '12px',
      height: '12px',
      border: '1px solid #000',
      marginRight: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      backgroundColor: checked ? '#333' : 'transparent',
      color: checked ? '#fff' : 'transparent',
    }}>
      {checked ? 'X' : ''}
    </div>
    <span style={{ textTransform: 'uppercase' }}>{label}</span>
  </div>
);

const SignatureBoxSmall: FunctionalComponent<{ aprobacion?: Aprobacion | Monitoreo | null; rol: string; overrideName?: string }> = ({ aprobacion, rol, overrideName }) => {
  const isSigned = aprobacion?.estado === 'FIRMADO';
  const firmaImg = isSigned && 'firmaUrl' in aprobacion && aprobacion.firmaUrl
    ? <img src={aprobacion.firmaUrl} alt="Firma" style={{ height: '25px', width: 'auto', margin: '0 auto', display: 'block' }} />
    : <div style={{ height: '25px' }}></div>;

  const nombre = overrideName || (isSigned ? aprobacion.usuarioFirma?.nombre : '');

  return (
    <div style={{ padding: '2px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
      {firmaImg}
      <div style={{ borderTop: '1px solid #000', margin: '2px 0', width: '90%', alignSelf: 'center' }}></div>
      <p style={{ margin: '0', fontSize: '7px', fontWeight: 'bold', textTransform: 'uppercase' }}>{nombre}</p>
      <p style={{ margin: '0', fontSize: '6px', color: '#444' }}>{rol}</p>
    </div>
  );
};

export const PermisoPDF: FunctionalComponent<PermisoPDFProps> = ({ permiso, id }) => {
  if (!permiso) return null;

  // Mapeo exacto para mostrar las etiquetas que pide la imagen
  // pero usando las claves que tenemos en el sistema
  const tiposTrabajoMap: { label: string; value: TipoTrabajo }[] = [
    { label: 'TRABAJO EN CALIENTE', value: 'CALIENTE' },
    { label: 'TRABAJO EN FRÍO', value: 'FRIO' },
    { label: 'TRABAJO EN ALTURAS', value: 'ALTURAS' },
    { label: 'ESPACIOS CONFINADOS', value: 'ESPACIOS_CONFINADOS' },
    { label: 'TRABAJO ELÉCTRICO', value: 'ELECTRICO' },
    { label: 'TRABAJOS CON QUÍMICOS', value: 'QUIMICOS' },
    { label: 'IZAJES', value: 'IZAJES' },
    { label: 'EXCAVACIONES / ZANJAS', value: 'EXCAVACIONES' },
  ];

  // Identificar aprobaciones
  const solicitante = permiso.aprobaciones.find(a => a.rolFirmante === 'SOLICITANTE');
  const trabajador = permiso.aprobaciones.find(a => a.rolFirmante === 'TRABAJADOR');
  const hseq = permiso.aprobaciones.find(a => a.rolFirmante === 'APROBADOR_HSEQ');
  const area = permiso.aprobaciones.find(a => a.rolFirmante === 'APROBADOR_AREA');
  const liderCierre = permiso.aprobaciones.find(a => a.rolFirmante === 'LIDER');
  const medico = permiso.aprobacionMedica;
  const inspector = permiso.monitoreo;

  const personalAutorizadoLleno = permiso.personalAutorizado || [];
  const emptyRowsPersonal = Math.max(0, 4 - personalAutorizadoLleno.length);

  return (
    <div id={id} style={{ width: '816px', padding: '30px', backgroundColor: 'white', color: '#000', fontFamily: 'Arial, sans-serif' }}>

      {/* --- ENCABEZADO --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '8px' }}>
        <tbody>
          <tr>
            <td style={{ width: '20%', border: '1px solid #000', padding: '5px', textAlign: 'center' }}>
              <img src={logo} alt="Logo" style={{ width: '100px', objectFit: 'contain' }} />
            </td>
            <td style={{ width: '60%', border: '1px solid #000', padding: '5px', textAlign: 'center', verticalAlign: 'middle' }}>
              <h1 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>PERMISO DE TRABAJO DE ALTO RIESGO</h1>
              <h2 style={{ margin: '2px 0 0 0', fontSize: '11px', fontWeight: 'bold' }}>GESTIÓN DE SEGURIDAD Y SALUD OCUPACIONAL</h2>
            </td>
            <td style={{ width: '20%', border: '1px solid #000', padding: '5px', fontSize: '8px', verticalAlign: 'top' }}>
              <div style={{ marginBottom: '2px' }}><strong>CÓDIGO:</strong> SIPT-R01</div>
              <div style={{ marginBottom: '2px' }}><strong>REVISIÓN:</strong> 01</div>
              <div style={{ marginBottom: '2px' }}><strong>FECHA:</strong> {new Date().toLocaleDateString('es-EC')}</div>
              <div><strong>PÁGINA:</strong> 1 de 2</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* --- CONVENIO --- */}
      <div style={{ border: '1px solid #000', padding: '6px', fontSize: '7px', textAlign: 'justify', marginBottom: '8px' }}>
        <strong>CONVENIO PRIVADO DE RESPONSABILIDAD CIVIL DERIVADA DE CONTRATOS DE TRABAJO</strong>
        <p style={{ margin: '2px 0' }}>
          Yo, <strong>{permiso.solicitante.nombre}</strong>, {permiso.contratista ? `representante legal de la Compañía ${permiso.contratista}` : 'en calidad de Solicitante'}, que en adelante se denominará "LA CONTRATISTA", declaro ser el único y absoluto responsable sobre la contratación, acciones, dirección, control y administración de todos los trabajadores y/o colaboradores.
        </p>
      </div>

      {/* --- 1. INFORMACIÓN GENERAL (CON FIRMAS INCORPORADAS COMO EN LA IMAGEN) --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '8px', fontSize: '9px' }}>
        <tbody>
          {/* Fila de Firmas Superiores */}
          <tr style={{ height: '60px' }}>
            <td style={{ width: '25%', border: '1px solid #000', padding: '0' }}>
              <SignatureBoxSmall aprobacion={area} rol="APROBADOR (MODERNA ALIMENTOS)" />
            </td>
            <td style={{ width: '25%', border: '1px solid #000', padding: '0' }}>
              <SignatureBoxSmall aprobacion={solicitante} rol="EJECUTOR / CONTRATISTA" />
            </td>
            <td style={{ width: '25%', border: '1px solid #000', padding: '0' }}>
              <SignatureBoxSmall aprobacion={hseq} rol="REPRESENTANTE HSE" />
            </td>
            <td style={{ width: '25%', border: '1px solid #000', padding: '4px', verticalAlign: 'middle' }}>
              <div style={{ marginBottom: '4px' }}><strong>SOLICITUD:</strong> {formatDate(permiso.fechaSolicitud)}</div>
              <div style={{ marginBottom: '4px' }}><strong>INICIO:</strong> {formatDate(permiso.fechaInicio)}</div>
              <div><strong>FIN:</strong> {formatDate(permiso.fechaCaducidad)}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '8px', fontSize: '9px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={4} style={{ border: '1px solid #000', padding: '2px 4px', textAlign: 'left', fontSize: '10px' }}>1. INFORMACIÓN GENERAL</th>
            <th style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '10px' }}>Nro: {permiso.numero}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000', padding: '3px' }}><strong>LOCALIDAD:</strong></td>
            <td style={{ border: '1px solid #000', padding: '3px' }}>CAJABAMBA</td>
            <td style={{ border: '1px solid #000', padding: '3px' }}><strong>DEPARTAMENTO:</strong></td>
            <td colSpan={2} style={{ border: '1px solid #000', padding: '3px' }}>{permiso.departamento}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '3px' }}><strong>ÁREA:</strong></td>
            <td style={{ border: '1px solid #000', padding: '3px' }}>{permiso.area}</td>
            <td style={{ border: '1px solid #000', padding: '3px' }}><strong>EQUIPO:</strong></td>
            <td colSpan={2} style={{ border: '1px solid #000', padding: '3px' }}>{permiso.maquinaria}</td>
          </tr>
          <tr>
            <td colSpan={5} style={{ border: '1px solid #000', padding: '3px' }}>
              <strong>TRABAJO A REALIZAR:</strong> {permiso.descripcionGeneral}
            </td>
          </tr>
        </tbody>
      </table>

      {/* --- 2. TIPO DE TRABAJO --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '8px', fontSize: '9px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={4} style={{ border: '1px solid #000', padding: '2px 4px', textAlign: 'left', fontSize: '10px' }}>2. TIPO DE TRABAJO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px', width: '25%' }}>
              <Checkbox label={tiposTrabajoMap[0].label} checked={permiso.tiposTrabajo.includes(tiposTrabajoMap[0].value)} />
            </td>
            <td style={{ border: '1px solid #000', padding: '4px', width: '25%' }}>
              <Checkbox label={tiposTrabajoMap[1].label} checked={permiso.tiposTrabajo.includes(tiposTrabajoMap[1].value)} />
            </td>
            <td style={{ border: '1px solid #000', padding: '4px', width: '25%' }}>
              <Checkbox label={tiposTrabajoMap[2].label} checked={permiso.tiposTrabajo.includes(tiposTrabajoMap[2].value)} />
            </td>
            <td style={{ border: '1px solid #000', padding: '4px', width: '25%' }}>
              <Checkbox label={tiposTrabajoMap[3].label} checked={permiso.tiposTrabajo.includes(tiposTrabajoMap[3].value)} />
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px' }}>
              <Checkbox label={tiposTrabajoMap[4].label} checked={permiso.tiposTrabajo.includes(tiposTrabajoMap[4].value)} />
            </td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>
              <Checkbox label={tiposTrabajoMap[5].label} checked={permiso.tiposTrabajo.includes(tiposTrabajoMap[5].value)} />
            </td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>
              <Checkbox label={tiposTrabajoMap[6].label} checked={permiso.tiposTrabajo.includes(tiposTrabajoMap[6].value)} />
            </td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>
              <Checkbox label={tiposTrabajoMap[7].label} checked={permiso.tiposTrabajo.includes(tiposTrabajoMap[7].value)} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* --- 3. PERSONAL AUTORIZADO --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '8px', fontSize: '9px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={4} style={{ border: '1px solid #000', padding: '2px 4px', textAlign: 'left', fontSize: '10px' }}>3. PERSONAL AUTORIZADO</th>
          </tr>
          <tr style={{ backgroundColor: '#F5F5F5' }}>
            <th style={{ border: '1px solid #000', padding: '3px' }}>NOMBRES Y APELLIDOS</th>
            <th style={{ border: '1px solid #000', padding: '3px' }}>C.I.</th>
            <th style={{ border: '1px solid #000', padding: '3px' }}>ACTIVIDAD</th>
            <th style={{ border: '1px solid #000', padding: '3px' }}>FIRMA</th>
          </tr>
        </thead>
        <tbody>
          {personalAutorizadoLleno.map((p, i) => (
            <tr key={p.id || i}>
              <td style={{ border: '1px solid #000', padding: '3px' }}>{p.nombres} {p.apellidos}</td>
              <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{p.cedula}</td>
              <td style={{ border: '1px solid #000', padding: '3px' }}>{p.actividad || ''}</td>
              <td style={{ border: '1px solid #000', padding: '3px', height: '20px' }}></td>
            </tr>
          ))}
          {Array.from({ length: emptyRowsPersonal }).map((_, i) => (
            <tr key={`empty-${i}`}>
              <td style={{ border: '1px solid #000', padding: '3px', height: '20px' }}></td>
              <td style={{ border: '1px solid #000', padding: '3px' }}></td>
              <td style={{ border: '1px solid #000', padding: '3px' }}></td>
              <td style={{ border: '1px solid #000', padding: '3px' }}></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- 4. ATS --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '8px', fontSize: '9px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={4} style={{ border: '1px solid #000', padding: '2px 4px', textAlign: 'left', fontSize: '10px' }}>4. ANÁLISIS DE TRABAJO SEGURO (ATS)</th>
          </tr>
          <tr style={{ backgroundColor: '#F5F5F5' }}>
            <th style={{ border: '1px solid #000', padding: '3px', width: '30%' }}>DESCRIPCIÓN DE LA TAREA</th>
            <th style={{ border: '1px solid #000', padding: '3px', width: '30%' }}>PELIGROS</th>
            <th style={{ border: '1px solid #000', padding: '3px', width: '30%' }}>MEDIDAS DE CONTROL</th>
            <th style={{ border: '1px solid #000', padding: '3px', width: '10%' }}>PERSONAS</th>
          </tr>
        </thead>
        <tbody>
          {(permiso.ats.tareas || []).map((t, idx) => (
            <tr key={t.id || idx}>
              <td style={{ border: '1px solid #000', padding: '3px', verticalAlign: 'top' }}>{t.descripcion}</td>
              <td style={{ border: '1px solid #000', padding: '3px', verticalAlign: 'top' }}>
                <ul style={{ margin: 0, padding: '0 0 0 10px' }}>
                  {t.peligros.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </td>
              <td style={{ border: '1px solid #000', padding: '3px', verticalAlign: 'top' }}>
                <ul style={{ margin: 0, padding: '0 0 0 10px' }}>
                  {t.medidas.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </td>
              {idx === 0 && (
                <td rowSpan={permiso.ats.tareas.length} style={{ border: '1px solid #000', padding: '3px', textAlign: 'center', verticalAlign: 'middle' }}>
                  {permiso.ats.cantidadPersonas}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- 5. MONITOREO DE GASES --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '8px', fontSize: '9px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={3} style={{ border: '1px solid #000', padding: '2px 4px', textAlign: 'left', fontSize: '10px' }}>5. REGISTRO DE MONITOREO DE GASES (Si aplica)</th>
            <th style={{ border: '1px solid #000', padding: '2px 4px', textAlign: 'center' }}>INSPECTOR RESPONSABLE</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: '#F5F5F5', fontWeight: 'bold' }}>
            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>GAS</td>
            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>REGISTRO INICIAL</td>
            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>SEGUIMIENTO</td>
            <td rowSpan={5} style={{ border: '1px solid #000', padding: '0', verticalAlign: 'bottom', textAlign: 'center', width: '25%' }}>
               <SignatureBoxSmall aprobacion={inspector} rol="INSPECTOR DE SEGURIDAD" />
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '3px' }}>Oxígeno (O2)</td>
            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{permiso.monitoreo?.lecturaInicial?.o2 || ''}</td>
            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{permiso.monitoreo?.lecturaPeriodica?.o2 || ''}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '3px' }}>Monóxido (CO)</td>
            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{permiso.monitoreo?.lecturaInicial?.co || ''}</td>
            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{permiso.monitoreo?.lecturaPeriodica?.co || ''}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '3px' }}>Explosividad (LEL)</td>
            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{permiso.monitoreo?.lecturaInicial?.lel || ''}</td>
            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{permiso.monitoreo?.lecturaPeriodica?.lel || ''}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '3px' }}>Sulfhídrico (H2S)</td>
            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{permiso.monitoreo?.lecturaInicial?.h2s || ''}</td>
            <td style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>{permiso.monitoreo?.lecturaPeriodica?.h2s || ''}</td>
          </tr>
        </tbody>
      </table>

      {/* --- 6. FIRMAS DE APROBACIÓN --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '8px', fontSize: '9px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={4} style={{ border: '1px solid #000', padding: '2px 4px', textAlign: 'left', fontSize: '10px' }}>6. FIRMAS DE APROBACIÓN</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ height: '60px' }}>
            <td style={{ width: '25%', border: '1px solid #000', padding: '0' }}>
              <SignatureBoxSmall aprobacion={solicitante} rol="SOLICITANTE" />
            </td>
            <td style={{ width: '25%', border: '1px solid #000', padding: '0' }}>
              <SignatureBoxSmall aprobacion={trabajador} rol="TRABAJADOR" />
            </td>
            <td style={{ width: '25%', border: '1px solid #000', padding: '0' }}>
              <SignatureBoxSmall aprobacion={hseq} rol="APROBADOR HSEQ" />
            </td>
            <td style={{ width: '25%', border: '1px solid #000', padding: '0' }}>
              <SignatureBoxSmall aprobacion={area} rol="APROBADOR ÁREA" />
            </td>
          </tr>
          <tr style={{ height: '60px' }}>
            <td colSpan={4} style={{ border: '1px solid #000', padding: '0' }}>
              <SignatureBoxSmall aprobacion={medico} rol="APTITUD MÉDICA (SI APLICA)" />
            </td>
          </tr>
        </tbody>
      </table>

      {/* --- 7. TERMINACIÓN --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '8px', fontSize: '9px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={2} style={{ border: '1px solid #000', padding: '2px 4px', textAlign: 'left', fontSize: '10px' }}>7. TERMINACIÓN DEL PERMISO DE TRABAJO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2} style={{ border: '1px solid #000', padding: '4px' }}>
              <strong>TRABAJO CONCLUIDO:</strong> {permiso.estado === 'CERRADO' ? '[X] SÍ  [ ] NO' : '[ ] SÍ  [ ] NO'} 
              <span style={{ marginLeft: '20px' }}><strong>FECHA DE CULMINACIÓN:</strong> {permiso.estado === 'CERRADO' ? formatDateTime(permiso.fechaCaducidad) : '_________________'}</span>
            </td>
          </tr>
          <tr style={{ height: '60px' }}>
            <td style={{ width: '50%', border: '1px solid #000', padding: '0' }}>
              <SignatureBoxSmall aprobacion={liderCierre} rol="LÍDER / RESIDENTE (CIERRE)" />
            </td>
            <td style={{ width: '50%', border: '1px solid #000', padding: '0' }}>
              <SignatureBoxSmall aprobacion={null} rol="RESPONSABLE HSEQ (ARCHIVO)" />
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ border: '1px solid #000', padding: '4px', minHeight: '30px', verticalAlign: 'top' }}>
              <strong>OBSERVACIONES:</strong> {permiso.observacionesCierre || 'SIN NOVEDAD'}
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
};