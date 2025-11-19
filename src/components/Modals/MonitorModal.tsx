import { FunctionalComponent } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { LecturaGases } from '@/types';

interface MonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    signatureDataUrl: string,
    lecturaInicial: LecturaGases,
    lecturaIntermedia: LecturaGases,
    lecturaFinal: LecturaGases
  ) => void;
  title?: string;
}

const emptyGases: LecturaGases = { o2: '', co: '', lel: '', h2s: '' };

export const MonitorModal: FunctionalComponent<MonitorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Registro de Gases"
}) => {
  // --- Lógica de Canvas ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // --- Estados para las 3 Lecturas ---
  const [lecturaInicial, setLecturaInicial] = useState<LecturaGases>({ ...emptyGases });
  const [lecturaIntermedia, setLecturaIntermedia] = useState<LecturaGases>({ ...emptyGases });
  const [lecturaFinal, setLecturaFinal] = useState<LecturaGases>({ ...emptyGases });

  const getCtx = () => canvasRef.current?.getContext('2d');

  // CORRECCIÓN DE DISTORSIÓN: Ajuste de escala
  const getPos = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const event = 'touches' in e ? e.touches[0] : e;
    
    // Calculamos la escala por si el canvas se redimensiona con CSS
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    // Prevenir scroll en móviles al firmar
    if (e.type === 'touchstart') {
       // No prevenimos default aquí para no bloquear clicks, pero sí en move
    } else {
       e.preventDefault();
    }
    
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault(); // Evitar scroll al dibujar
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const resetForm = () => {
    clearSignature();
    setLecturaInicial({ ...emptyGases });
    setLecturaIntermedia({ ...emptyGases });
    setLecturaFinal({ ...emptyGases });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirm = () => {
    if (canvasRef.current && hasSignature) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      // Validar campos básicos
      if (!lecturaInicial.o2 || !lecturaIntermedia.o2 || !lecturaFinal.o2) {
         return alert('Por favor complete al menos el campo O2 en las 3 lecturas.');
      }
      onConfirm(dataUrl, lecturaInicial, lecturaIntermedia, lecturaFinal);
      handleClose();
    } else {
      alert('Debe firmar para continuar.');
    }
  };

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
    if (!isOpen) resetForm();
  }, [isOpen]);

  if (!isOpen) return null;

  const updateGases = (setter: (v: LecturaGases) => void, current: LecturaGases, field: keyof LecturaGases, value: string) => {
    setter({ ...current, [field]: value });
  };

  const renderGasForm = (label: string, data: LecturaGases, setter: (v: LecturaGases) => void) => (
    <div className="bg-gray-700 p-3 rounded-lg space-y-2 mb-4 md:mb-0 border border-gray-600">
      <h4 className="text-sm font-bold text-yellow-400 uppercase mb-2 border-b border-gray-500 pb-1">{label}</h4>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-gray-300">O2 (%)</label>
        <Input value={data.o2} onInput={(e) => updateGases(setter, data, 'o2', (e.target as HTMLInputElement).value)} className="!h-8 !text-sm !p-1" />
        
        <label className="text-xs text-gray-300">LEL (%)</label>
        <Input value={data.lel} onInput={(e) => updateGases(setter, data, 'lel', (e.target as HTMLInputElement).value)} className="!h-8 !text-sm !p-1" />
        
        <label className="text-xs text-gray-300">CO (ppm)</label>
        <Input value={data.co} onInput={(e) => updateGases(setter, data, 'co', (e.target as HTMLInputElement).value)} className="!h-8 !text-sm !p-1" />
        
        <label className="text-xs text-gray-300">H2S (ppm)</label>
        <Input value={data.h2s} onInput={(e) => updateGases(setter, data, 'h2s', (e.target as HTMLInputElement).value)} className="!h-8 !text-sm !p-1" />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto text-white" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <p className="text-sm text-gray-300 mb-4">
          Por favor registre los valores de gases para las tres etapas del monitoreo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {renderGasForm('1. Lectura Inicial', lecturaInicial, setLecturaInicial)}
          {renderGasForm('2. Lectura Intermedia', lecturaIntermedia, setLecturaIntermedia)}
          {renderGasForm('3. Lectura Final', lecturaFinal, setLecturaFinal)}
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-300 mb-2">Firma del Inspector (Obligatorio):</p>
          <div className="border-2 border-gray-600 rounded-lg bg-white p-1">
            <canvas
              ref={canvasRef}
              width={600} 
              height={200}
              className="w-full h-40 cursor-crosshair touch-none block"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Dibuje su firma en el recuadro blanco.</p>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
          <Button onClick={clearSignature} className="bg-gray-600 text-white hover:bg-gray-500" disabled={!hasSignature}>Limpiar Firma</Button>
          <Button onClick={handleClose} className="bg-gray-600 text-white hover:bg-gray-500">Cancelar</Button>
          <Button onClick={handleConfirm} className="bg-green-600 text-white hover:bg-green-500 disabled:opacity-50" disabled={!hasSignature}>Confirmar y Guardar</Button>
        </div>

      </div>
    </div>
  );
};