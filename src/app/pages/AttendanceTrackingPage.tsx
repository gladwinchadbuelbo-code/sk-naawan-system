import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Download, UserPlus, FileText, Search } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface AttendanceRecord {
  id: number;
  name: string;
  ageGroup: string;
  contact: string;
  timeIn: string;
  timeOut: string;
  status: 'Present' | 'Absent' | 'Late';
}

export function AttendanceTrackingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [attendees, setAttendees] = useState<AttendanceRecord[]>([
    {
      id: 1,
      name: 'Anna Cruz',
      ageGroup: '15-18',
      contact: '09171234567',
      timeIn: '9:15 AM',
      timeOut: '4:50 PM',
      status: 'Present',
    },
    {
      id: 2,
      name: 'Pedro Santos',
      ageGroup: '19-21',
      contact: '09187654321',
      timeIn: '9:30 AM',
      timeOut: '5:00 PM',
      status: 'Late',
    },
    {
      id: 3,
      name: 'Maria Garcia',
      ageGroup: '15-18',
      contact: '09191112222',
      timeIn: '9:00 AM',
      timeOut: '4:45 PM',
      status: 'Present',
    },
    {
      id: 4,
      name: 'Carlos Reyes',
      ageGroup: '19-21',
      contact: '09203334444',
      timeIn: '-',
      timeOut: '-',
      status: 'Absent',
    },
    {
      id: 5,
      name: 'Sarah Lee',
      ageGroup: '15-18',
      contact: '09215556666',
      timeIn: '9:05 AM',
      timeOut: '5:00 PM',
      status: 'Present',
    },
  ]);

  const eventTitle = 'Youth Summit 2025';

  const handleAddAttendee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAttendee: AttendanceRecord = {
      id: attendees.length + 1,
      name: formData.get('name') as string,
      ageGroup: formData.get('ageGroup') as string,
      contact: formData.get('contact') as string,
      timeIn: formData.get('timeIn') as string || '-',
      timeOut: formData.get('timeOut') as string || '-',
      status: 'Present',
    };
    setAttendees([...attendees, newAttendee]);
    setShowAddModal(false);
  };

  const toggleStatus = (id: number) => {
    setAttendees(
      attendees.map((attendee) =>
        attendee.id === id
          ? {
              ...attendee,
              status:
                attendee.status === 'Present'
                  ? 'Absent'
                  : attendee.status === 'Absent'
                  ? 'Late'
                  : 'Present',
            }
          : attendee
      )
    );
  };

  const filteredAttendees = attendees.filter((attendee) =>
    attendee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = attendees.filter((a) => a.status === 'Present').length;
  const lateCount = attendees.filter((a) => a.status === 'Late').length;
  const absentCount = attendees.filter((a) => a.status === 'Absent').length;
  const attendanceRate = ((presentCount + lateCount) / attendees.length * 100).toFixed(0);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/events/${id}`)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl">Attendance Tracking</h1>
          <p className="text-gray-600 mt-2">{eventTitle}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Attendee
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <div>
            <p className="text-blue-100 text-sm">Total Registered</p>
            <h3 className="text-3xl mt-2">{attendees.length}</h3>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <div>
            <p className="text-green-100 text-sm">Present</p>
            <h3 className="text-3xl mt-2">{presentCount}</h3>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <div>
            <p className="text-amber-100 text-sm">Late</p>
            <h3 className="text-3xl mt-2">{lateCount}</h3>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <div>
            <p className="text-red-100 text-sm">Absent</p>
            <h3 className="text-3xl mt-2">{absentCount}</h3>
          </div>
        </Card>
      </div>

      {/* Attendance Rate */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg">Attendance Rate</h3>
            <p className="text-sm text-gray-600 mt-1">Present + Late / Total Registered</p>
          </div>
          <div className="text-right">
            <p className="text-4xl">{attendanceRate}%</p>
            <p className="text-sm text-gray-600 mt-1">
              {presentCount + lateCount} out of {attendees.length}
            </p>
          </div>
        </div>
        <div className="mt-4 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>
      </Card>

      {/* Attendance Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">Attendance Records</h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search attendees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Age Group</th>
                <th className="text-left py-3 px-4">Contact</th>
                <th className="text-left py-3 px-4">Time In</th>
                <th className="text-left py-3 px-4">Time Out</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee, index) => (
                <tr key={attendee.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{attendee.name}</td>
                  <td className="py-3 px-4">{attendee.ageGroup}</td>
                  <td className="py-3 px-4">{attendee.contact}</td>
                  <td className="py-3 px-4">{attendee.timeIn}</td>
                  <td className="py-3 px-4">{attendee.timeOut}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStatus(attendee.id)}
                      className={`px-3 py-1 rounded-full text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                        attendee.status === 'Present'
                          ? 'bg-green-100 text-green-700'
                          : attendee.status === 'Late'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {attendee.status}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg mb-4">Quick Actions</h3>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Print Attendance Sheet
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Excel
          </Button>
        </div>
      </Card>

      {/* Add Attendee Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attendee</DialogTitle>
            <DialogDescription>Add a new attendee to the event.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAttendee}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input type="text" id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="ageGroup">Age Group</Label>
                <Select name="ageGroup" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15-18">15-18 years old</SelectItem>
                    <SelectItem value="19-21">19-21 years old</SelectItem>
                    <SelectItem value="22-30">22-30 years old</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contact">Contact Number</Label>
                <Input type="tel" id="contact" name="contact" placeholder="09171234567" required />
              </div>
              <div>
                <Label htmlFor="timeIn">Time In (Optional)</Label>
                <Input type="time" id="timeIn" name="timeIn" />
              </div>
              <div>
                <Label htmlFor="timeOut">Time Out (Optional)</Label>
                <Input type="time" id="timeOut" name="timeOut" />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Add Attendee
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
