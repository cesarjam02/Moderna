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
    lecturaPeriodica: LecturaGases | null
  ) => void;
}

export const MonitorModal: FunctionalComponent<MonitorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const [lecturaInicial, setLecturaInicial] = useState<LecturaGases>({ o2: '', co: '', lel: '', h2s: '' });
  const [lecturaPeriodica, setLecturaPeriodica] = useState<LecturaGases>({ o2: '', co: '', lel: '', h2s: '' });
  const [hasPeriodica, setHasPeriodica] = useState(false);

  const getCtx = () => canvasRef.current?.getContext('2d');

  const getPos = (e: MouseEvent | TouchEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const event = 'touches' in e ? e.touches[0] : e;
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
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
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

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
    setLecturaInicial({ o2: '', co: '', lel: '', h2s: '' });
    setLecturaPeriodica({ o2: '', co: '', lel: '', h2s: '' });
    setHasPeriodica(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirm = () => {
    if (canvasRef.current && hasSignature) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const finalPeriodica = hasPeriodica ? lecturaPeriodica : null;
      onConfirm(dataUrl, lecturaInicial, finalPeriodica);
      handleClose();
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
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const canConfirm = hasSignature && 
                     lecturaInicial.o2.trim() !== '' && 
                     lecturaInicial.co.trim() !== '' && 
                     lecturaInicial.lel.trim() !== '' && 
                     lecturaInicial.h2s.trim() !== '';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Monitoreo de Gases</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold mb-2">Lectura Inicial (Obligatorio)</h3>
            <div className="space-y-2">
              <Input type="text" placeholder="O2 (%)" value={lecturaInicial.o2} onInput={(e) => setLecturaInicial(p => ({ ...p, o2: (e.target as HTMLInputElement).value }))} />
              <Input type="text" placeholder="CO (ppm)" value={lecturaInicial.co} onInput={(e) => setLecturaInicial(p => ({ ...p, co: (e.target as HTMLInputElement).value }))} />
              <Input type="text" placeholder="LEL (%)" value={lecturaInicial.lel} onInput={(e) => setLecturaInicial(p => ({ ...p, lel: (e.target as HTMLInputElement).value }))} />
              <Input type="text" placeholder="H2S (ppm)" value={lecturaInicial.h2s} onInput={(e) => setLecturaInicial(p => ({ ...p, h2s: (e.target as HTMLInputElement).value }))} />
            </div>
          </div>
          <div>
            <label className="flex items-center space-x-2 mb-2">
              <input type="checkbox" checked={hasPeriodica} onChange={(e) => setHasPeriodica((e.target as HTMLInputElement).checked)} />
              <span>Añadir Lectura Periódica (Opcional)</span>
            </label>
            {hasPeriodica && (
              <div className="space-y-2 animate-fadeIn">
                <Input type="text" placeholder="O2 (%)" value={lecturaPeriodica.o2} onInput={(e) => setLecturaPeriodica(p => ({ ...p, o2: (e.target as HTMLInputElement).value }))} />
                <Input type="text" placeholder="CO (ppm)" value={lecturaPeriodica.co} onInput={(e) => setLecturaPeriodica(p => ({ ...p, co: (e.target as HTMLInputElement).value }))} />
                <Input type="text" placeholder="LEL (%)" value={lecturaPeriodica.lel} onInput={(e) => setLecturaPeriodica(p => ({ ...p, lel: (e.target as HTMLInputElement).value }))} />
                <Input type="text" placeholder="H2S (ppm)" value={lecturaPeriodica.h2s} onInput={(e) => setLecturaPeriodica(p => ({ ...p, h2s: (e.target as HTMLInputElement).value }))} />
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Firma del Inspector (Obligatorio):</p>
          <div className="border-2 border-gray-600 rounded-lg bg-white p-2">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="w-full h-48 cursor-crosshair touch-none"
              style={{ maxWidth: '100%', height: '200px' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            onClick={clearSignature}
            className="bg-gray-600 text-white hover:bg-gray-500"
            disabled={!hasSignature}
          >
            Limpiar Firma
          </Button>
          <Button
            onClick={handleClose}
            className="bg-gray-600 text-white hover:bg-gray-500"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
            disabled={!canConfirm}
          >
            Confirmar Monitoreo
          </Button>
        </div>
      </div>
    </div>
  );
};