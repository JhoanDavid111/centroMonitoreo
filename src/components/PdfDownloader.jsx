import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PdfDownloader({ targetRef, fileName }) {
  const generatePDF = async () => {
    const element = targetRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Descargar PDF
    </button>
  );
}
