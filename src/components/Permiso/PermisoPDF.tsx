import { FunctionalComponent } from 'preact';
import { Permiso, TipoTrabajo, Aprobacion, Monitoreo } from '@/types';
import logo from '@/images/logo.png';

interface PermisoPDFProps {
  permiso: Permiso | null;
  id: string;
}

// --- ESTILOS VISUALES Y ESTRUCTURALES ---
const STYLES = {
  container: {
    width: '900px',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#1F2937', 
    lineHeight: '1.4',
    position: 'relative' as const,
  },
  page: {
    padding: '40px', 
    backgroundColor: '#fff',
    boxSizing: 'border-box' as const,
    minHeight: '1150px', 
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '15px', 
    border: '1px solid #9CA3AF', 
    pageBreakInside: 'avoid',
    fontSize: '11px', 
  },
  cell: { border: '1px solid #9CA3AF', padding: '8px 10px', verticalAlign: 'middle', },
  cellCenter: { border: '1px solid #9CA3AF', padding: '8px 10px', verticalAlign: 'middle', textAlign: 'center' as const, },
  headerCell: { border: '1px solid #9CA3AF', padding: '10px', backgroundColor: '#E1F5FE', color: '#1565C0', fontWeight: '700', fontSize: '11px', textAlign: 'center' as const, textTransform: 'uppercase' as const, letterSpacing: '0.5px', },
  label: { fontWeight: '600', backgroundColor: '#F9FAFB', color: '#374151', width: '15%', fontSize: '10px', textTransform: 'uppercase' as const, },
  sectionTitle: {
    backgroundColor: '#374151', 
    color: '#fff',
    padding: '8px 15px',
    fontSize: '13px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    border: '1px solid #374151',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    marginTop: '25px',
    marginBottom: '-1px',
  },
  convenioBox: { border: '1px solid #9CA3AF', backgroundColor: '#F3F4F6', padding: '15px', fontSize: '9px', textAlign: 'justify' as const, marginBottom: '20px', lineHeight: '1.5', borderRadius: '4px', color: '#4B5563', },
  signatureBox: { height: '120px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'flex-end', alignItems: 'center', padding: '8px', },
  signatureImage: { maxHeight: '72px', maxWidth: '90%', objectFit: 'contain' as const, marginBottom: '4px', },
  signatureLine: { borderTop: '1px solid #6B7280', width: '85%', marginBottom: '4px', }
};

// --- HELPERS ---
const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('es-EC') : '';
const formatDateTime = (d?: string) => d ? new Date(d).toLocaleString('es-EC', { hour12: false }) : '';
const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

// --- SUB-COMPONENTES REUTILIZABLES ---

const CleanListItem: FunctionalComponent<{ text: string }> = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', margin: '2px 0 2px 0' }}>
        <span style={{ fontSize: '10px', marginRight: '6px', fontWeight: 'bold' }}>•</span>
        <span style={{ fontSize: '10px', lineHeight: '1.2' }}>{text}</span>
    </div>
);

const Checkbox = ({ label, checked }: { label: string; checked: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
    <div style={{ 
      width: '14px', height: '14px', border: '1px solid #4B5563', borderRadius: '2px', marginRight: '10px', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold',
      backgroundColor: checked ? '#374151' : '#FFF', color: 'transparent'
    }}>
      {checked ? ' ' : ''}
    </div>
    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#374151', fontWeight: checked ? '600' : '400' }}>{label}</span>
  </div>
);

const SignatureBlock = ({ firmaUrl, nombre, cargo, fecha }: { firmaUrl?: string | null, nombre?: string, cargo?: string, fecha?: string }) => (
  <div style={STYLES.signatureBox}>
    <div style={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '100%' }}>
      {firmaUrl && <img src={firmaUrl} alt="Firma" style={STYLES.signatureImage} />}
    </div>
    <div style={STYLES.signatureLine}></div>
    <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111' }}>{nombre || '_________________'}</div>
    <div style={{ fontSize: '8px', color: '#6B7280', textTransform: 'uppercase', marginTop: '2px' }}>{cargo}</div>
    {fecha && <div style={{ fontSize: '8px', color: '#6B7280' }}>{fecha}</div>}
  </div>
);

