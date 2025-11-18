import { FunctionalComponent } from 'preact';
import { Button } from '@/components/UI/Button';

interface ConvenioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  solicitanteName: string;
}

export const ConvenioModal: FunctionalComponent<ConvenioModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  solicitanteName,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 text-center">
          CONVENIO PRIVADO DE RESPONSABILIDAD CIVIL DERIVADA DE CONTRATOS DE TRABAJO
        </h2>

        <div className="flex-1 overflow-y-auto mb-4 sm:mb-6 pr-2">
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
            <p>
              Yo, <strong>{solicitanteName}</strong>, en representación legal de la Compañía/Persona Natural la empresa Contratista, que en adelante se denominará <strong>"LA CONTRATISTA"</strong>, declaro ser el único y absoluto responsable sobre la contratación, acciones, dirección, control y administración de todos los trabajadores y/o colaboradores, empleados para cumplir las obligaciones contractuales adquiridas con <strong>MODERNA ALIMENTOS S.A.</strong>; así como, dejo expresa constancia de mi compromiso para observar de la manera más estricta, las normas de prevención de riesgos de trabajo y seguridad industrial exigidas por <strong>MODERNA ALIMENTOS S.A.</strong>, para la ejecución de trabajos dentro de sus instalaciones.
            </p>

            <p>
              En consecuencia, declaro que mantendré una relación directa con mi personal y dependientes; que proporcionaré a mis trabajadores equipos de protección personal, ropa, dispositivos y/o elementos adecuados para la realización de las tareas que les corresponda, sin responsabilidad alguna para <strong>MODERNA ALIMENTOS S.A.</strong>, ni para sus administradores, accionistas y/o representantes.
            </p>

            <p>
              Si por un acto o resolución administrativa que causare estado, sea del Ministerio del Trabajo o del Instituto Ecuatoriano de Seguridad Social, o en virtud de alguna sentencia judicial de última instancia con efectos de cosa juzgada, <strong>MODERNA ALIMENTOS S.A.</strong>, se viere obligada a pagar algún valor a favor de un trabajador contratado por <strong>LA CONTRATISTA</strong>; ésta se obliga a reembolsar inmediatamente dichos valores, incluidos los gastos en que haya incurrido <strong>MODERNA ALIMENTOS S.A.</strong>, para su defensa.
            </p>

            <p>
              <strong>LA CONTRATISTA</strong> acepta haber recibido la inducción de las Normas de HSE y Calidad por parte del Coordinador de HSE y Jefe de Calidad, para la realización de su trabajo y en caso del incumplimiento de alguna de éstas, se suspenderá o paralizará el trabajo.
            </p>

            <p>
              Así también, dejo expresa constancia y ratifico que todos los trabajadores y/o colaboradores que ocupará en el desarrollo del trabajo contratado, estarán debidamente afiliados al IESS, con pagos puntuales de sus obligaciones y por ningún concepto ingresará a las instalaciones de <strong>MODERNA ALIMENTOS S.A.</strong>, con personas menores de quince años de edad.
            </p>

            <p>
              Cualquier acción u omisión que se ocasionare en contrario, será de su total aceptación y responsabilidad, incluyendo la aplicación de penalidad pecuniaria que previamente se fijare y de la terminación anticipada de contrato.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-4 border-t border-gray-700">
          <Button
            onClick={onClose}
            className="bg-gray-600 text-white hover:bg-gray-500 px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-rojo-moderna text-white hover:bg-rojo-moderna-dark px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Aceptar Términos y Condiciones</span>
            <span className="sm:hidden">Aceptar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

