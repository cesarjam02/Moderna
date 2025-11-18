import { FunctionalComponent } from 'preact';
import { Permiso, TipoTrabajo, PersonalAutorizado, Aprobacion, Monitoreo } from '@/types';
import logo from '@/images/logo.png'; 

interface PermisoPDFProps {
  permiso: Permiso | null;
  id: string;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '---';
  return date.toLocaleString('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Checkbox: FunctionalComponent<{ label: string; checked: boolean }> = ({ label, checked }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px', fontSize: '9px' }}>
    <div style={{
      width: '12px',
      height: '12px',
      border: '1px solid #000',
      marginRight: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontWeight: 'bold',
    }}>
      {checked ? 'X' : ''}
    </div>
    <span>{label}</span>
  </div>
);

const SignatureBox: FunctionalComponent<{ aprobacion?: Aprobacion | Monitoreo | null; rol: string }> = ({ aprobacion, rol }) => {
  const isSigned = aprobacion?.estado === 'FIRMADO';
  const firma = isSigned && 'firmaUrl' in aprobacion && aprobacion.firmaUrl 
    ? <img src={aprobacion.firmaUrl} alt="Firma" style={{ height: '30px', width: 'auto', margin: '0 auto', borderBottom: '1px solid #999' }} /> 
    : <div style={{ height: '30px', borderBottom: '1px solid #999' }}></div>;

  const nombre = isSigned ? aprobacion.usuarioFirma?.nombre : '';
  const fecha = isSigned ? formatDate(aprobacion.fechaFirma) : '';

  return (
    <div style={{ padding: '4px', height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', textAlign: 'center' }}>
      {firma}
      <p style={{ margin: '2px 0 0 0', fontSize: '9px', fontWeight: 'bold' }}>{nombre}</p>
      <p style={{ margin: '0', fontSize: '8px', color: '#333' }}>{rol}</p>
      <p style={{ margin: '0', fontSize: '8px', color: '#333' }}>{fecha}</p>
    </div>
  );
};

export const PermisoPDF: FunctionalComponent<PermisoPDFProps> = ({ permiso, id }) => {
  if (!permiso) return null;

  const allTiposTrabajo: TipoTrabajo[] = [
    'TRABAJO EN CALIENTE', 'TRABAJO EN FRIO', 'TRABAJO EN ALTURAS',
    'TRABAJO ELECTRICO', 'TRABAJOS CON QUIMICOS', 'ESPACIOS CONFINADOS',
    'IZAJES', 'EXCAVACIONES'
  ];

  const solicitante = permiso.aprobaciones.find(a => a.rolFirmante === 'SOLICITANTE');
  const trabajador = permiso.aprobaciones.find(a => a.rolFirmante === 'TRABAJADOR');
  const hseq = permiso.aprobaciones.find(a => a.rolFirmante === 'APROBADOR_HSEQ');
  const area = permiso.aprobaciones.find(a => a.rolFirmante === 'APROBADOR_AREA');
  const lider = permiso.aprobaciones.find(a => a.rolFirmante === 'LIDER');
  const medico = permiso.aprobacionMedica;
  const inspector = permiso.monitoreo;

  return (
    <div id={id} style={{ width: '816px', padding: '30px', backgroundColor: 'white', color: '#000', fontFamily: 'Arial, sans-serif' }}>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px' }}>
        <tbody>
          <tr>
            <td style={{ width: '25%', border: '1px solid #000', padding: '5px', textAlign: 'center' }}>
              <img src={logo} alt="Logo" style={{ width: '150px', objectFit: 'contain' }} />
            </td>
            <td style={{ width: '50%', border: '1px solid #000', padding: '5px', textAlign: 'center', verticalAlign: 'top' }}>
              <h1 style={{ margin: '10px 0 5px 0', fontSize: '13px', fontWeight: 'bold' }}>PERMISO DE TRABAJO DE ALTO RIESGO</h1>
              <h2 style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>GESTIÓN DE SEGURIDAD Y SALUD OCUPACIONAL</h2>
            </td>
            <td style={{ width: '25%', border: '1px solid #000', padding: '5px', fontSize: '10px', verticalAlign: 'top' }}>
              <div><strong>CÓDIGO:</strong></div>
              <div><strong>REVISIÓN:</strong> 01</div>
              <div><strong>FECHA:</strong> {new Date().toLocaleDateString('es-EC')}</div>
              <div><strong>PÁGINA:</strong> 1 de 2</div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style={{ border: '1px solid #000', padding: '8px', fontSize: '9px', textAlign: 'justify', marginBottom: '10px' }}>
        <strong>CONVENIO PRIVADO DE RESPONSABILIDAD CIVIL DERIVADA DE CONTRATOS DE TRABAJO</strong>
        <p style={{ margin: '5px 0' }}>
          Yo, {permiso.contratista ? `representante legal de la Compañía ${permiso.contratista}` : (permiso.solicitante.nombre || '____________________')} que en
          adelante se denominará "LA CONTRATISTA", declaro ser el único y absoluto responsable sobre la contratación, acciones, dirección, control y administración
          de todos los trabajadores y/o colaboradores, empleados para cumplir las obligaciones contractuales adquiridas con MODERNA ALIMENTOS S.A.; así como,
          dejo expresa constancia de mi compromiso para observar de la manera más estricta, las normas de prevención de riesgos de trabajo y seguridad industrial
          exigidas por MODERNA ALIMENTOS S.A., para la ejecución de trabajos dentro de sus instalaciones. En consecuencia, declaro que mantendré una relación
          directa con mi personal y dependientes; que proporcionaré a mis trabajadores equipos de protección personal, ropa, dispositivos y/o elementos adecuados para
          la realización de las tareas que les corresponda, sin responsabilidad alguna para MODERNA ALIMENTOS S.A., ni para sus administradores, accionistas y/o
          representantes.
        </p>
        <p style={{ margin: '5px 0' }}>
          Si por un acto o resolución administrativa que causare estado, sea del Ministerio del Trabajo o del Instituto Ecuatoriano de Seguridad Social, o en virtud de alguna
          sentencia judicial de última instancia con efectos de cosa juzgada, MODERNA ALIMENTOS S.A., se viere obligada a pagar algún valor a favor de un trabajador
          contratado por LA CONTRATISTA, por concepto de indemnización por accidente de trabajo, enfermedad profesional, desahucio, despido intempestivo,
          jubilación patronal o cualquier otra obligación o beneficio social, LA CONTRATISTA se obliga expresamente a reembolsar a MODERNA ALIMENTOS S.A., el
          valor íntegro de lo pagado, incluyendo capital, intereses, costas judiciales, honorarios profesionales y cualquier otro gasto.
        </p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px', fontSize: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={3} style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>1. INFORMACIÓN GENERAL</th>
            <th style={{ border: '1px solid #000', padding: '4px' }}>Nro. Permiso: {permiso.numero}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px', width: '33%' }}><strong>FECHA SOLICITUD:</strong> {formatDate(permiso.fechaSolicitud)}</td>
            <td style={{ border: '1px solid #000', padding: '4px', width: '33%' }}><strong>FECHA INICIO:</strong> {formatDate(permiso.fechaInicio)}</td>
            <td style={{ border: '1px solid #000', padding: '4px', width: '33%' }} colSpan={2}><strong>FECHA FIN:</strong> {formatDate(permiso.fechaCaducidad)}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px' }}><strong>DEPARTAMENTO:</strong> {permiso.departamento}</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}><strong>ÁREA:</strong> {permiso.area}</td>
            <td style={{ border: '1px solid #000', padding: '4px' }} colSpan={2}><strong>EQUIPO/MAQUINARIA:</strong> {permiso.maquinaria}</td>
          </tr>
          <tr>
            <td colSpan={4} style={{ border: '1px solid #000', padding: '4px' }}><strong>TRABAJO A REALIZAR:</strong> {permiso.descripcionGeneral}</td>
          </tr>
          <tr>
            <td colSpan={2} style={{ border: '1px solid #000', padding: '4px' }}><strong>EMPRESA CONTRATISTA:</strong> {permiso.contratista || ''}</td>
            <td colSpan={2} style={{ border: '1px solid #000', padding: '4px' }}><strong>RUC:</strong> {permiso.rucContratista || ''}</td>
          </tr>
        </tbody>
      </table>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px', fontSize: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={4} style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>2. TIPO DE TRABAJO (Marque con una X el tipo de trabajo a realizar)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {[0, 1, 2, 3].map(i => (
              <td key={i} style={{ border: '1px solid #000', padding: '4px', width: '25%' }}>
                <Checkbox label={allTiposTrabajo[i]} checked={permiso.tiposTrabajo.includes(allTiposTrabajo[i])} />
              </td>
            ))}
          </tr>
          <tr>
            {[4, 5, 6, 7].map(i => (
              <td key={i} style={{ border: '1px solid #000', padding: '4px', width: '25%' }}>
                <Checkbox label={allTiposTrabajo[i]} checked={permiso.tiposTrabajo.includes(allTiposTrabajo[i])} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px', fontSize: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={4} style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>3. PERSONAL AUTORIZADO</th>
          </tr>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th style={{ border: '1px solid #000', padding: '4px' }}>NOMBRES Y APELLIDOS</th>
            <th style={{ border: '1px solid #000', padding: '4px' }}>C.I.</th>
            <th style={{ border: '1px solid #000', padding: '4px' }}>ACTIVIDAD</th>
            <th style={{ border: '1px solid #000', padding: '4px', width: '25%' }}>FIRMA</th>
          </tr>
        </thead>
        <tbody>
          {(permiso.personalAutorizado || []).map((p, i) => (
            <tr key={p.id || i}>
              <td style={{ border: '1px solid #000', padding: '4px' }}>{p.nombres} {p.apellidos}</td>
              <td style={{ border: '1px solid #000', padding: '4px' }}>{p.cedula}</td>
              <td style={{ border: '1px solid #000', padding: '4px' }}>{p.actividad || ''}</td>
              <td style={{ border: '1px solid #000', padding: '4px', height: '30px' }}></td>
            </tr>
          ))}
          {Array.from({ length: Math.max(0, 4 - permiso.personalAutorizado.length) }).map((_, i) => (
             <tr key={`empty-${i}`}>
              <td style={{ border: '1px solid #000', padding: '4px', height: '30px' }}></td>
              <td style={{ border: '1px solid #000', padding: '4px' }}></td>
              <td style={{ border: '1px solid #000', padding: '4px' }}></td>
              <td style={{ border: '1px solid #000', padding: '4px' }}></td>
            </tr>
          ))}
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px', fontSize: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={3} style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>4. ANÁLISIS DE TRABAJO SEGURO (ATS)</th>
          </tr>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th style={{ border: '1px solid #000', padding: '4px', width: '33%' }}>DESCRIPCIÓN DE LA TAREA</th>
            <th style={{ border: '1px solid #000', padding: '4px', width: '33%' }}>PELIGROS IDENTIFICADOS</th>
            <th style={{ border: '1px solid #000', padding: '4px', width: '33%' }}>MEDIDAS DE CONTROL</th>
          </tr>
        </thead>
        <tbody>
          {(permiso.ats.tareas || []).map((t, idx) => (
            <tr key={t.id || idx}>
              <td style={{ border: '1px solid #000', padding: '4px', verticalAlign: 'top' }}>{t.descripcion}</td>
              <td style={{ border: '1px solid #000', padding: '4px', verticalAlign: 'top' }}>
                <ul style={{ margin: 0, padding: '0 0 0 15px', listStyle: 'disc' }}>
                  {t.peligros.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </td>
              <td style={{ border: '1px solid #000', padding: '4px', verticalAlign: 'top' }}>
                <ul style={{ margin: 0, padding: '0 0 0 15px', listStyle: 'disc' }}>
                  {t.medidas.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* --- INICIO PÁGINA 2 --- */}
      <div style={{ pageBreakBefore: 'always' }}></div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px', fontSize: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={4} style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>5. REGISTRO DE MONITOREO DE GASES (Si aplica)</th>
          </tr>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th style={{ border: '1px solid #000', padding: '4px' }}>GAS</th>
            <th style={{ border: '1px solid #000', padding: '4px' }}>VMP</th>
            <th style={{ border: '1px solid #000', padding: '4px' }}>REGISTRO INICIAL</th>
            <th style={{ border: '1px solid #000', padding: '4px' }}>SEGUIMIENTO DEL MONITOREO CONTINUO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px' }}>Oxígeno (O2)</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>19.5% - 22%</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{permiso.monitoreo?.lecturaInicial?.o2 || ''}</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{permiso.monitoreo?.lecturaPeriodica?.o2 || ''}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px' }}>Monóxido de Carbono (CO)</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>25 ppm</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{permiso.monitoreo?.lecturaInicial?.co || ''}</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{permiso.monitoreo?.lecturaPeriodica?.co || ''}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px' }}>% LEL</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{"< 5%"}</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{permiso.monitoreo?.lecturaInicial?.lel || ''}</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{permiso.monitoreo?.lecturaPeriodica?.lel || ''}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '4px' }}>Ácido Sulfhídrico (H2S)</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>10 ppm</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{permiso.monitoreo?.lecturaInicial?.h2s || ''}</td>
            <td style={{ border: '1px solid #000', padding: '4px' }}>{permiso.monitoreo?.lecturaPeriodica?.h2s || ''}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ border: '1px solid #000', borderTop: 'none', marginBottom: '10px' }}>
        <SignatureBox aprobacion={inspector} rol="Inspector Responsable (HSEQ)" />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={4} style={{ border: '1px solid #000', padding: '4px', textAlign: 'left', fontSize: '12px' }}>6. FIRMAS DE APROBACIÓN</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td style={{ width: '25%', border: '1px solid #000' }}><SignatureBox aprobacion={solicitante} rol="Solicitante" /></td>
              <td style={{ width: '25%', border: '1px solid #000' }}><SignatureBox aprobacion={trabajador} rol="Trabajador" /></td>
              <td style={{ width: '25%', border: '1px solid #000' }}><SignatureBox aprobacion={hseq} rol="Aprobador HSEQ" /></td>
              <td style={{ width: '25%', border: '1px solid #000' }}><SignatureBox aprobacion={area} rol="Aprobador Área" /></td>
            </tr>
            <tr>
              <td colSpan={4} style={{ border: '1px solid #000' }}><SignatureBox aprobacion={medico} rol="Aptitud Médica" /></td>
            </tr>
        </tbody>
      </table>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#E0E0E0' }}>
            <th colSpan={2} style={{ border: '1px solid #000', padding: '4px', textAlign: 'left', fontSize: '12px' }}>7. TERMINACIÓN DEL PERMISO DE TRABAJO</th>
          </tr>
        </thead>
         <tbody>
            <tr>
              <td style={{ width: '50%', border: '1x solid #000' }}><SignatureBox aprobacion={lider} rol="Líder / Residente (Cierre)" /></td>
              <td style={{ width: '50%', border: '1px solid #000' }}><SignatureBox aprobacion={null} rol="Responsable HSEQ (Archivo)" /></td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '5px', fontSize: '10px' }}>
                <strong>Observaciones:</strong>
                <div style={{ minHeight: '30px' }}>
                  {permiso.observacionesCierre || ''}
                </div>
              </td>
            </tr>
          </tbody>
      </table>

    </div>
  );
};