import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  FileText,
  Calendar,
  Users,
  MapPin,
  Wallet,
  Shield,
  Search,
  Eye
} from 'lucide-react';
import { storage } from '../utils/storage';
import logoImage from 'figma:asset/c1c184dbafb09f96366bc3ee26a02e53e96d0e3e.png';

export function PublicActivitiesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Load approved activity proposals AND events from Events page
  const activityProposals = storage.getActivityProposals() || [];
  const approvedActivities = activityProposals.filter((p: any) => p.status === 'approved');
  
  // Load events from Events page (showing completed and ongoing events publicly)
  const events = storage.getEvents() || [];
  const publicEvents = events.filter((e: any) => 
    e.status === 'Completed' || e.status === 'Ongoing'
  ).map((event: any) => ({
    ...event,
    // Map event fields to activity proposal format for consistency
    title: event.title,
    description: event.description,
    date: event.date,
    venue: event.venue || event.location,
    participants: event.targetParticipants || event.participants || 0,
    budget: event.budget || 0,
    status: event.status,
    source: 'event', // Tag to identify source
  }));

  // Combine both sources
  const allActivities = [
    ...approvedActivities.map((a: any) => ({ ...a, source: 'proposal' })),
    ...publicEvents
  ];

  // Filter activities
  const filteredActivities = allActivities.filter((activity: any) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Sort activities
  const sortedActivities = [...filteredActivities].sort((a: any, b: any) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'date-asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

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
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl">Activity & Accomplishment Reports</h1>
              <p className="text-gray-600">Browse approved activity proposals and accomplishment reports</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-gray-600">Total Activities</span>
            </div>
            <p className="text-3xl">{allActivities.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-green-600" />
              <span className="text-sm text-gray-600">Total Participants</span>
            </div>
            <p className="text-3xl">
              {allActivities.reduce((sum: number, a: any) => sum + (a.targetParticipants || a.participants || 0), 0)}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-8 h-8 text-purple-600" />
              <span className="text-sm text-gray-600">Total Budget</span>
            </div>
            <p className="text-3xl">
              ₱{allActivities.reduce((sum: number, a: any) => sum + (a.budget || 0), 0).toLocaleString()}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-orange-600" />
              <span className="text-sm text-gray-600">This Year</span>
            </div>
            <p className="text-3xl">
              {allActivities.filter((a: any) => new Date(a.date).getFullYear() === new Date().getFullYear()).length}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg">Filter Activities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download All Reports
              </Button>
            </div>
          </div>
        </Card>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedActivities.length > 0 ? (
            sortedActivities.map((activity: any) => (
              <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-green-100 text-green-700">Approved</Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                <h3 className="text-lg mb-3">{activity.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{activity.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(activity.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{activity.targetParticipants} participants</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Wallet className="w-4 h-4" />
                    <span>₱{(activity.budget || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center col-span-full">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg mb-2">No Activities Found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search criteria' : 'No approved activities yet'}
              </p>
            </Card>
          )}
        </div>

        {sortedActivities.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Showing {sortedActivities.length} of {allActivities.length} total activities
            </p>
          </div>
        )}
      </div>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">{selectedActivity.title}</h2>
                  <Badge className="bg-green-100 text-green-700">Approved Activity</Badge>
                </div>
                <Button variant="ghost" onClick={() => setSelectedActivity(null)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm text-gray-600 mb-2">Description</h3>
                  <p className="text-gray-900">{selectedActivity.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-gray-600 mb-1">Date</h3>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(selectedActivity.date).toLocaleDateString('en-US', { 
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
                      {selectedActivity.location}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-600 mb-1">Target Participants</h3>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      {selectedActivity.targetParticipants} participants
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-600 mb-1">Budget</h3>
                    <p className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-gray-400" />
                      ₱{(selectedActivity.budget || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                {selectedActivity.requirements && selectedActivity.requirements.length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-600 mb-2">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedActivity.requirements.map((req: string, index: number) => (
                        <li key={index} className="text-gray-900">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Submission Info */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Submitted by:</span>
                    <span className="text-gray-900">{selectedActivity.submittedBy}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Submitted on:</span>
                    <span className="text-gray-900">
                      {new Date(selectedActivity.submittedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedActivity(null)}>
                    Close
                  </Button>
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Report
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