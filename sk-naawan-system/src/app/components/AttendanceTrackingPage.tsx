import { useState } from 'react';
import { Layout } from './Layout';
import { ArrowLeft, Search, CheckCircle, XCircle, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

interface AttendanceTrackingPageProps {
  onNavigate: (page: string) => void;
  eventId: number | null;
}

interface Attendee {
  id: number;
  name: string;
  contact: string;
  organization: string;
  checkedIn: boolean;
  timeIn: string;
}

export function AttendanceTrackingPage({ onNavigate, eventId }: AttendanceTrackingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: 1, name: 'Juan Dela Cruz', contact: '0912-345-6789', organization: 'Youth Council', checkedIn: true, timeIn: '09:15 AM' },
    { id: 2, name: 'Maria Santos', contact: '0923-456-7890', organization: 'SK Federation', checkedIn: true, timeIn: '09:20 AM' },
    { id: 3, name: 'Pedro Garcia', contact: '0934-567-8901', organization: 'Barangay Youth', checkedIn: false, timeIn: '' },
    { id: 4, name: 'Ana Reyes', contact: '0945-678-9012', organization: 'Student Council', checkedIn: true, timeIn: '09:30 AM' },
    { id: 5, name: 'Jose Mercado', contact: '0956-789-0123', organization: 'Youth Volunteers', checkedIn: false, timeIn: '' },
    { id: 6, name: 'Carmen Lopez', contact: '0967-890-1234', organization: 'Community Group', checkedIn: true, timeIn: '09:45 AM' },
    { id: 7, name: 'Roberto Ramos', contact: '0978-901-2345', organization: 'SK Officers', checkedIn: false, timeIn: '' },
    { id: 8, name: 'Linda Cruz', contact: '0989-012-3456', organization: 'Youth Leaders', checkedIn: true, timeIn: '10:00 AM' },
  ]);

  const toggleCheckIn = (id: number) => {
    setAttendees(attendees.map(attendee => {
      if (attendee.id === id) {
        const now = new Date();
        const timeIn = attendee.checkedIn ? '' : `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
        return { ...attendee, checkedIn: !attendee.checkedIn, timeIn };
      }
      return attendee;
    }));
  };

  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendee.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkedInCount = attendees.filter(a => a.checkedIn).length;
  const attendanceRate = ((checkedInCount / attendees.length) * 100).toFixed(1);

  return (
    <Layout currentPage="events" onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => onNavigate('event-details', eventId || 1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Event Details
            </Button>
            <h2 className="text-[#1e3a5f]">Attendance Tracking</h2>
          </div>
          <Button className="bg-[#10b981] hover:bg-[#059669]">
            <Download className="w-4 h-4 mr-2" />
            Export Attendance
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="text-[#6b7280] mb-1">Total Registered</div>
            <div className="text-[#1e3a5f]">{attendees.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-[#6b7280] mb-1">Checked In</div>
            <div className="text-[#1e3a5f]">{checkedInCount}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="text-[#6b7280] mb-1">Not Yet</div>
            <div className="text-[#1e3a5f]">{attendees.length - checkedInCount}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="text-[#6b7280] mb-1">Attendance Rate</div>
            <div className="text-[#1e3a5f]">{attendanceRate}%</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
            <Input
              type="text"
              placeholder="Search by name or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-[#1e3a5f]">Participant List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[#6b7280]">#</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Name</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Contact</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Organization</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Time In</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Status</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Check In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAttendees.map((attendee, index) => (
                  <tr key={attendee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-[#4a5c6e]">{index + 1}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">{attendee.name}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">{attendee.contact}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">{attendee.organization}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">
                      {attendee.timeIn || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {attendee.checkedIn ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 text-sm">Present</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600 text-sm">Absent</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Checkbox
                        checked={attendee.checkedIn}
                        onCheckedChange={() => toggleCheckIn(attendee.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-sm text-[#6b7280] mb-1">On Time</div>
              <div className="text-[#1e3a5f]">{checkedInCount}</div>
            </div>
            <div>
              <div className="text-sm text-[#6b7280] mb-1">Late</div>
              <div className="text-[#1e3a5f]">0</div>
            </div>
            <div>
              <div className="text-sm text-[#6b7280] mb-1">Absent</div>
              <div className="text-[#1e3a5f]">{attendees.length - checkedInCount}</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
