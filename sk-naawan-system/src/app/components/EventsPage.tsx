import { useState } from 'react';
import { Layout } from './Layout';
import { Plus, Calendar as CalendarIcon, MapPin, Users, FileText, Edit, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface EventsPageProps {
  onNavigate: (page: string, eventId?: number) => void;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  budget: number;
  participants: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  description: string;
}

export function EventsPage({ onNavigate }: EventsPageProps) {
  const [events, setEvents] = useState<Event[]>([
    { id: 1, title: 'Youth Leadership Summit', date: '2025-12-15', time: '09:00 AM', venue: 'Community Hall', budget: 15000, participants: 50, status: 'upcoming', description: 'Annual youth leadership training' },
    { id: 2, title: 'Sports Festival', date: '2025-12-20', time: '08:00 AM', venue: 'Barangay Court', budget: 20000, participants: 100, status: 'upcoming', description: 'Inter-barangay sports competition' },
    { id: 3, title: 'Community Cleanup', date: '2025-11-10', time: '06:00 AM', venue: 'Various locations', budget: 5000, participants: 30, status: 'completed', description: 'Monthly cleanup drive' },
    { id: 4, title: 'Feeding Program', date: '2025-11-05', time: '10:00 AM', venue: 'Elementary School', budget: 8000, participants: 80, status: 'completed', description: 'Nutrition program for children' },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    budget: '',
    participants: '',
    description: '',
  });

  const handleCreateEvent = () => {
    const newEvent: Event = {
      id: events.length + 1,
      title: formData.title,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      budget: Number(formData.budget),
      participants: Number(formData.participants),
      status: 'upcoming',
      description: formData.description,
    };
    setEvents([...events, newEvent]);
    setShowCreateModal(false);
    setFormData({ title: '', date: '', time: '', venue: '', budget: '', participants: '', description: '' });
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setEvents(events.map(e => e.id === selectedEvent.id ? {
        ...e,
        ...formData,
        budget: Number(formData.budget),
        participants: Number(formData.participants),
      } : e));
      setShowEditModal(false);
      setSelectedEvent(null);
      setFormData({ title: '', date: '', time: '', venue: '', budget: '', participants: '', description: '' });
    }
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      budget: event.budget.toString(),
      participants: event.participants.toString(),
      description: event.description,
    });
    setShowEditModal(true);
  };

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const completedEvents = events.filter(e => e.status === 'completed');
  const cancelledEvents = events.filter(e => e.status === 'cancelled');

  return (
    <Layout currentPage="events" onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[#1e3a5f]">Event & Program Management</h2>
          <Button onClick={() => setShowCreateModal(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-[#1e3a5f] mb-4">Calendar</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#4a5c6e]">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Upcoming Events</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#4a5c6e]">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completed Events</span>
              </div>
            </div>
          </div>

          {/* Event Lists */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger value="upcoming" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:bg-transparent">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:bg-transparent">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:bg-transparent">
                  Cancelled
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="p-6 space-y-4">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} onNavigate={onNavigate} onEdit={openEditModal} onUpload={() => { setSelectedEvent(event); setShowUploadModal(true); }} />
                ))}
              </TabsContent>

              <TabsContent value="completed" className="p-6 space-y-4">
                {completedEvents.map((event) => (
                  <EventCard key={event.id} event={event} onNavigate={onNavigate} onEdit={openEditModal} onUpload={() => { setSelectedEvent(event); setShowUploadModal(true); }} />
                ))}
              </TabsContent>

              <TabsContent value="cancelled" className="p-6 space-y-4">
                {cancelledEvents.length === 0 ? (
                  <p className="text-center text-[#6b7280] py-8">No cancelled events</p>
                ) : (
                  cancelledEvents.map((event) => (
                    <EventCard key={event.id} event={event} onNavigate={onNavigate} onEdit={openEditModal} onUpload={() => { setSelectedEvent(event); setShowUploadModal(true); }} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Enter venue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget Allocation</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="Enter budget"
                />
              </div>
              <div>
                <Label htmlFor="participants">Expected Participants</Label>
                <Input
                  id="participants"
                  type="number"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                  placeholder="Number of participants"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent} className="bg-[#2563eb] hover:bg-[#1d4ed8]">Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-title">Event Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-venue">Venue</Label>
              <Input
                id="edit-venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-budget">Budget Allocation</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-participants">Expected Participants</Label>
                <Input
                  id="edit-participants"
                  type="number"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleEditEvent} className="bg-[#2563eb] hover:bg-[#1d4ed8]">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Documents Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Event Documents</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-[#4a5c6e] mb-2">Drag and drop files here or click to browse</p>
              <p className="text-sm text-[#6b7280]">Supported formats: PDF, JPG, PNG</p>
              <Button className="mt-4" variant="outline">Browse Files</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button onClick={() => setShowUploadModal(false)} className="bg-[#2563eb] hover:bg-[#1d4ed8]">Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

function EventCard({ event, onNavigate, onEdit, onUpload }: { event: Event; onNavigate: (page: string, eventId?: number) => void; onEdit: (event: Event) => void; onUpload: () => void }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-[#1e3a5f] mb-1">{event.title}</h4>
          <p className="text-sm text-[#6b7280]">{event.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${
          event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
          event.status === 'completed' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-[#4a5c6e]">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          <span>{event.date} at {event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{event.venue}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{event.participants} participants</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Budget: ₱{event.budget.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onNavigate('event-details', event.id)} variant="outline" size="sm" className="flex-1">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button onClick={() => onEdit(event)} variant="outline" size="sm" className="flex-1">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button onClick={() => onNavigate('attendance', event.id)} variant="outline" size="sm" className="flex-1">
          <Users className="w-4 h-4 mr-2" />
          Attendance
        </Button>
        <Button onClick={onUpload} variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>
    </div>
  );
}
