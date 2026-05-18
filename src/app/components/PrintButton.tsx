import { Printer } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface PrintButtonProps {
  targetId?: string;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function PrintButton({ targetId, label = 'Print', variant = 'outline' }: PrintButtonProps) {
  const handlePrint = () => {
    if (targetId) {
      // Print specific element
      const element = document.getElementById(targetId);
      if (element) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Print</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    line-height: 1.6;
                  }
                  @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                  }
                  th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                  }
                  th {
                    background-color: #f4f4f4;
                  }
                  h1, h2, h3 {
                    margin-top: 20px;
                    color: #333;
                  }
                  .signature-section {
                    margin-top: 40px;
                    page-break-inside: avoid;
                  }
                </style>
              </head>
              <body>
                ${element.innerHTML}
                <script>
                  window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                      window.close();
                    };
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      } else {
        toast.error('Print target not found');
      }
    } else {
      // Print entire page
      window.print();
    }
  };

  return (
    <Button onClick={handlePrint} variant={variant}>
      <Printer className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