// HEADER REPETIBLE
const HeaderContent = ({ permiso, pageNumber }: { permiso: Permiso, pageNumber: number }) => (
  <table style={{ ...STYLES.table, border: 'none', marginBottom: '15px' }}>
    <tbody>
      <tr>
        <td style={{ ...STYLES.cellCenter, width: '20%', border: '1px solid #9CA3AF', padding: '10px', borderRadius: '4px' }}>
          <img src={logo} alt="Logo" style={{ width: '120px' }} />
        </td>
        <td style={{ ...STYLES.cellCenter, width: '60%', border: '1px solid #9CA3AF' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1F2937', letterSpacing: '1px' }}>PERMISO DE TRABAJO</h1>
          <div style={{ fontSize: '11px', marginTop: '5px', color: '#4B5563' }}>GESTIÓN DE SEGURIDAD Y SALUD OCUPACIONAL</div>
        </td>
        <td style={{ ...STYLES.cell, width: '20%', fontSize: '10px', border: '1px solid #9CA3AF', backgroundColor: '#F9FAFB', borderRadius: '4px' }}>
          <div style={{marginBottom: '4px'}}><strong>CÓDIGO:</strong> SIPT-R01</div>
          <div style={{marginBottom: '4px'}}><strong>REVISIÓN:</strong> 01</div>
          <div style={{marginBottom: '4px'}}><strong>FECHA:</strong> {new Date().toLocaleDateString()}</div>
          <div><strong>PÁGINA:</strong> {pageNumber} de 2</div>
        </td>
      </tr>
    </tbody>
  </table>
);

export const PermisoPDF: FunctionalComponent<PermisoPDFProps> = ({ permiso, id }) => {
  if (!permiso) return null;

  // --- DATOS ---
  const solicitante = permiso.aprobaciones.find(a => a.rolFirmante === 'SOLICITANTE');
  const hseq = permiso.aprobaciones.find(a => a.rolFirmante === 'APROBADOR_HSEQ');
  const area = permiso.aprobaciones.find(a => a.rolFirmante === 'APROBADOR_AREA');
  const lider = permiso.aprobaciones.find(a => a.rolFirmante === 'LIDER');
  const inspector = permiso.monitoreo;
  
  // Aquí obtenemos al TRABAJADOR para la firma de cabecera (Ejecutor)
  const trabajadorRep = permiso.aprobaciones.find(a => a.rolFirmante === 'TRABAJADOR');

  const tipos = [
    { l: 'Trabajo en Caliente', v: 'CALIENTE' }, { l: 'Trabajo en Frío', v: 'FRIO' },
    { l: 'Trabajo en Alturas', v: 'ALTURAS' }, { l: 'Espacios Confinados', v: 'ESPACIOS_CONFINADOS' },
    { l: 'Trabajo Eléctrico', v: 'ELECTRICO' }, { l: 'Trabajos con Químicos', v: 'QUIMICOS' },
    { l: 'Izajes de Cargas', v: 'IZAJES' }, { l: 'Excavaciones', v: 'EXCAVACIONES' }
  ];

  // Lógica de firma en tabla de personal (Solicitante)
  const getFirmaSiEsSolicitante = (nombres: string, apellidos: string) => {
    const nombreCompletoPersonal = normalize(`${nombres} ${apellidos}`);
    const nombreSolicitante = normalize(solicitante?.usuarioFirma?.nombre || '');
    const nombreRegistroSolicitante = normalize(permiso.solicitante.nombre || '');
    const estaFirmado = solicitante?.estado === 'FIRMADO' && solicitante.firmaUrl;

    if (estaFirmado) {
      const matchFirma = nombreSolicitante && (nombreCompletoPersonal.includes(nombreSolicitante) || nombreSolicitante.includes(nombreCompletoPersonal));
      const matchReg = nombreRegistroSolicitante && (nombreCompletoPersonal.includes(nombreRegistroSolicitante) || nombreRegistroSolicitante.includes(nombreCompletoPersonal));

      if (matchFirma || matchReg) {
         return <img src={solicitante.firmaUrl} alt="Firma" style={{ height: '42px', display: 'block', margin: '0 auto' }} />;
      }
    }
    return null;
  };

  return (
    <div id={id} style={{ ...STYLES.container, padding: 0 }}>
      
      {/* 1. Bloque de Encabezado (para ser capturado por separado en ambas páginas) */}
      <div id="pdf-header-content" style={{padding: '0 45px 0 45px'}}> 
          <HeaderContent permiso={permiso} pageNumber={1} /> 
      </div>

      {/* ================= BLOQUE DE PÁGINA 1 ================= */}
      <div id="page-1-content" style={STYLES.page}>
        <HeaderContent permiso={permiso} pageNumber={1} />
        
        {/* CONVENIO */}
        <div style={STYLES.convenioBox}>
          <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '8px', fontSize: '10px', color: '#1F2937' }}>CONVENIO PRIVADO DE RESPONSABILIDAD CIVIL DERIVADA DE CONTRATOS DE TRABAJO</div>
          <p style={{ margin: '0 0 8px 0' }}>
            Yo, <strong>{(permiso.solicitante.nombre || '').toUpperCase()}</strong>, en representación legal de la Compañía/Persona Natural <strong>{(permiso.contratista || 'MODERNA ALIMENTOS S.A.').toUpperCase()}</strong>, que en adelante se denominara "LA CONTRATISTA", declaro ser el único y absoluto responsable sobre la contratación, acciones, dirección, control y administración de todos los trabajadores y/o colaboradores, empleados para cumplir las obligaciones contractuales adquiridas con MODERNA ALIMENTOS S.A.; así como, dejo expresa constancia de mi compromiso para observar de la manera más estricta, las normas de prevención de riesgos de trabajo y seguridad industrial exigidas por MODERNA ALIMENTOS S.A., para la ejecución de trabajos dentro de sus instalaciones. En consecuencia, declaro que mantendré una relación directa con mi personal y dependientes; que proporcionaré a mis trabajadores equipos de protección personal, ropa, dispositivos y/o elementos adecuados para la realización de las tareas que les corresponda, sin responsabilidad alguna para MODERNA ALIMENTOS S.A., ni para sus administradores, accionistas y/o representantes.
          </p>
          <p style={{ margin: 0 }}>
            Si por un acto o resolución administrativa que causare estado, sea del Ministerio del Trabajo o del Instituto Ecuatoriano de Seguridad Social, o en virtud de alguna sentencia judicial de última instancia con efectos de cosa juzgada, MODERNA ALIMENTOS S.A., se viere obligada a pagar algún valor a favor de un trabajador contratado por LA CONTRATISTA; ésta se obliga a reembolsar inmediatamente dichos valores, incluidos los gastos en que haya incurrido MODERNA ALIMENTOS S.A., para su defensa. LA CONTRATISTA acepta haber recibido la inducción de las Normas de HSE y Calidad por parte del Coordinador de HSE y Jefe de Calidad, para la realización de su trabajo y en caso del incumplimiento de alguna de éstas, se suspenderá o paralizará el trabajo. Así también, deja expresa constancia y ratifica que todos los trabajadores y/o colaboradores que ocupará en el desarrollo del trabajo contratado, estarán debidamente afiliados al IESS, con pagos puntuales de sus obligaciones y por ningún concepto ingresará a las instalaciones de MODERNA ALIMENTOS S.A., con personas menores de quince años de edad. Cualquier acción u omisión que se ocasionare en contrario, será de su total aceptación y responsabilidad, incluyendo la aplicación de penalidad pecuniaria que previamente se fijare y de la terminación anticipada de contrato.
          </p>
        </div>

        {/* FIRMAS CABECERA */}
        <table style={STYLES.table}>
          <thead>
            <tr>
              <th style={STYLES.headerCell}>APROBADOR (MODERNA)</th>
              <th style={STYLES.headerCell}>EJECUTOR / CONTRATISTA</th>
              <th style={STYLES.headerCell}>REPRESENTANTE DE HSE</th>
              <th style={STYLES.headerCell}>FECHAS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...STYLES.cell, width: '25%', padding: 0 }}>
                <SignatureBlock firmaUrl={area?.firmaUrl} nombre={area?.usuarioFirma?.nombre} cargo="APROBADOR ÁREA" fecha={area?.estado === 'FIRMADO' ? formatDate(area.fechaFirma) : ''} />
              </td>
              <td style={{ ...STYLES.cell, width: '25%', padding: 0 }}>
                {/* AQUI ESTA EL CAMBIO: Usamos trabajadorRep en lugar de solicitante */}
                <SignatureBlock 
                  firmaUrl={trabajadorRep?.firmaUrl} 
                  nombre={trabajadorRep?.usuarioFirma?.nombre} 
                  cargo="TRABAJADOR" 
                  fecha={trabajadorRep?.estado === 'FIRMADO' ? formatDate(trabajadorRep.fechaFirma) : ''} 
                />
              </td>
              <td style={{ ...STYLES.cell, width: '25%', padding: 0 }}>
                <SignatureBlock firmaUrl={hseq?.firmaUrl} nombre={hseq?.usuarioFirma?.nombre} cargo="HSEQ" fecha={hseq?.estado === 'FIRMADO' ? formatDate(hseq.fechaFirma) : ''} />
              </td>
              <td style={{ ...STYLES.cell, width: '25%', fontSize: '10px', padding: '10px', verticalAlign: 'top', backgroundColor: '#F9FAFB' }}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                  <strong style={{minWidth: '50px'}}>SOLICITUD:</strong> <span>{formatDate(permiso.fechaSolicitud)}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                  <strong style={{minWidth: '50px'}}>INICIO:</strong> <span>{formatDate(permiso.fechaInicio)}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <strong>CADUCIDAD:</strong> <span>{formatDate(permiso.fechaCaducidad)}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 1. INFORMACIÓN GENERAL */}
        <div style={STYLES.sectionTitle}>1. INFORMACIÓN GENERAL <span style={{ float: 'right', fontWeight: 'normal', fontSize: '10px', opacity: 0.9 }}>Nro: <strong style={{ fontSize: '14px' }}>{permiso.numero}</strong></span></div>
        <table style={STYLES.table}>
          <tbody>
            <tr>
              <td style={{...STYLES.cell, ...STYLES.label}}>LOCALIDAD:</td>
              <td style={STYLES.cell}>CAJABAMBA</td>
              <td style={{...STYLES.cell, ...STYLES.label}}>DEPARTAMENTO:</td>
              <td style={STYLES.cell}>{permiso.departamento}</td>
              <td style={{...STYLES.cell, ...STYLES.label}}>ÁREA:</td>
              <td style={STYLES.cell}>{permiso.area}</td>
            </tr>
            <tr>
              <td style={{...STYLES.cell, ...STYLES.label}}>EQUIPO:</td>
              <td colSpan={5} style={STYLES.cell}>{permiso.maquinaria}</td>
            </tr>
            <tr>
              <td style={{...STYLES.cell, ...STYLES.label}}>TRABAJO:</td>
              <td colSpan={5} style={{ ...STYLES.cell, height: '40px', verticalAlign: 'top' }}>{permiso.descripcionGeneral}</td>
            </tr>
            <tr>
              <td style={{...STYLES.cell, ...STYLES.label}}>CONTRATISTA:</td>
              <td style={STYLES.cell}>{permiso.contratista || 'N/A'}</td>
              <td style={{...STYLES.cell, ...STYLES.label}}>RUC:</td>
              <td style={STYLES.cell}>{permiso.rucContratista || 'N/A'}</td>
            </tr>
          </tbody>
        </table>

        {/* 2. TIPO DE TRABAJO */}
        <div style={STYLES.sectionTitle}>2. TIPO DE TRABAJO</div>
        <table style={STYLES.table}>
          <tbody>
            <tr>
              {tipos.slice(0, 4).map((t, i) => (
                <td key={i} style={{ ...STYLES.cell, width: '25%', borderBottom: 'none' }}>
                  <Checkbox label={t.l} checked={permiso.tiposTrabajo.includes(t.v as any)} />
                </td>
              ))}
            </tr>
            <tr>
              {tipos.slice(4, 8).map((t, i) => (
              <td key={i} style={{ ...STYLES.cell, width: '25%', borderTop: 'none' }}>
                <Checkbox label={t.l} checked={permiso.tiposTrabajo.includes(t.v as any)} />
              </td>
            ))}
            </tr>
          </tbody>
        </table>

        {/* 3. PERSONAL AUTORIZADO --- */}
        <div style={STYLES.sectionTitle}>3. PERSONAL AUTORIZADO</div>
        <table style={STYLES.table}>
          <thead>
            <tr>
              <th style={{ ...STYLES.headerCell, width: '35%', textAlign: 'left' }}>NOMBRES Y APELLIDOS</th>
              <th style={{ ...STYLES.headerCell, width: '20%' }}>C.I.</th>
              <th style={{ ...STYLES.headerCell, width: '25%', textAlign: 'left' }}>ACTIVIDAD</th>
              <th style={{ ...STYLES.headerCell, width: '20%' }}>FIRMA</th>
            </tr>
          </thead>
          <tbody>
            {permiso.personalAutorizado.map(p => (
              <tr key={p.id}>
                <td style={STYLES.cell}>{p.nombres} {p.apellidos}</td>
                <td style={STYLES.cellCenter}>{p.cedula}</td>
                <td style={STYLES.cell}>{p.actividad || 'N/A'}</td>
                <td style={{ ...STYLES.cellCenter, padding: '0', height: '72px' }}>
                  {getFirmaSiEsSolicitante(p.nombres, p.apellidos)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= BLOQUE DE PÁGINA 2 ================= */}
      <div id="page-2-content" style={STYLES.page}>
        <HeaderContent permiso={permiso} pageNumber={2} /> {/* Header en P2 */}

        {/* 4. ATS (MOVIDO A PÁGINA 2) --- */}
        <div style={STYLES.sectionTitle}>4. ANÁLISIS DE TRABAJO SEGURO (ATS)</div>
        <table style={STYLES.table}>
          <thead>
            <tr>
              <th style={{ ...STYLES.headerCell, width: '25%' }}>TAREA</th>
              <th style={{ ...STYLES.headerCell, width: '30%' }}>PELIGROS</th>
              <th style={{ ...STYLES.headerCell, width: '35%' }}>MEDIDAS CONTROL</th>
              <th style={{ ...STYLES.headerCell, width: '10%' }}>PERS.</th>
            </tr>
          </thead>
          <tbody>
            {permiso.ats.tareas.map((t, i) => (
              <tr key={i}>
                <td style={{ ...STYLES.cell, verticalAlign: 'top' }}>{t.descripcion}</td>
                <td style={{ ...STYLES.cell, verticalAlign: 'top' }}>
                  {/* Lista limpia sin viñetas desalineadas */}
                  <div style={{padding: '5px 0'}}>
                    {t.peligros.map((x, j) => <CleanListItem key={j} text={x} />)}
                  </div>
                </td>
                <td style={{ ...STYLES.cell, verticalAlign: 'top' }}>
                   {/* Lista limpia sin viñetas desalineadas */}
                   <div style={{padding: '5px 0'}}>
                    {t.medidas.map((x, j) => <CleanListItem key={j} text={x} />)}
                  </div>
                </td>
                {i === 0 && (
                  <td rowSpan={permiso.ats.tareas.length} style={{ ...STYLES.cellCenter, fontWeight: 'bold', fontSize: '12px' }}>
                    {permiso.ats.cantidadPersonas}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 5. MONITOREO --- */}
        <div style={STYLES.sectionTitle}>5. REGISTRO DE MONITOREO DE GASES (Si aplica)</div>
        <table style={STYLES.table}>
          <thead>
            <tr>
              <th style={STYLES.headerCell}>GAS</th>
              <th style={STYLES.headerCell}>REGISTRO INICIAL</th>
              <th style={STYLES.headerCell}>REGISTRO A LA MITAD</th>
              <th style={STYLES.headerCell}>REGISTRO FINAL</th>
              <th style={{ ...STYLES.headerCell, width: '25%' }}>INSPECTOR RESPONSABLE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{...STYLES.cell, fontWeight: 'bold'}}>Oxígeno (O2)</td>
              <td style={STYLES.cellCenter}>{inspector?.lecturaInicial?.o2}</td>
              <td style={STYLES.cellCenter}>{''}</td> {/* A la mitad (Vacío) */}
              <td style={STYLES.cellCenter}>{inspector?.lecturaPeriodica?.o2}</td> {/* Final */}
              <td rowSpan={4} style={{ ...STYLES.cell, padding: 0, verticalAlign: 'bottom' }}>
                 <SignatureBlock 
                   firmaUrl={inspector?.firmaUrl} nombre={inspector?.usuarioFirma?.nombre} cargo="INSPECTOR"
                 />
              </td>
            </tr>
            <tr>
              <td style={{...STYLES.cell, fontWeight: 'bold'}}>Monóxido (CO)</td>
              <td style={STYLES.cellCenter}>{inspector?.lecturaInicial?.co}</td>
              <td style={STYLES.cellCenter}>{''}</td>
              <td style={STYLES.cellCenter}>{inspector?.lecturaPeriodica?.co}</td>
            </tr>
            <tr>
              <td style={{...STYLES.cell, fontWeight: 'bold'}}>Explosividad (LEL)</td>
              <td style={STYLES.cellCenter}>{inspector?.lecturaInicial?.lel}</td>
              <td style={STYLES.cellCenter}>{''}</td>
              <td style={STYLES.cellCenter}>{inspector?.lecturaPeriodica?.lel}</td>
            </tr>
            <tr>
              <td style={{...STYLES.cell, fontWeight: 'bold'}}>PH3 (FOSFINA)</td>
              <td style={STYLES.cellCenter}>{inspector?.lecturaInicial?.h2s || ''}</td>
              <td style={STYLES.cellCenter}>{''}</td>
              <td style={STYLES.cellCenter}>{inspector?.lecturaPeriodica?.h2s || ''}</td>
            </tr>
          </tbody>
        </table>

        {/* 6. FIRMAS DE APROBACIÓN --- */}
        <div style={STYLES.sectionTitle}>6. FIRMAS DE APROBACIÓN</div>
        <table style={STYLES.table}>
          <tbody>
            <tr>
              <td style={{ ...STYLES.cell, width: '25%', padding: 0 }}>
                <SignatureBlock firmaUrl={solicitante?.firmaUrl} nombre={solicitante?.usuarioFirma?.nombre} cargo="SOLICITANTE" />
              </td>
              <td style={{ ...STYLES.cell, width: '25%', padding: 0 }}>
                <SignatureBlock 
                   firmaUrl={trabajadorRep?.firmaUrl} 
                   nombre={trabajadorRep?.usuarioFirma?.nombre || '_________________'} 
                   cargo="TRABAJADOR (REP)" 
                />
              </td>
              <td style={{ ...STYLES.cell, width: '25%', padding: 0 }}>
                <SignatureBlock firmaUrl={hseq?.firmaUrl} nombre={hseq?.usuarioFirma?.nombre} cargo="APROBADOR HSEQ" />
              </td>
              <td style={{ ...STYLES.cell, width: '25%', padding: 0 }}>
                <SignatureBlock firmaUrl={area?.firmaUrl} nombre={area?.usuarioFirma?.nombre} cargo="APROBADOR ÁREA" />
              </td>
            </tr>
            {permiso.aprobacionMedica && (
              <tr>
                <td colSpan={4} style={{ ...STYLES.cell, padding: 0 }}>
                  <SignatureBlock firmaUrl={permiso.aprobacionMedica.firmaUrl} nombre={permiso.aprobacionMedica.usuarioFirma?.nombre} cargo="APTITUD MÉDICA" />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 7. TERMINACIÓN --- */}
        <div style={STYLES.sectionTitle}>7. TÉRMINO DEL PERMISO DE TRABAJO</div>
        <table style={STYLES.table}>
          <tbody>
            <tr>
              <td colSpan={2} style={{ ...STYLES.cell, padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <strong>TRABAJO CONCLUIDO:</strong> 
                    <span style={{ marginLeft: '25px', fontWeight: 'bold' }}>{permiso.estado === 'CERRADO' ? '[ X ] SÍ' : '[   ] SÍ'}</span>
                    <span style={{ marginLeft: '25px' }}>{permiso.estado !== 'CERRADO' ? '[ X ] NO' : '[   ] NO'}</span>
                  </div>
                  <div>
                     <strong>FECHA DE CULMINACIÓN:</strong> 
                     <span style={{ marginLeft: '15px', borderBottom: '1px solid #000', minWidth: '180px', display: 'inline-block', textAlign: 'center', fontWeight: 'bold' }}>
                       {permiso.estado === 'CERRADO' ? formatDateTime(permiso.fechaCaducidad) : ''}
                     </span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ ...STYLES.cell, width: '50%', padding: 0 }}>
                 <SignatureBlock firmaUrl={lider?.firmaUrl} nombre={lider?.usuarioFirma?.nombre} cargo="LÍDER / RESIDENTE (CIERRE)" />
              </td>
              <td style={{ ...STYLES.cell, width: '50%', padding: 0 }}>
                 <SignatureBlock firmaUrl={null} nombre="_________________" cargo="RESPONSABLE HSEQ (ARCHIVO)" />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ ...STYLES.cell, height: '40px', verticalAlign: 'top' }}>
                <strong>OBSERVACIONES:</strong> {permiso.observacionesCierre || 'SIN NOVEDAD'}
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Footer */}
        <div style={{ fontSize: '9px', color: '#6B7280', textAlign: 'center', marginTop: '20px', borderTop: '1px solid #E5E7EB', paddingTop: '10px' }}>
          El responsable de la contratación y el ejecutor del trabajo certifican que el área de trabajo queda limpia y ordenada.
        </div>
      </div>
    </div>
  );
};