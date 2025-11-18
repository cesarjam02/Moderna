import { FunctionalComponent } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { Button } from '@/components/UI/Button';

interface CloseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (observaciones: string, signatureDataUrl: string) => void;
}

export const CloseModal: FunctionalComponent<CloseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [observaciones, setObservaciones] = useState('');

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
    setObservaciones('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirm = () => {
    if (canvasRef.current && hasSignature) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onConfirm(observaciones, dataUrl);
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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Cerrar Permiso de Trabajo</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="observaciones">
            Observaciones de Cierre (Opcional)
          </label>
          <textarea
            id="observaciones"
            rows={3}
            className="py-2 px-3 w-full rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rojo-moderna focus:border-rojo-moderna"
            value={observaciones}
            onInput={(e) => setObservaciones((e.target as HTMLTextAreaElement).value)}
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Firma del Líder/Residente (Obligatorio):</p>
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
            className="bg-red-600 text-white hover:bg-red-500 disabled:opacity-50"
            disabled={!hasSignature}
          >
            Cerrar Permiso
          </Button>
        </div>
      </div>
    </div>
  );
};