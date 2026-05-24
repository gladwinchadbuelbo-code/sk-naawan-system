import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export function DocumentationPacketPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [selectedEventId, setSelectedEventId] = useState(eventId || '');
  const [generating, setGenerating] = useState(false);

  const events = [
    { id: '1', title: 'Youth Summit 2025', date: '2025-11-25' },
    { id: '2', title: 'Sports Festival', date: '2025-12-01' },
    { id: '3', title: 'Community Cleanup', date: '2025-12-05' },
    { id: '4', title: 'Skills Training Workshop', date: '2025-11-15' },
  ];

  const documents = [
    {
      id: 1,
      name: 'Activity Design',
      description: 'Complete activity design document with objectives and timeline',
      status: 'ready',
      fileSize: '2.3 MB',
      fileType: 'PDF',
    },
    {
      id: 2,
      name: 'Attendance Sheet',
      description: 'Signed attendance sheet with complete participant details',
      status: 'ready',
      fileSize: '856 KB',
      fileType: 'PDF',
    },
    {
      id: 3,
      name: 'Budget Breakdown',
      description: 'Detailed budget allocation and expense breakdown',
      status: 'ready',
      fileSize: '1.1 MB',
      fileType: 'Excel',
    },
    {
      id: 4,
      name: 'Receipts & Vouchers',
      description: 'All official receipts and disbursement vouchers',
      status: 'ready',
      fileSize: '5.2 MB',
      fileType: 'PDF',
    },
    {
      id: 5,
      name: 'Photo Documentation',
      description: 'High-quality photos from the event',
      status: 'ready',
      fileSize: '12.4 MB',
      fileType: 'ZIP',
    },
    {
      id: 6,
      name: 'Liquidation Report',
      description: 'COA-compliant liquidation report',
      status: 'ready',
      fileSize: '1.8 MB',
      fileType: 'PDF',
    },
    {
      id: 7,
      name: 'Accomplishment Report',
      description: 'LYDO submission format accomplishment report',
      status: 'ready',
      fileSize: '2.9 MB',
      fileType: 'Word',
    },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert('Documentation packet generated successfully!');
    }, 2000);
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const totalSize = documents.reduce((sum, doc) => {
    const size = parseFloat(doc.fileSize);
    return sum + size;
  }, 0);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/reports?tab=documentation')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl">Documentation Packet Generator</h1>
          <p className="text-gray-600 mt-2">Generate complete documentation bundle for events</p>
        </div>
      </div>

      {/* Event Selection */}
      <Card className="p-6">
        <h3 className="text-lg mb-4">Select Event</h3>
        <div className="max-w-md">
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an event..." />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title} - {new Date(event.date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {selectedEventId && (
        <>
          {/* Event Info */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg">Selected Event: {selectedEvent?.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Date: {selectedEvent && new Date(selectedEvent.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Package Size</p>
                <p className="text-2xl">{totalSize.toFixed(1)} MB</p>
              </div>
            </div>
          </Card>

          {/* Documents Included */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Documents Included in Package</h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        doc.status === 'ready' ? 'bg-green-100' : 'bg-amber-100'
                      }`}
                    >
                      {doc.status === 'ready' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <p>{doc.name}</p>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {doc.fileType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{doc.fileSize}</p>
                    <p
                      className={`text-xs mt-1 ${
                        doc.status === 'ready' ? 'text-green-600' : 'text-amber-600'
                      }`}
                    >
                      {doc.status === 'ready' ? 'Ready' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Package Structure */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Package Structure</h3>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
              <div className="space-y-1">
                <div>📁 {selectedEvent?.title.replace(/ /g, '_')}_Documentation/</div>
                <div className="ml-4">├── 📄 01_Activity_Design.pdf</div>
                <div className="ml-4">├── 📄 02_Attendance_Sheet.pdf</div>
                <div className="ml-4">├── 📄 03_Budget_Breakdown.xlsx</div>
                <div className="ml-4">├── 📁 04_Receipts_and_Vouchers/</div>
                <div className="ml-8">└── 📄 (All OR copies)</div>
                <div className="ml-4">├── 📁 05_Photo_Documentation/</div>
                <div className="ml-8">└── 📷 (All event photos)</div>
                <div className="ml-4">├── 📄 06_Liquidation_Report.pdf</div>
                <div className="ml-4">└── 📄 07_Accomplishment_Report.docx</div>
              </div>
            </div>
          </Card>

          {/* Generation Options */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Generation Options</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="compress" defaultChecked className="w-4 h-4" />
                <label htmlFor="compress" className="text-sm">
                  Compress files for faster download
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="watermark" className="w-4 h-4" />
                <label htmlFor="watermark" className="text-sm">
                  Add watermark to photos
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="readme" defaultChecked className="w-4 h-4" />
                <label htmlFor="readme" className="text-sm">
                  Include README file with document descriptions
                </label>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg">Ready to Generate</h3>
                <p className="text-sm text-gray-600 mt-1">
                  All documents are ready. Click the button to generate the complete package.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Preview Contents
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Generate Full Packet (ZIP)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Documents</p>
                  <p className="text-2xl mt-1">{documents.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Ready Documents</p>
                  <p className="text-2xl mt-1">{documents.filter((d) => d.status === 'ready').length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-purple-50 border-purple-200">
              <div className="flex items-start gap-3">
                <Download className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Package Size</p>
                  <p className="text-2xl mt-1">{totalSize.toFixed(1)} MB</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {!selectedEventId && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg mb-2">No Event Selected</h3>
            <p className="text-gray-600 text-sm">
              Please select an event from the dropdown above to generate a documentation packet.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
