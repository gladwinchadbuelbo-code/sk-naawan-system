import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface ExportPDFButtonProps {
  targetId: string;
  fileName?: string;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function ExportPDFButton({ 
  targetId, 
  fileName = 'document', 
  label = 'Export PDF', 
  variant = 'outline' 
}: ExportPDFButtonProps) {
  const handleExport = () => {
    // Note: In a real application, you would use a library like jsPDF or html2pdf
    // For this prototype, we'll create an HTML export that can be saved as PDF
    const element = document.getElementById(targetId);
    
    if (!element) {
      toast.error('Export target not found');
      return;
    }

    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${fileName}</title>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 40px;
                line-height: 1.6;
                color: #333;
              }
              @page {
                size: A4;
                margin: 20mm;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
              }
              th {
                background-color: #f4f4f4;
                font-weight: bold;
              }
              h1 {
                color: #1e40af;
                border-bottom: 2px solid #1e40af;
                padding-bottom: 10px;
                margin-bottom: 20px;
              }
              h2 {
                color: #1e40af;
                margin-top: 30px;
                margin-bottom: 15px;
              }
              h3 {
                color: #334155;
                margin-top: 20px;
                margin-bottom: 10px;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .signature-section {
                margin-top: 60px;
                page-break-inside: avoid;
              }
              .signature-block {
                margin: 40px 0;
              }
              .signature-line {
                border-top: 1px solid #000;
                width: 250px;
                margin-top: 50px;
                text-align: center;
              }
              .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin: 20px 0;
              }
              .info-item {
                padding: 10px;
                background-color: #f9fafb;
                border-radius: 5px;
              }
              .info-label {
                font-weight: bold;
                color: #64748b;
                font-size: 0.875rem;
              }
              .info-value {
                margin-top: 5px;
                color: #334155;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${element.innerHTML}
            <script>
              // Remove any interactive elements
              document.querySelectorAll('button, .no-print').forEach(el => el.remove());
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Suggest saving as PDF
      toast.success('Document opened. Use Print → Save as PDF to export');
      
      // Trigger print dialog after a short delay
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <Button onClick={handleExport} variant={variant}>
      <Download className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
