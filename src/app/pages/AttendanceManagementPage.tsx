import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  QrCode,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Calendar,
  MapPin,
  Smartphone,
  UserCheck,
  Camera,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export function AttendanceManagementPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Manual entry form
  const [manualForm, setManualForm] = useState({
    fullName: '',
    contactNumber: '',
    barangay: '',
    age: '',
  });

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = () => {
    const events = storage.getEvents() || [];
    const foundEvent = events.find((e: any) => e.id === parseInt(eventId || '0'));
    
    if (foundEvent) {
      setEvent(foundEvent);
      const attendanceList = storage.getEventAttendance(foundEvent.id);
      setAttendance(attendanceList);
      setStats(storage.getAttendanceStats(foundEvent.id));

      // Generate QR code URL
      const baseUrl = window.location.origin;
      const checkInUrl = `${baseUrl}/check-in/${foundEvent.id}`;
      // Use QR code API for generating QR image
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(checkInUrl)}`);
    }
  };

  const handleManualAdd = () => {
    if (!manualForm.fullName.trim() || !manualForm.contactNumber.trim()) {
      toast.error('Please fill in required fields');
      return;
    }

    if (manualForm.contactNumber.length < 10) {
      toast.error('Please enter a valid contact number');
      return;
    }

    // Check for duplicate
    const isDuplicate = storage.isAlreadyCheckedIn(
      parseInt(eventId || '0'),
      manualForm.contactNumber
    );

    if (isDuplicate) {
      toast.error('This contact number has already checked in');
      return;
    }

    // Add record
    storage.addAttendanceRecord(parseInt(eventId || '0'), {
      fullName: manualForm.fullName,
      contactNumber: manualForm.contactNumber,
      barangay: manualForm.barangay || 'Not specified',
      age: manualForm.age ? parseInt(manualForm.age) : null,
      photo: null,
      checkInMethod: 'manual',
      addedBy: user?.fullName || 'Secretary',
    });

    toast.success(`${manualForm.fullName} added to attendance`);
    setManualForm({ fullName: '', contactNumber: '', barangay: '', age: '' });
    setShowManualDialog(false);
    loadData();
  };

  const handleDelete = (recordId: number, name: string) => {
    if (window.confirm(`Remove ${name} from attendance?`)) {
      storage.deleteAttendanceRecord(parseInt(eventId || '0'), recordId);
      toast.success('Attendance record removed');
      loadData();
    }
  };

  const handleDownloadQR = () => {
    // Download QR code image
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${event.title.replace(/\s+/g, '_')}_QR_Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded!');
  };

  const handleExportExcel = () => {
    // Prepare CSV data
    const headers = ['#', 'Full Name', 'Contact Number', 'Barangay', 'Age', 'Check-In Method', 'Timestamp'];
    const rows = attendance.map((record, index) => [
      index + 1,
      record.fullName,
      record.contactNumber,
      record.barangay,
      record.age || 'N/A',
      record.checkInMethod === 'qr' ? 'QR Code' : 'Manual',
      new Date(record.timestamp).toLocaleString(),
    ]);

    const csvContent = [
      `Event: ${event.title}`,
      `Date: ${new Date(event.date).toLocaleDateString()}`,
      `Venue: ${event.venue}`,
      `Total Participants: ${stats.total}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, '_')}_Attendance.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendance exported to CSV!');
  };

  const handlePrintAttendance = () => {
    // Prepare printable HTML
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Sheet - ${event.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2f7d5f; padding-bottom: 20px; }
            .header h1 { color: #1e3a5f; margin-bottom: 10px; }
            .info { margin-bottom: 20px; }
            .info p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
            th { background-color: #2f7d5f; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ATTENDANCE SHEET</h1>
            <h2>Sangguniang Kabataan</h2>
          </div>
          <div class="info">
            <p><strong>Event:</strong> ${event.title}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Total Participants:</strong> ${stats.total}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Contact Number</th>
                <th>Barangay</th>
                <th>Age</th>
                <th>Check-In Time</th>
                <th>Signature</th>
              </tr>
            </thead>
            <tbody>
              ${attendance.map((record, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${record.fullName}</td>
                  <td>${record.contactNumber}</td>
                  <td>${record.barangay}</td>
                  <td>${record.age || 'N/A'}</td>
                  <td>${new Date(record.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Prepared by: ${user?.fullName || 'SK Secretary'}</p>
            <p>Powered by SK Integrated Digital Management System</p>
          </div>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const filteredAttendance = attendance.filter(record =>
    record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.contactNumber.includes(searchTerm) ||
    record.barangay.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!event) {
    return (
      <div className="p-8">
        <p>Loading event data...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/staff/events')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl text-[#1e3a5f]">Attendance Management</h1>
            <p className="text-gray-600 mt-1">Hybrid QR Code + Manual Entry System</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={loadData}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Event Info Card */}
      <Card className="bg-gradient-to-br from-[#2f7d5f] to-[#1e5a47] text-white">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl mb-3">{event.title}</h2>
              <div className="space-y-1 text-green-50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.venue}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-3xl mt-1 text-[#2f7d5f]">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-[#2f7d5f] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">QR Check-Ins</p>
                <p className="text-3xl mt-1 text-blue-600">{stats.qrCheckIns}</p>
              </div>
              <Smartphone className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Manual Entries</p>
                <p className="text-3xl mt-1 text-orange-600">{stats.manualCheckIns}</p>
              </div>
              <UserCheck className="w-10 h-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Photos</p>
                <p className="text-3xl mt-1 text-purple-600">{stats.withPhotos}</p>
              </div>
              <Camera className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setShowQRDialog(true)}
          className="bg-[#2f7d5f] hover:bg-[#25614a] flex items-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          Show QR Code
        </Button>
        <Button
          onClick={() => setShowManualDialog(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Manual Entry
        </Button>
        <Button
          onClick={handleExportExcel}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export CSV
        </Button>
        <Button
          onClick={handlePrintAttendance}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Print Attendance
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search by name, contact number, or barangay..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records ({filteredAttendance.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAttendance.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No attendance records yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Use QR code or manual entry to add participants
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">#</th>
                    <th className="px-4 py-3 text-left text-sm">Name</th>
                    <th className="px-4 py-3 text-left text-sm">Contact</th>
                    <th className="px-4 py-3 text-left text-sm">Barangay</th>
                    <th className="px-4 py-3 text-left text-sm">Age</th>
                    <th className="px-4 py-3 text-left text-sm">Method</th>
                    <th className="px-4 py-3 text-left text-sm">Time</th>
                    <th className="px-4 py-3 text-left text-sm">Photo</th>
                    <th className="px-4 py-3 text-left text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredAttendance.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#1e3a5f]">{record.fullName}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">{record.contactNumber}</td>
                      <td className="px-4 py-3 text-sm">{record.barangay}</td>
                      <td className="px-4 py-3 text-sm">{record.age || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={record.checkInMethod === 'qr' ? 'default' : 'secondary'}
                          className={
                            record.checkInMethod === 'qr'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                          }
                        >
                          {record.checkInMethod === 'qr' ? (
                            <><Smartphone className="w-3 h-3 mr-1" /> QR</>
                          ) : (
                            <><UserCheck className="w-3 h-3 mr-1" /> Manual</>
                          )}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(record.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {record.photo ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedPhoto(record.photo);
                              setShowPhotoDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(record.id, record.fullName)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event QR Code</DialogTitle>
            <DialogDescription>
              Download and print this QR code for participants to scan and check in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border-2 border-[#2f7d5f] text-center">
              <img
                src={qrCodeUrl}
                alt="Event QR Code"
                className="mx-auto w-64 h-64"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Instructions:</strong>
              </p>
              <ol className="text-sm text-gray-600 mt-2 space-y-1 list-decimal list-inside">
                <li>Print this QR code (A4 or larger recommended)</li>
                <li>Display at event entrance or registration area</li>
                <li>Participants scan with their smartphone camera</li>
                <li>They fill in the check-in form</li>
                <li>View real-time attendance here!</li>
              </ol>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadQR}
                className="flex-1 bg-[#2f7d5f] hover:bg-[#25614a]"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
              <Button
                onClick={() => setShowQRDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Entry Dialog */}
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Attendance Entry</DialogTitle>
            <DialogDescription>
              Add participants who don't have smartphones or prefer manual entry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={manualForm.fullName}
                onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                placeholder="Juan Dela Cruz"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <Input
                value={manualForm.contactNumber}
                onChange={(e) => setManualForm({ ...manualForm, contactNumber: e.target.value })}
                placeholder="09171234567"
                type="tel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Barangay (Optional)
              </label>
              <Input
                value={manualForm.barangay}
                onChange={(e) => setManualForm({ ...manualForm, barangay: e.target.value })}
                placeholder="Enter barangay"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Age (Optional)
              </label>
              <Input
                value={manualForm.age}
                onChange={(e) => setManualForm({ ...manualForm, age: e.target.value })}
                placeholder="18"
                type="number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleManualAdd}
              className="bg-[#2f7d5f] hover:bg-[#25614a]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Participant Photo</DialogTitle>
            <DialogDescription>
              Photo verification captured during check-in.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <img
              src={selectedPhoto}
              alt="Participant"
              className="w-full rounded-lg"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPhotoDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}