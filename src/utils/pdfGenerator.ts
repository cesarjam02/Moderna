import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPdf = async (elementId: string, fileName: string) => {
  const container = document.getElementById(elementId);
  if (!container) return;

  const page1Element = container.querySelector('#page-1-content') as HTMLElement;
  const page2Element = container.querySelector('#page-2-content') as HTMLElement;

  if (!page1Element || !page2Element) {
    // Si la descarga falla aquí, es porque PermisoDetailPage.tsx no está usando los IDs correctamente.
    console.error("Error: No se encontraron los contenedores de página fijos (#page-1-content o #page-2-content).");
    alert("Error interno al generar el PDF: Faltan elementos estructurales.");
    return;
  }

  // Creación del documento PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  
  const scaleFactor = 2.5; // Factor de escala para alta calidad

  // --- CAPTURA DE PÁGINA 1 ---
  const canvas1 = await html2canvas(page1Element, {
    scale: scaleFactor, 
    useCORS: true,
    logging: false,
  });
  const imgData1 = canvas1.toDataURL('image/png');
  const ratio1 = pdfWidth / canvas1.width;
  const scaledHeight1 = canvas1.height * ratio1;

  pdf.addImage(imgData1, 'PNG', 0, 0, pdfWidth, scaledHeight1);

  // --- CAPTURA DE PÁGINA 2 ---
  pdf.addPage();
  const canvas2 = await html2canvas(page2Element, {
    scale: scaleFactor, 
    useCORS: true,
    logging: false,
  });
  const imgData2 = canvas2.toDataURL('image/png');
  const ratio2 = pdfWidth / canvas2.width;
  const scaledHeight2 = canvas2.height * ratio2;
  
  pdf.addImage(imgData2, 'PNG', 0, 0, pdfWidth, scaledHeight2);

  pdf.save(`${fileName}.pdf`);
};