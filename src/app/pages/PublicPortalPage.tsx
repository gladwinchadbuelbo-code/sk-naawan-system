import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { 
  Search, 
  Calendar, 
  Wallet, 
  FileText, 
  Download, 
  TrendingUp,
  Users,
  Eye,
  ChevronRight,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useMemo, useState } from 'react';
import logoImage from 'figma:asset/c1c184dbafb09f96366bc3ee26a02e53e96d0e3e.png';
import { resetAllData } from '../utils/seedData';

export function PublicPortalPage() {
  const navigate = useNavigate();

  // Load approved data only
  const events = storage.getEvents() || [];
  const funds = storage.getFunds() || [];
  const activityProposals = storage.getActivityProposals() || [];
  const budgetProposals = storage.getBudgetProposals() || [];

  // Filter only approved items
  const approvedEvents = events.filter((e: any) => e.status !== 'Planning');
  const approvedActivityProposals = activityProposals.filter((p: any) => p.status === 'approved');
  const approvedBudgetProposals = budgetProposals.filter((p: any) => p.status === 'approved');

  // Calculate public stats
  const totalBudget = useMemo(() => 
    funds.filter((f: any) => f.type === 'income').reduce((sum: number, f: any) => sum + f.amount, 0),
    [funds]
  );

  const totalExpenses = useMemo(() => 
    funds.filter((f: any) => f.type === 'expense').reduce((sum: number, f: any) => sum + f.amount, 0),
    [funds]
  );

  const utilizationRate = totalBudget > 0 ? ((totalExpenses / totalBudget) * 100).toFixed(1) : 0;

  // Get recent approved activities
  const recentActivities = approvedActivityProposals.slice(0, 3);

  // Get upcoming events
  const upcomingEvents = approvedEvents
    .filter((e: any) => new Date(e.date) >= new Date())
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  // State for alert visibility
  const [showAlert, setShowAlert] = useState(false);

  // Check if there's no data
  const hasNoData = events.length === 0 && funds.length === 0 && 
                    activityProposals.length === 0 && budgetProposals.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Public Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={logoImage} alt="SK Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg">SK Transparency Portal</h1>
                <p className="text-xs text-gray-500">Public Information Access</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Staff Login
            </Button>
          </div>
        </div>
      </header>

      {/* No Data Alert */}
      {hasNoData && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Alert className="bg-yellow-50 border-yellow-300">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-900">No Data Available</AlertTitle>
              <AlertDescription className="text-yellow-800">
                The transparency portal appears to have no data. This usually happens when the browser storage is empty.
                <div className="mt-2 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white hover:bg-yellow-50"
                    onClick={() => {
                      resetAllData();
                    }}
                  >
                    Reset & Load Sample Data
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      window.open('https://console.firebase.google.com/', '_blank');
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0E6B3D] to-[#1BA160] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl mb-4">Sangguniang Kabataan Transparency Portal</h2>
            <p className="text-xl text-green-100 mb-8">
              Access public information on SK activities, budget allocations, and accomplishment reports
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search budgets, activities, events, or documents..."
                  className="pl-12 h-14 text-base bg-white"
                  onClick={() => navigate('/public/search')}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-6">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8" />
                <div>
                  <p className="text-sm text-green-100">Total Budget</p>
                  <p className="text-2xl">₱{totalBudget.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <p className="text-sm text-green-100">Utilization Rate</p>
                  <p className="text-2xl">{utilizationRate}%</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8" />
                <div>
                  <p className="text-sm text-green-100">Total Events</p>
                  <p className="text-2xl">{approvedEvents.length}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-6">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8" />
                <div>
                  <p className="text-sm text-green-100">Public Reports</p>
                  <p className="text-2xl">{approvedActivityProposals.length + approvedBudgetProposals.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/public/budget')}
          >
            <Wallet className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg mb-2">Budget Transparency</h3>
            <p className="text-sm text-gray-600 mb-4">View approved budget allocations and financial reports</p>
            <Button variant="ghost" className="w-full">
              Browse Budget <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/public/activities')}
          >
            <FileText className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg mb-2">Activity Reports</h3>
            <p className="text-sm text-gray-600 mb-4">Browse accomplishment reports and event documentation</p>
            <Button variant="ghost" className="w-full">
              Browse Activities <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/public/calendar')}
          >
            <Calendar className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-lg mb-2">Event Calendar</h3>
            <p className="text-sm text-gray-600 mb-4">View upcoming events and activity schedules</p>
            <Button variant="ghost" className="w-full">
              View Calendar <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/public/search')}
          >
            <Download className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-lg mb-2">Downloads</h3>
            <p className="text-sm text-gray-600 mb-4">Download public documents and reports</p>
            <Button variant="ghost" className="w-full">
              View Downloads <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>

        {/* Recent Activities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Approved Activities */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Recent Activities</h2>
              <Button variant="link" onClick={() => navigate('/public/activities')}>
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity: any) => (
                  <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg mb-2">{activity.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(activity.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {activity.targetParticipants} participants
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Approved</Badge>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500">No approved activities yet</p>
                </Card>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Upcoming Events</h2>
              <Button variant="link" onClick={() => navigate('/public/calendar')}>
                View Calendar <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event: any) => (
                  <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 rounded-lg p-3 text-center min-w-[60px]">
                        <p className="text-2xl text-[#1BA160]">
                          {new Date(event.date).getDate()}
                        </p>
                        <p className="text-xs text-[#1BA160]">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{event.location}</p>
                        <Badge variant="outline" className="text-xs">
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500">No upcoming events</p>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Transparency Statement */}
        <Card className="p-8 bg-green-50 border-green-200">
          <div className="flex items-start gap-4">
            <div className="bg-[#1BA160] rounded-full p-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl mb-2">Commitment to Transparency</h3>
              <p className="text-gray-700 mb-4">
                The Sangguniang Kabataan is committed to transparency and accountability in all our activities 
                and financial transactions. This public portal provides access to approved budgets, activity reports, 
                and documentation to ensure that all stakeholders can monitor our programs and services.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1BA160] rounded-full"></div>
                  <span className="text-sm">COA-Compliant Financial Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1BA160] rounded-full"></div>
                  <span className="text-sm">LYDO-Format Accomplishment Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1BA160] rounded-full"></div>
                  <span className="text-sm">Real-Time Budget Updates</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Sangguniang Kabataan. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            For inquiries, please contact your local SK officials.
          </p>
        </div>
      </footer>
    </div>
  );
}