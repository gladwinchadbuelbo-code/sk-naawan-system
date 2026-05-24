import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Shield,
  Clock
} from 'lucide-react';
import { storage } from '../utils/storage';
import logoImage from 'figma:asset/c1c184dbafb09f96366bc3ee26a02e53e96d0e3e.png';

export function PublicCalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Load approved events
  const events = storage.getEvents() || [];
  const approvedEvents = events.filter((e: any) => e.status !== 'Planning');

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return approvedEvents.filter((event: any) => event.date === dateStr);
  };

  // Upcoming events
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return approvedEvents
      .filter((e: any) => new Date(e.date) >= today)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);
  }, [approvedEvents]);

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate('/public')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portal
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <img src={logoImage} alt="SK Logo" className="w-6 h-6 object-contain" />
                <span>SK Transparency Portal</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Staff Login
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl">Event Calendar</h1>
              <p className="text-gray-600">View upcoming SK events and activities</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">
                  {monthNames[month]} {year}
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-sm text-gray-600 py-2">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day, index) => {
                  const dayEvents = day ? getEventsForDay(day) : [];
                  const isToday = day && 
                    day === new Date().getDate() && 
                    month === new Date().getMonth() && 
                    year === new Date().getFullYear();

                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border rounded-lg ${
                        day 
                          ? 'bg-white hover:bg-gray-50 cursor-pointer' 
                          : 'bg-gray-50'
                      } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm mb-1 ${isToday ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.map((event: any) => (
                              <div
                                key={event.id}
                                className="text-xs p-1 bg-blue-100 text-blue-700 rounded truncate cursor-pointer hover:bg-blue-200"
                                onClick={() => setSelectedEvent(event)}
                              >
                                {event.title}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Upcoming Events Sidebar */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event: any) => (
                    <div
                      key={event.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-lg p-2 text-center min-w-[50px]">
                          <p className="text-lg text-blue-600">
                            {new Date(event.date).getDate()}
                          </p>
                          <p className="text-xs text-blue-600">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm mb-1 truncate">{event.title}</h4>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                          <Badge 
                            variant="outline" 
                            className="mt-2 text-xs"
                          >
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">No upcoming events</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Event Legend */}
            <Card className="p-6 mt-6">
              <h3 className="text-sm text-gray-600 mb-3">Event Status</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm">Upcoming</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">{selectedEvent.title}</h2>
                  <Badge variant="outline">{selectedEvent.status}</Badge>
                </div>
                <Button variant="ghost" onClick={() => setSelectedEvent(null)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm text-gray-600 mb-2">Description</h3>
                  <p className="text-gray-900">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-gray-600 mb-1">Date & Time</h3>
                    <p className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-600 mb-1">Location</h3>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedEvent.location}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-600 mb-1">Expected Participants</h3>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      {selectedEvent.targetParticipants || 'TBA'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-600 mb-1">Budget</h3>
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">₱{selectedEvent.budget?.toLocaleString() || 'TBA'}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}