import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPdf = async (elementId: string, fileName: string) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Error: Elemento con id '${elementId}' no encontrado.`);
    return;
  }

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const ratio = pdfWidth / imgWidth;
  const scaledImgHeight = imgHeight * ratio;

  let heightLeft = scaledImgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - scaledImgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`${fileName}.pdf`);
};