import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Wallet, Image as ImageIcon, FileText, Download } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

export function EventDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock event data
  const event = {
    id: Number(id),
    title: 'Youth Summit 2025',
    date: '2025-11-25',
    venue: 'Community Center',
    time: '9:00 AM - 5:00 PM',
    status: 'Upcoming',
    budget: 25000,
    description: 'Annual youth summit featuring leadership workshops, skills training, and networking activities for the youth of our barangay.',
    assignedOfficials: ['John Doe - Chairperson', 'Jane Smith - Secretary', 'Mike Johnson - Treasurer'],
    budgetBreakdown: [
      { category: 'Venue & Equipment', amount: 8000 },
      { category: 'Materials & Supplies', amount: 6000 },
      { category: 'Food & Refreshments', amount: 7000 },
      { category: 'Certificates & Tokens', amount: 3000 },
      { category: 'Miscellaneous', amount: 1000 },
    ],
    attendance: [
      { name: 'Anna Cruz', ageGroup: '15-18', timeIn: '9:15 AM', timeOut: '4:50 PM', status: 'Present' },
      { name: 'Pedro Santos', ageGroup: '19-21', timeIn: '9:30 AM', timeOut: '5:00 PM', status: 'Present' },
      { name: 'Maria Garcia', ageGroup: '15-18', timeIn: '9:00 AM', timeOut: '4:45 PM', status: 'Present' },
      { name: 'Carlos Reyes', ageGroup: '19-21', timeIn: '-', timeOut: '-', status: 'Absent' },
    ],
    photos: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400',
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400',
    ],
    documents: [
      { name: 'Activity Design.pdf', size: '2.3 MB', type: 'PDF' },
      { name: 'Budget Proposal.xlsx', size: '1.1 MB', type: 'Excel' },
      { name: 'Attendance Sheet.pdf', size: '856 KB', type: 'PDF' },
    ],
  };

  const totalAttendance = event.attendance.filter((a) => a.status === 'Present').length;
  const attendanceRate = ((totalAttendance / event.attendance.length) * 100).toFixed(0);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/staff/events')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl">{event.title}</h1>
          <p className="text-gray-600 mt-2">Complete event details and documentation</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate(`/staff/events/${id}/attendance`)} variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Track Attendance
          </Button>
          <Button onClick={() => navigate(`/staff/reports/liquidation/${id}`)} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Event Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="mt-1">{new Date(event.date).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Venue</p>
              <p className="mt-1">{event.venue}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="mt-1">{event.time}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-3 rounded-lg">
              <Wallet className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="mt-1">₱{event.budget.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Description */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Event Description</h3>
            <p className="text-gray-600">{event.description}</p>
            <div className="mt-4">
              <span
                className={`px-4 py-2 rounded-full text-sm ${
                  event.status === 'Upcoming'
                    ? 'bg-blue-100 text-blue-700'
                    : event.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                Status: {event.status}
              </span>
            </div>
          </Card>

          {/* Budget Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Budget Breakdown</h3>
            <div className="space-y-3">
              {event.budgetBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span>{item.category}</span>
                  <span>₱{item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <span>Total Budget</span>
                <span>₱{event.budget.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Attendance Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Attendance</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {totalAttendance} / {event.attendance.length} ({attendanceRate}%)
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Age Group</th>
                    <th className="text-left py-3 px-4">Time In</th>
                    <th className="text-left py-3 px-4">Time Out</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {event.attendance.map((person, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{person.name}</td>
                      <td className="py-3 px-4">{person.ageGroup}</td>
                      <td className="py-3 px-4">{person.timeIn}</td>
                      <td className="py-3 px-4">{person.timeOut}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            person.status === 'Present'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {person.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Button onClick={() => navigate(`/staff/events/${id}/attendance`)} variant="outline" className="w-full">
                View Full Attendance Report
              </Button>
            </div>
          </Card>

          {/* Photo Documentation */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Photo Documentation</h3>
              <Button variant="outline" size="sm">
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {event.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={photo} alt={`Event photo ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Assigned Officials */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Assigned Officials</h3>
            <div className="space-y-3">
              {event.assignedOfficials.map((official, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{official}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Documents</h3>
            <div className="space-y-3">
              {event.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-600">{doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <FileText className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => navigate(`/staff/reports/liquidation/${id}`)}
                className="w-full justify-start"
                variant="outline"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Liquidation Report
              </Button>
              <Button
                onClick={() => navigate(`/staff/reports/accomplishment/${id}`)}
                className="w-full justify-start"
                variant="outline"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Accomplishment Report
              </Button>
              <Button
                onClick={() => navigate(`/staff/reports/documentation/${id}`)}
                className="w-full justify-start"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Documentation Packet
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}