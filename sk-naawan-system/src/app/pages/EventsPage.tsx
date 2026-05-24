import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Users, Wallet, Plus, Upload, Edit, Trash2, Eye, CheckCircle, Clock, Filter, FileText, ChevronLeft, ChevronRight, Archive, QrCode, UserCheck, X } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface Event {
  id: number;
  title: string;
  date: string;
  endDate?: string;
  venue: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Planning';
  budget: number;
  description: string;
  assignedOfficials: string[];
  linkedBudgetProposalId?: number;
  documents?: {
    photos: { name: string, data: string, uploadedAt: string, uploadedBy: string }[];
    receipts: { name: string, data: string, uploadedAt: string, uploadedBy: string }[];
    attendance: { name: string, data: string, uploadedAt: string, uploadedBy: string } | null;
    others: { name: string, data: string, uploadedAt: string, uploadedBy: string }[];
  };
}

export function EventsPage() {
  const navigate = useNavigate();
  const { canEdit, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventToArchive, setEventToArchive] = useState<Event | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Add state for file uploads
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [uploadedReceipts, setUploadedReceipts] = useState<File[]>([]);
  const [uploadedAttendance, setUploadedAttendance] = useState<File | null>(null);
  const [uploadedOthers, setUploadedOthers] = useState<File[]>([]);
  const [selectedBudgetProposal, setSelectedBudgetProposal] = useState<number | null>(null);
  const [approvedBudgetProposals, setApprovedBudgetProposals] = useState<any[]>([]);

  // Permission check
  const canEditEvent = canEdit('event');

  // Load events from localStorage
  useEffect(() => {
    const storedEvents = storage.getEvents();
    if (storedEvents) {
      setEvents(storedEvents);
    }

    // Load approved budget proposals
    const budgetProposals = storage.getBudgetProposals();
    const approved = budgetProposals.filter((p: any) => p.status === 'approved');
    setApprovedBudgetProposals(approved);
  }, []);

  // Save to localStorage whenever events change
  useEffect(() => {
    if (events.length >= 0) {
      storage.setEvents(events);
    }
  }, [events]);

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Permission check - only secretary can create events
    if (user?.role !== 'secretary') {
      toast.error('Only the secretary can create events');
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const newEvent: Event = {
      id: Date.now(),
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      endDate: formData.get('endDate') as string || undefined,
      venue: formData.get('venue') as string,
      time: formData.get('time') as string,
      status: 'Planning',
      budget: Number(formData.get('budget')),
      description: formData.get('description') as string,
      assignedOfficials: [formData.get('officials') as string],
      linkedBudgetProposalId: selectedBudgetProposal || undefined,
    };
    setEvents([...events, newEvent]);
    setShowCreateModal(false);
    setSelectedBudgetProposal(null);
    toast.success('Event created successfully');
    storage.addActivity({
      type: 'event',
      action: 'created',
      description: `Created event: ${newEvent.title}`,
    });
  };

  const handleEditEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent) return;

    // Permission check - only secretary can edit events
    if (user?.role !== 'secretary') {
      toast.error('Only the secretary can edit events');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id
        ? {
            ...event,
            title: formData.get('title') as string,
            date: formData.get('date') as string,
            venue: formData.get('venue') as string,
            time: formData.get('time') as string,
            budget: Number(formData.get('budget')),
            description: formData.get('description') as string,
            status: formData.get('status') as Event['status'],
          }
        : event
    );
    setEvents(updatedEvents);
    setShowEditModal(false);
    setSelectedEvent(null);
    toast.success('Event updated successfully');
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const openUploadModal = (event: Event) => {
    setSelectedEvent(event);
    setShowUploadModal(true);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((event) => event.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const statusCounts = {
    upcoming: events.filter((e) => e.status === 'Upcoming').length,
    planning: events.filter((e) => e.status === 'Planning').length,
    completed: events.filter((e) => e.status === 'Completed').length,
  };

  // Add file upload handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedPhotos(Array.from(e.target.files));
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedReceipts(Array.from(e.target.files));
    }
  };

  const handleAttendanceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedAttendance(e.target.files[0]);
    }
  };

  const handleOthersUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedOthers(Array.from(e.target.files));
    }
  };

  const handleUploadDocuments = () => {
    if (!selectedEvent) return;

    // Permission check - only secretary can upload documents
    if (user?.role !== 'secretary') {
      toast.error('Only the secretary can upload event documents');
      return;
    }

    // Convert files to base64 for storage
    const processFiles = async () => {
      const photoPromises = uploadedPhotos.map(file => fileToBase64(file));
      const receiptPromises = uploadedReceipts.map(file => fileToBase64(file));
      const otherPromises = uploadedOthers.map(file => fileToBase64(file));
      
      const photoData = await Promise.all(photoPromises);
      const receiptData = await Promise.all(receiptPromises);
      const otherData = await Promise.all(otherPromises);
      const attendanceData = uploadedAttendance ? await fileToBase64(uploadedAttendance) : null;

      // Update event with uploaded documents
      const updatedEvent = {
        ...selectedEvent,
        documents: {
          photos: [...(selectedEvent.documents?.photos || []), ...photoData.map((data, i) => ({
            name: uploadedPhotos[i].name,
            data,
            uploadedAt: new Date().toISOString(),
            uploadedBy: user?.fullName || '',
          }))],
          receipts: [...(selectedEvent.documents?.receipts || []), ...receiptData.map((data, i) => ({
            name: uploadedReceipts[i].name,
            data,
            uploadedAt: new Date().toISOString(),
            uploadedBy: user?.fullName || '',
          }))],
          attendance: attendanceData ? {
            name: uploadedAttendance!.name,
            data: attendanceData,
            uploadedAt: new Date().toISOString(),
            uploadedBy: user?.fullName || '',
          } : selectedEvent.documents?.attendance,
          others: [...(selectedEvent.documents?.others || []), ...otherData.map((data, i) => ({
            name: uploadedOthers[i].name,
            data,
            uploadedAt: new Date().toISOString(),
            uploadedBy: user?.fullName || '',
          }))],
        },
      };

      const updatedEvents = events.map(e => e.id === selectedEvent.id ? updatedEvent : e);
      setEvents(updatedEvents);
      storage.setEvents(updatedEvents);

      // Add activity log
      storage.addActivity({
        type: 'document',
        action: 'uploaded',
        description: `${user?.fullName} uploaded documents for: ${selectedEvent.title}`,
      });

      const totalFiles = uploadedPhotos.length + uploadedReceipts.length + uploadedOthers.length + (uploadedAttendance ? 1 : 0);
      toast.success(`✅ Successfully uploaded ${totalFiles} document(s) to ${selectedEvent.title}`);
      
      // Reset state
      setUploadedPhotos([]);
      setUploadedReceipts([]);
      setUploadedAttendance(null);
      setUploadedOthers([]);
      setShowUploadModal(false);
    };

    processFiles();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Archive event handler - show confirmation first
  const handleArchiveEvent = (event: Event) => {
    if (user?.role !== 'secretary') {
      toast.error('Only Secretary can archive events');
      return;
    }

    setEventToArchive(event);
    setShowArchiveModal(true);
  };

  // Confirm archive action
  const confirmArchiveEvent = () => {
    if (!eventToArchive) return;

    try {
      storage.archiveEvent(eventToArchive, user?.fullName || 'Unknown User');
      setEvents(events.filter(e => e.id !== eventToArchive.id));
      toast.success(`Event "${eventToArchive.title}" has been archived`);

      storage.addActivity({
        type: 'event',
        action: 'archived',
        description: `Archived event: ${eventToArchive.title}`,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to archive event');
    } finally {
      setShowArchiveModal(false);
      setEventToArchive(null);
    }
  };

  return (
    <div className="p-8 space-y-8 ph-pattern-bg min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl">Event & Program Management</h1>
          <p className="text-gray-600 mt-2">Plan, organize, and track SK activities</p>
        </div>
        <div className="flex items-center gap-3">
          {user?.role === 'secretary' && (
            <>
              <Button
                onClick={() => navigate('/staff/my-proposals')}
                className="bg-[#10B981] hover:bg-[#059669] rounded-xl"
              >
                <FileText className="w-4 h-4 mr-2" />
                My Proposals
              </Button>
              <Button onClick={() => setShowCreateModal(true)} className="bg-[#059669] hover:bg-[#047857] rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#059669] to-[#047857] text-white border-0 shadow-lg rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Upcoming Events</p>
              <h3 className="text-3xl font-bold mt-2">{statusCounts.upcoming}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <CalendarIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white border-0 shadow-lg rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-amber-100 text-sm">In Planning</p>
              <h3 className="text-3xl font-bold mt-2">{statusCounts.planning}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Edit className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#10B981] to-[#059669] text-white border-0 shadow-lg rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <h3 className="text-3xl mt-2">{statusCounts.completed}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CalendarIcon className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Calendar View */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg">Event Calendar</h3>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="min-w-[150px] text-center">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center py-2 text-sm text-gray-500">
              {day}
            </div>
          ))}
          {getDaysInMonth(currentMonth).map((day, index) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={index}
                className={`min-h-[80px] p-2 border rounded-lg ${
                  day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                }`}
              >
                {day && (
                  <>
                    <div className="text-sm mb-1">{day}</div>
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 mb-1 bg-blue-100 text-blue-700 rounded truncate cursor-pointer hover:bg-blue-200"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        {event.title}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Event List */}
      <Card className="p-6 rounded-xl">
        <h3 className="text-lg mb-4 text-[#111827] font-semibold">All Events</h3>
        {events.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#111827]">Event</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#111827]">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#111827]">Venue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#111827]">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#111827]">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#111827]">Budget</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#111827]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={event.id} className={`border-b border-gray-100 hover:bg-[#F9FAFB] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="py-3 px-4">{event.title}</td>
                    <td className="py-3 px-4">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{event.venue}</td>
                    <td className="py-3 px-4">{event.time}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'Upcoming'
                            ? 'bg-emerald-100 text-[#059669]'
                            : event.status === 'Completed'
                            ? 'bg-emerald-100 text-[#10B981]'
                            : event.status === 'Cancelled'
                            ? 'bg-red-100 text-[#EF4444]'
                            : 'bg-amber-100 text-[#F59E0B]'
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">₱{event.budget.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/events/${event.id}`)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {user?.role === 'secretary' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditModal(event)}
                              title="Edit Event"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/staff/events/${event.id}/attendance`)}
                              title="Manage Attendance (QR + Manual)"
                              className="text-[#2f7d5f] hover:text-[#25614a]"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openUploadModal(event)}
                              title="Upload Documents"
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/reports?tab=events&eventId=${event.id}`)}
                          title="Generate Report"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        {user?.role === 'secretary' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleArchiveEvent(event)}
                            title="Archive Event"
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No events yet</p>
            <p className="text-sm mb-4">{user?.role === 'secretary' ? 'Create your first event to get started' : 'No events scheduled at this time'}</p>
            {user?.role === 'secretary' && (
              <Button onClick={() => setShowCreateModal(true)} className="bg-[#059669] hover:bg-[#047857] rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Create Event Modal */}
      <Dialog open={showCreateModal} onOpenChange={(open) => {
        setShowCreateModal(open);
        if (!open) setSelectedBudgetProposal(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>Create a new event or activity for SK.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateEvent}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input type="text" id="title" name="title" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Start Date</Label>
                  <Input type="date" id="date" name="date" required />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input type="date" id="endDate" name="endDate" />
                </div>
              </div>
              <div>
                <Label htmlFor="venue">Venue</Label>
                <Input type="text" id="venue" name="venue" required />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input type="text" id="time" name="time" placeholder="e.g., 9:00 AM - 5:00 PM" required />
              </div>
              <div>
                <Label htmlFor="budget">Budget (₱)</Label>
                <Input type="number" id="budget" name="budget" min="0" step="0.01" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div>
                <Label htmlFor="officials">Assigned Officials</Label>
                <Input type="text" id="officials" name="officials" placeholder="Comma-separated names" required />
              </div>
              <div>
                <Label htmlFor="budgetProposal">Link to Approved Budget Proposal (Optional)</Label>
                <Select value={selectedBudgetProposal?.toString() || ''} onValueChange={(value) => setSelectedBudgetProposal(value ? Number(value) : null)}>
                  <SelectTrigger id="budgetProposal">
                    <SelectValue placeholder="Select approved budget proposal" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedBudgetProposals.map((proposal) => (
                      <SelectItem key={proposal.id} value={proposal.id.toString()}>
                        {proposal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedBudgetProposal && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBudgetProposal(null)}
                    className="mt-2 text-sm"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear selection
                  </Button>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Event Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update event details and information.</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <form onSubmit={handleEditEvent}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Event Title</Label>
                  <Input type="text" id="edit-title" name="title" defaultValue={selectedEvent.title} required />
                </div>
                <div>
                  <Label htmlFor="edit-date">Date</Label>
                  <Input type="date" id="edit-date" name="date" defaultValue={selectedEvent.date} required />
                </div>
                <div>
                  <Label htmlFor="edit-venue">Venue</Label>
                  <Input type="text" id="edit-venue" name="venue" defaultValue={selectedEvent.venue} required />
                </div>
                <div>
                  <Label htmlFor="edit-time">Time</Label>
                  <Input type="text" id="edit-time" name="time" defaultValue={selectedEvent.time} required />
                </div>
                <div>
                  <Label htmlFor="edit-budget">Budget (₱)</Label>
                  <Input type="number" id="edit-budget" name="budget" defaultValue={selectedEvent.budget} min="0" step="0.01" required />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" name="description" defaultValue={selectedEvent.description} required />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select name="status" defaultValue={selectedEvent.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Update Event</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Documents Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Upload documents for: <strong>{selectedEvent.title}</strong></p>
              <div>
                <Label htmlFor="upload-photos">Event Photos</Label>
                <Input type="file" id="upload-photos" accept="image/*" multiple onChange={handlePhotoUpload} />
              </div>
              <div>
                <Label htmlFor="upload-receipts">Receipts</Label>
                <Input type="file" id="upload-receipts" accept="image/*,application/pdf" multiple onChange={handleReceiptUpload} />
              </div>
              <div>
                <Label htmlFor="upload-attendance">Attendance Sheet</Label>
                <Input type="file" id="upload-attendance" accept="image/*,application/pdf" onChange={handleAttendanceUpload} />
              </div>
              <div>
                <Label htmlFor="upload-others">Other Documents</Label>
                <Input type="file" id="upload-others" accept="*" multiple onChange={handleOthersUpload} />
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUploadDocuments}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Modal */}
      <Dialog open={showArchiveModal} onOpenChange={setShowArchiveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this event?
            </DialogDescription>
          </DialogHeader>
          {eventToArchive && (
            <div className="py-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Event:</strong> {eventToArchive.title}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Date:</strong> {eventToArchive.date}
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  This event will be moved to the Archives section. You can restore it later if needed.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveModal(false)}>
              Cancel
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={confirmArchiveEvent}>
              <Archive className="w-4 h-4 mr-2" />
              Archive Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}