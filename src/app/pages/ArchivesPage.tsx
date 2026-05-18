import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Archive,
  ArchiveRestore,
  Calendar,
  FileText,
  Wallet,
  Users,
  Search,
  Eye,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Alert, AlertDescription } from '../components/ui/alert';

interface ArchivedEvent {
  id: number;
  title: string;
  date: string;
  venue: string;
  status: string;
  budget: number;
  archivedAt: string;
  archivedBy: string;
  description: string;
}

interface ArchivedFundEntry {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: string;
  description: string;
  orNumber?: string;
  archivedAt: string;
  archivedBy: string;
}

interface ArchivedProposal {
  id: number;
  title: string;
  type: 'activity' | 'budget';
  submittedBy: string;
  submittedDate: string;
  status: string;
  archivedAt: string;
  archivedBy: string;
}

export function ArchivesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Archived data
  const [archivedEvents, setArchivedEvents] = useState<ArchivedEvent[]>([]);
  const [archivedFunds, setArchivedFunds] = useState<ArchivedFundEntry[]>([]);
  const [archivedProposals, setArchivedProposals] = useState<ArchivedProposal[]>([]);

  useEffect(() => {
    loadArchivedData();
  }, []);

  // Reload data when tab changes
  useEffect(() => {
    loadArchivedData();
  }, [activeTab]);

  const loadArchivedData = () => {
    const events = storage.getArchivedEvents();
    const funds = storage.getArchivedFundEntries();
    const proposals = storage.getArchivedProposals();

    console.log('Loading archived data:', { events, funds, proposals });

    setArchivedEvents(events);
    setArchivedFunds(funds);
    setArchivedProposals(proposals);
  };

  // Permission checks
  const canAccessActivityArchives = user?.role === 'secretary' || user?.role === 'chairperson';
  const canAccessFinancialArchives = user?.role === 'treasurer' || user?.role === 'chairperson';
  const canRestoreArchives = user?.role !== 'chairperson'; // Secretary and Treasurer can restore
  const isReadOnly = user?.role === 'chairperson'; // Chairperson is read-only

  const handleRestore = async (item: any, type: string) => {
    if (isReadOnly) {
      toast.error('Chairperson has read-only access to archives');
      return;
    }

    setSelectedItem({ ...item, archiveType: type });
    setShowRestoreDialog(true);
  };

  const confirmRestore = () => {
    if (!selectedItem) return;

    try {
      const { archiveType, ...itemData } = selectedItem;

      switch (archiveType) {
        case 'event':
          if (user?.role !== 'secretary') {
            toast.error('Only Secretary can restore activity archives');
            return;
          }
          storage.restoreArchivedEvent(itemData.id);
          setArchivedEvents(archivedEvents.filter(e => e.id !== itemData.id));
          toast.success('Event restored successfully');
          break;

        case 'fund':
          if (user?.role !== 'treasurer') {
            toast.error('Only Treasurer can restore financial archives');
            return;
          }
          storage.restoreArchivedFundEntry(itemData.id);
          setArchivedFunds(archivedFunds.filter(f => f.id !== itemData.id));
          toast.success('Fund entry restored successfully');
          break;

        case 'proposal':
          const proposal = archivedProposals.find(p => p.id === itemData.id);
          if (proposal?.type === 'activity' && user?.role !== 'secretary') {
            toast.error('Only Secretary can restore activity proposals');
            return;
          }
          if (proposal?.type === 'budget' && user?.role !== 'treasurer') {
            toast.error('Only Treasurer can restore budget proposals');
            return;
          }
          storage.restoreArchivedProposal(itemData.id);
          setArchivedProposals(archivedProposals.filter(p => p.id !== itemData.id));
          toast.success('Proposal restored successfully');
          break;
      }

      setShowRestoreDialog(false);
      setSelectedItem(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to restore item');
    }
  };

  const handleViewDetails = (item: any, type: string) => {
    setSelectedItem({ ...item, archiveType: type });
    setShowDetailDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Filter data by search term
  const filteredEvents = archivedEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFunds = archivedFunds.filter(fund =>
    fund.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.orNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProposals = archivedProposals.filter(proposal =>
    proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proposal.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Archive className="w-6 h-6 text-[#2f7d5f]" />
            Archives
          </h1>
          <p className="text-sm text-[#4a5c6e] mt-1">
            {isReadOnly 
              ? 'View archived records (Read-only access)'
              : 'Manage archived records for your department'}
          </p>
        </div>
      </div>

      {/* Permission Notice */}
      {isReadOnly && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            As Chairperson, you have read-only access to all archives. You can view but cannot restore or modify archived records.
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search archives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={loadArchivedData}
          className="flex items-center gap-2"
        >
          <Archive className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="events" 
            disabled={!canAccessActivityArchives}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Events & Activities
            {!canAccessActivityArchives && ' 🔒'}
          </TabsTrigger>
          <TabsTrigger 
            value="financial" 
            disabled={!canAccessFinancialArchives}
            className="flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            Financial Records
            {!canAccessFinancialArchives && ' 🔒'}
          </TabsTrigger>
          <TabsTrigger value="proposals" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Proposals
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Archived Events & Activities</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No archived events found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1e3a5f]">{event.title}</h3>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(event.date)}
                            </p>
                            <p className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {event.venue}
                            </p>
                            <p className="flex items-center gap-2">
                              <Wallet className="w-4 h-4" />
                              Budget: {formatCurrency(event.budget)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <Archive className="w-3 h-3" />
                            Archived on {formatDate(event.archivedAt)} by {event.archivedBy}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(event, 'event')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canRestoreArchives && user?.role === 'secretary' && (
                            <Button
                              size="sm"
                              onClick={() => handleRestore(event, 'event')}
                              className="bg-[#2f7d5f] hover:bg-[#25614a]"
                            >
                              <ArchiveRestore className="w-4 h-4 mr-1" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Archived Financial Records</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFunds.length === 0 ? (
                <div className="text-center py-12">
                  <Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No archived financial records found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFunds.map((fund) => (
                    <div
                      key={fund.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={fund.type === 'income' ? 'default' : 'destructive'}
                              className={
                                fund.type === 'income'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }
                            >
                              {fund.type.toUpperCase()}
                            </Badge>
                            <span className="font-semibold text-[#1e3a5f]">
                              {formatCurrency(fund.amount)}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p><strong>Category:</strong> {fund.category}</p>
                            <p><strong>Description:</strong> {fund.description}</p>
                            <p><strong>Date:</strong> {formatDate(fund.date)}</p>
                            {fund.orNumber && (
                              <p><strong>OR Number:</strong> {fund.orNumber}</p>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <Archive className="w-3 h-3" />
                            Archived on {formatDate(fund.archivedAt)} by {fund.archivedBy}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(fund, 'fund')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canRestoreArchives && user?.role === 'treasurer' && (
                            <Button
                              size="sm"
                              onClick={() => handleRestore(fund, 'fund')}
                              className="bg-[#2f7d5f] hover:bg-[#25614a]"
                            >
                              <ArchiveRestore className="w-4 h-4 mr-1" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proposals Tab */}
        <TabsContent value="proposals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Archived Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProposals.length === 0 ? (
                <div className="text-center py-12">
                  <Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No archived proposals found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                proposal.type === 'activity'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }
                            >
                              {proposal.type === 'activity' ? 'Activity' : 'Budget'}
                            </Badge>
                            <h3 className="font-semibold text-[#1e3a5f]">{proposal.title}</h3>
                          </div>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p><strong>Submitted by:</strong> {proposal.submittedBy}</p>
                            <p><strong>Submitted on:</strong> {formatDate(proposal.submittedDate)}</p>
                            <p><strong>Status:</strong> {proposal.status}</p>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <Archive className="w-3 h-3" />
                            Archived on {formatDate(proposal.archivedAt)} by {proposal.archivedBy}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(proposal, 'proposal')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canRestoreArchives && (
                            (proposal.type === 'activity' && user?.role === 'secretary') ||
                            (proposal.type === 'budget' && user?.role === 'treasurer')
                          ) && (
                            <Button
                              size="sm"
                              onClick={() => handleRestore(proposal, 'proposal')}
                              className="bg-[#2f7d5f] hover:bg-[#25614a]"
                            >
                              <ArchiveRestore className="w-4 h-4 mr-1" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Restore Confirmation Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore from Archive</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-[#4a5c6e]">
              Are you sure you want to restore this item? It will be moved back to the active records.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRestore} className="bg-[#2f7d5f] hover:bg-[#25614a]">
              Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Archived Item Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(selectedItem, null, 2)}
                </pre>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}