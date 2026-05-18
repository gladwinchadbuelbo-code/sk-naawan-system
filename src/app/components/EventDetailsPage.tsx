import { Layout } from './Layout';
import { ArrowLeft, Calendar, MapPin, Users, Wallet, FileText, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface EventDetailsPageProps {
  onNavigate: (page: string) => void;
  eventId: number | null;
}

export function EventDetailsPage({ onNavigate, eventId }: EventDetailsPageProps) {
  // Mock event data
  const event = {
    id: eventId || 1,
    title: 'Youth Leadership Summit',
    date: '2025-12-15',
    time: '09:00 AM - 05:00 PM',
    venue: 'Community Hall, Barangay Center',
    budget: 15000,
    participants: 50,
    status: 'upcoming',
    description: 'Annual youth leadership training program designed to empower young leaders in the community. This event will feature workshops, seminars, and networking activities.',
    objectives: [
      'Develop leadership skills among youth',
      'Promote community engagement',
      'Build networking opportunities',
      'Enhance communication skills',
    ],
  };

  const budgetBreakdown = [
    { category: 'Venue Rental', amount: 5000 },
    { category: 'Food & Refreshments', amount: 6000 },
    { category: 'Materials & Supplies', amount: 2000 },
    { category: 'Guest Speakers', amount: 2000 },
  ];

  const attendanceList = [
    { id: 1, name: 'Juan Dela Cruz', status: 'Registered', checkedIn: false },
    { id: 2, name: 'Maria Santos', status: 'Registered', checkedIn: false },
    { id: 3, name: 'Pedro Garcia', status: 'Registered', checkedIn: false },
    { id: 4, name: 'Ana Reyes', status: 'Registered', checkedIn: false },
    { id: 5, name: 'Jose Mercado', status: 'Registered', checkedIn: false },
  ];

  const documents = [
    { id: 1, name: 'Event Proposal.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Admin', date: '2025-11-01' },
    { id: 2, name: 'Budget Plan.xlsx', type: 'Excel', size: '1.1 MB', uploadedBy: 'Admin', date: '2025-11-05' },
    { id: 3, name: 'Invitation Letter.docx', type: 'Word', size: '0.5 MB', uploadedBy: 'Admin', date: '2025-11-10' },
  ];

  return (
    <Layout currentPage="events" onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => onNavigate('events')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <h2 className="text-[#1e3a5f]">{event.title}</h2>
        </div>

        {/* Event Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[#1e3a5f] mb-4">Event Information</h3>
              <p className="text-[#4a5c6e] mb-4">{event.description}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm ${
              event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
              event.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-[#6b7280]">Date & Time</div>
                <div className="text-[#1e3a5f]">{event.date}</div>
                <div className="text-sm text-[#4a5c6e]">{event.time}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-[#6b7280]">Venue</div>
                <div className="text-[#1e3a5f]">{event.venue}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-[#6b7280]">Expected Participants</div>
                <div className="text-[#1e3a5f]">{event.participants} people</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-[#6b7280]">Total Budget</div>
                <div className="text-[#1e3a5f]">₱{event.budget.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-[#6b7280] mb-2">Event Objectives</div>
            <ul className="list-disc list-inside space-y-1 text-[#4a5c6e]">
              {event.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tabs for Budget, Attendance, Documents */}
        <Tabs defaultValue="budget" className="w-full">
          <TabsList className="bg-white border-b w-full justify-start rounded-none p-0">
            <TabsTrigger value="budget" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:bg-transparent">
              Budget Allocation
            </TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:bg-transparent">
              Attendance List
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:bg-transparent">
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="budget" className="mt-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-[#1e3a5f]">Budget Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Category</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Amount</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {budgetBreakdown.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-[#4a5c6e]">{item.category}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">₱{item.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">{((item.amount / event.budget) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-[#1e3a5f]">Total</td>
                      <td className="px-6 py-4 text-[#1e3a5f]">₱{event.budget.toLocaleString()}</td>
                      <td className="px-6 py-4 text-[#1e3a5f]">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-[#1e3a5f]">Registered Participants</h3>
                <Button onClick={() => onNavigate('attendance', event.id)} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                  <Users className="w-4 h-4 mr-2" />
                  Track Attendance
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[#6b7280]">#</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Name</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Status</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Check-in Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendanceList.map((attendee, index) => (
                      <tr key={attendee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-[#4a5c6e]">{index + 1}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">{attendee.name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                            {attendee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                            attendee.checkedIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {attendee.checkedIn ? 'Checked In' : 'Not Yet'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-[#1e3a5f]">Event Documents</h3>
                <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[#6b7280]">File Name</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Type</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Size</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Uploaded By</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-[#4a5c6e] flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 text-[#4a5c6e]">{doc.type}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">{doc.size}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">{doc.uploadedBy}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">{doc.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
