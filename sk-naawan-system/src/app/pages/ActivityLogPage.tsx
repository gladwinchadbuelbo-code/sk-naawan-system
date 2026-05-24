import { useState } from 'react';
import { FileText, Wallet, Calendar, User, Download, Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { storage } from '../utils/storage';

interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  module: 'Budget' | 'Events' | 'Reports' | 'System' | 'Proposal' | 'Approval' | 'Document';
  description: string;
  details?: string;
}

export function ActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('all');

  // Load actual activity log from storage
  const storedActivities = storage.getActivityLog() || [];
  
  const activities: ActivityLog[] = storedActivities.map((log: any) => {
    // Map the logged activities to display format
    let module: any = 'System';
    let action = log.action || 'Activity';
    let description = log.description || 'System activity';
    
    if (log.type === 'budget') {
      module = 'Budget';
      if (log.action === 'added') {
        action = log.description?.includes('expense') ? 'Added Expense' : 'Added Income';
      } else if (log.action === 'deleted') {
        action = 'Deleted Entry';
      } else if (log.action === 'updated') {
        action = 'Updated Entry';
      }
    } else if (log.type === 'event') {
      module = 'Events';
      if (log.action === 'created') action = 'Created Event';
      if (log.action === 'updated') action = 'Updated Event';
      if (log.action === 'deleted') action = 'Deleted Event';
    } else if (log.type === 'report') {
      module = 'Reports';
      if (log.action === 'created') action = 'Generated Report';
      if (log.action === 'updated') action = 'Updated Report';
    } else if (log.type === 'proposal') {
      module = 'Proposal';
      action = 'Submitted Proposal';
    } else if (log.type === 'approval') {
      module = 'Approval';
      action = log.action === 'approved' ? 'Approved Proposal' : 'Returned Proposal';
    } else if (log.type === 'document') {
      module = 'Document';
      action = 'Uploaded Documents';
    }

    return {
      id: log.id,
      timestamp: new Date(log.timestamp).toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      user: log.user || 'SK Official',
      action,
      module,
      description,
      details: log.details || '',
    };
  });

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterModule === 'all' || activity.module === filterModule;
    return matchesSearch && matchesFilter;
  });

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Budget':
        return <Wallet className="w-4 h-4" />;
      case 'Events':
        return <Calendar className="w-4 h-4" />;
      case 'Reports':
        return <FileText className="w-4 h-4" />;
      case 'Proposal':
        return <FileText className="w-4 h-4" />;
      case 'Approval':
        return <FileText className="w-4 h-4" />;
      case 'Document':
        return <FileText className="w-4 h-4" />;
      case 'System':
        return <User className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'Budget':
        return 'bg-blue-100 text-blue-700';
      case 'Events':
        return 'bg-green-100 text-green-700';
      case 'Reports':
        return 'bg-purple-100 text-purple-700';
      case 'Proposal':
        return 'bg-orange-100 text-orange-700';
      case 'Approval':
        return 'bg-indigo-100 text-indigo-700';
      case 'Document':
        return 'bg-teal-100 text-teal-700';
      case 'System':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleExportLog = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Module', 'Action', 'Description', 'Details'].join(','),
      ...activities.map((activity) =>
        [
          activity.timestamp,
          activity.user,
          activity.module,
          activity.action,
          `"${activity.description}"`,
          `"${activity.details || ''}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl">Activity Log</h1>
        <p className="text-gray-600 mt-2">Track all system activities and changes</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="Budget">Budget</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Reports">Reports</SelectItem>
                <SelectItem value="Proposal">Proposals</SelectItem>
                <SelectItem value="Approval">Approvals</SelectItem>
                <SelectItem value="Document">Documents</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportLog} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Activity List */}
      <Card className="overflow-hidden">
        <div className="divide-y">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No activities found</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getModuleColor(activity.module)}`}>
                    {getModuleIcon(activity.module)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium">{activity.action}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {activity.module}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        {activity.details && (
                          <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.user}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget Activities</p>
              <p className="text-xl">
                {activities.filter((a) => a.module === 'Budget').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Event Activities</p>
              <p className="text-xl">
                {activities.filter((a) => a.module === 'Events').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Report Activities</p>
              <p className="text-xl">
                {activities.filter((a) => a.module === 'Reports').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">System Activities</p>
              <p className="text-xl">
                {activities.filter((a) => a.module === 'System').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}