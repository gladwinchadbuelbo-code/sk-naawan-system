import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft, 
  Search,
  Download,
  FileText,
  Wallet,
  Calendar,
  Filter,
  Shield,
  SlidersHorizontal
} from 'lucide-react';
import { storage } from '../utils/storage';
import logoImage from 'figma:asset/c1c184dbafb09f96366bc3ee26a02e53e96d0e3e.png';

export function PublicSearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [documentType, setDocumentType] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load all public data
  const events = storage.getEvents() || [];
  const funds = storage.getFunds() || [];
  const activityProposals = storage.getActivityProposals() || [];
  const budgetProposals = storage.getBudgetProposals() || [];

  // Filter approved items
  const approvedEvents = events.filter((e: any) => e.status !== 'Planning');
  const approvedActivityProposals = activityProposals.filter((p: any) => p.status === 'approved');
  const approvedBudgetProposals = budgetProposals.filter((p: any) => p.status === 'approved');

  // Combined search results
  const searchResults = useMemo(() => {
    const results: any[] = [];

    // Search in approved events
    if (documentType === 'all' || documentType === 'events') {
      approvedEvents.forEach((event: any) => {
        if (
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({
            ...event,
            type: 'event',
            title: event.title,
            date: event.date,
            category: 'Event',
          });
        }
      });
    }

    // Search in approved activity proposals
    if (documentType === 'all' || documentType === 'activities') {
      approvedActivityProposals.forEach((proposal: any) => {
        if (
          proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proposal.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({
            ...proposal,
            type: 'activity',
            title: proposal.title,
            date: proposal.date || proposal.submittedDate,
            category: 'Activity Report',
          });
        }
      });
    }

    // Search in budget records
    if (documentType === 'all' || documentType === 'budget') {
      funds.forEach((fund: any) => {
        if (
          fund.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fund.category.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({
            ...fund,
            type: 'budget',
            title: fund.description,
            date: fund.date,
            category: fund.category,
          });
        }
      });
    }

    // Search in approved budget proposals
    if (documentType === 'all' || documentType === 'budget-proposals') {
      approvedBudgetProposals.forEach((proposal: any) => {
        if (
          proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proposal.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({
            ...proposal,
            type: 'budget-proposal',
            title: proposal.title,
            date: proposal.submittedDate,
            category: 'Budget Proposal',
          });
        }
      });
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      results.filter((r: any) => {
        const itemDate = new Date(r.date);
        if (dateFilter === 'this-month') {
          return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
        } else if (dateFilter === 'this-year') {
          return itemDate.getFullYear() === now.getFullYear();
        } else if (dateFilter === 'last-year') {
          return itemDate.getFullYear() === now.getFullYear() - 1;
        }
        return true;
      });
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      return results.filter((r: any) => r.category === categoryFilter);
    }

    return results.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, documentType, dateFilter, categoryFilter, approvedEvents, approvedActivityProposals, funds, approvedBudgetProposals]);

  // Get all unique categories
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    funds.forEach((f: any) => cats.add(f.category));
    return Array.from(cats);
  }, [funds]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'activity':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'budget':
      case 'budget-proposal':
        return <Wallet className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'event':
        return <Badge className="bg-blue-100 text-blue-700">Event</Badge>;
      case 'activity':
        return <Badge className="bg-green-100 text-green-700">Activity</Badge>;
      case 'budget':
        return <Badge className="bg-purple-100 text-purple-700">Budget</Badge>;
      case 'budget-proposal':
        return <Badge className="bg-orange-100 text-orange-700">Budget Proposal</Badge>;
      default:
        return <Badge variant="outline">Document</Badge>;
    }
  };

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
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl">Search & Downloads</h1>
              <p className="text-gray-600">Search and download public documents and reports</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="p-8 mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                placeholder="Search documents, budgets, activities, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-14 text-lg"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Document Type</label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="activities">Activity Reports</SelectItem>
                    <SelectItem value="budget">Budget Records</SelectItem>
                    <SelectItem value="budget-proposals">Budget Proposals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Search Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          {searchResults.length > 0 && (
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download All Results
            </Button>
          )}
        </div>

        {searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((result: any, index: number) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getTypeIcon(result.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{result.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {result.description || 'No description available'}
                        </p>
                      </div>
                      <div className="ml-4">{getTypeBadge(result.type)}</div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(result.date).toLocaleDateString()}
                      </div>
                      {result.category && (
                        <Badge variant="outline" className="text-xs">
                          {result.category}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      {result.type === 'event' && (
                        <Button variant="ghost" size="sm" onClick={() => navigate('/public/calendar')}>
                          View in Calendar
                        </Button>
                      )}
                      {result.type === 'activity' && (
                        <Button variant="ghost" size="sm" onClick={() => navigate('/public/activities')}>
                          View Activity Report
                        </Button>
                      )}
                      {(result.type === 'budget' || result.type === 'budget-proposal') && (
                        <Button variant="ghost" size="sm" onClick={() => navigate('/public/budget')}>
                          View Budget Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg mb-2">
              {searchQuery ? 'No results found' : 'Start searching'}
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? 'Try adjusting your search criteria or filters' 
                : 'Enter a search term to find documents, budgets, activities, and events'}
            </p>
          </Card>
        )}

        {/* Popular Downloads */}
        <div className="mt-12">
          <h2 className="text-2xl mb-6">Popular Downloads</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/public/budget')}>
              <Wallet className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg mb-2">Complete Budget Report</h3>
              <p className="text-sm text-gray-600 mb-4">Current year budget allocations and expenses</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/public/activities')}>
              <FileText className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg mb-2">Activity Reports</h3>
              <p className="text-sm text-gray-600 mb-4">All approved accomplishment reports</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/public/calendar')}>
              <Calendar className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg mb-2">Event Calendar</h3>
              <p className="text-sm text-gray-600 mb-4">Upcoming events and activities schedule</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}