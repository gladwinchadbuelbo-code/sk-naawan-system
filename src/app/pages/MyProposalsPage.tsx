import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, MapPin, Users, Wallet, CheckCircle, Clock, XCircle, MessageSquare, Eye, ArrowLeft, Filter } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { storage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

interface ActivityProposal {
  id: number;
  title: string;
  duration: string;
  activityCost: number;
  venue: string;
  sourceOfFund: string;
  rationale: string;
  objectives: string[];
  budgetaryRequirements: { item: string; amount: number }[];
  recommendation: string;
  attachments: any[];
  submittedBy: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'returned';
  comments?: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

export function MyProposalsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proposals, setProposals] = useState<ActivityProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<ActivityProposal | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'returned'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load only proposals submitted by the current user
    const allProposals = storage.getActivityProposals();
    const myProposals = allProposals.filter(
      (p: ActivityProposal) => p.submittedBy === user?.fullName
    );
    setProposals(myProposals);
  }, [user]);

  if (user?.role !== 'secretary') {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-orange-500" />
          <h2 className="text-xl mb-2">Access Denied</h2>
          <p className="text-gray-600">Only SK Secretary can view activity proposals.</p>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-green-300">✓ Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">⏳ Pending</Badge>;
      case 'returned':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-300">↩ Returned</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'returned':
        return <XCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredProposals = proposals.filter((proposal) => {
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    const matchesSearch =
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.rationale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.venue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = proposals.filter(p => p.status === 'pending').length;
  const approvedCount = proposals.filter(p => p.status === 'approved').length;
  const returnedCount = proposals.filter(p => p.status === 'returned').length;

  const handleViewDetails = (proposal: ActivityProposal) => {
    setSelectedProposal(proposal);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/staff/events')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
        <h1 className="text-3xl mb-2">My Activity Proposals</h1>
        <p className="text-gray-600">Track the status of your submitted activity proposals</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Proposals</p>
              <h3 className="text-3xl mt-1">{proposals.length}</h3>
            </div>
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Review</p>
              <h3 className="text-3xl mt-1">{pendingCount}</h3>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Approved</p>
              <h3 className="text-3xl mt-1">{approvedCount}</h3>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Returned</p>
              <h3 className="text-3xl mt-1">{returnedCount}</h3>
            </div>
            <XCircle className="w-10 h-10 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg">Filter Proposals</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Search</label>
            <Input
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Status</label>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">⏳ Pending</SelectItem>
                <SelectItem value="approved">✓ Approved</SelectItem>
                <SelectItem value="returned">↩ Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length > 0 ? (
          filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {getStatusIcon(proposal.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl">{proposal.title}</h3>
                      {getStatusBadge(proposal.status)}
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{proposal.rationale || 'No rationale provided'}</p>

                    {/* Proposal Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{proposal.duration || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{proposal.venue || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>{proposal.sourceOfFund || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Wallet className="w-4 h-4" />
                        <span>₱{(proposal.activityCost || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Submission Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Submitted: {new Date(proposal.submittedDate).toLocaleDateString()}</span>
                      {proposal.reviewedDate && (
                        <span>• Reviewed: {new Date(proposal.reviewedDate).toLocaleDateString()}</span>
                      )}
                    </div>

                    {/* Comments Alert */}
                    {proposal.status === 'returned' && proposal.comments && (
                      <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-5 h-5 text-orange-600 mt-0.5" />
                          <div>
                            <p className="text-sm mb-1">
                              <strong>Chairperson's Feedback:</strong>
                            </p>
                            <p className="text-sm text-gray-700">{proposal.comments}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Approval Comments */}
                    {proposal.status === 'approved' && proposal.comments && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm mb-1">
                              <strong>Chairperson's Comments:</strong>
                            </p>
                            <p className="text-sm text-gray-700">{proposal.comments}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleViewDetails(proposal)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
                {proposal.status === 'returned' && (
                  <Button
                    onClick={() => navigate('/staff/activity/proposal/create')}
                    className="flex-1"
                  >
                    Create Revised Proposal
                  </Button>
                )}
                {proposal.status === 'approved' && (
                  <Button
                    onClick={() => navigate('/staff/events')}
                    className="flex-1"
                  >
                    View in Events
                  </Button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No Matching Proposals' : 'No Proposals Yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'You haven\'t submitted any activity proposals yet'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => navigate('/staff/activity/proposal/create')}>
                <FileText className="w-4 h-4 mr-2" />
                Create Your First Proposal
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Details Modal */}
      {selectedProposal && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span>{selectedProposal.title}</span>
                {getStatusBadge(selectedProposal.status)}
              </DialogTitle>
              <DialogDescription>
                Complete details of your activity proposal
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Rationale */}
              <div>
                <h3 className="text-sm mb-2">II. RATIONALE</h3>
                <p className="text-gray-900">{selectedProposal.rationale || 'No rationale provided'}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Duration</h3>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {selectedProposal.duration || 'N/A'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Venue</h3>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {selectedProposal.venue || 'N/A'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Activity Cost</h3>
                  <p className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-gray-400" />
                    ₱{(selectedProposal.activityCost || 0).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Source of Fund</h3>
                  <p className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {selectedProposal.sourceOfFund || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Objectives */}
              {selectedProposal.objectives && selectedProposal.objectives.length > 0 && (
                <div>
                  <h3 className="text-sm mb-2">III. OBJECTIVES</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedProposal.objectives.map((obj, index) => (
                      <li key={index} className="text-gray-900">{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Budgetary Requirements */}
              {selectedProposal.budgetaryRequirements && selectedProposal.budgetaryRequirements.length > 0 && (
                <div>
                  <h3 className="text-sm mb-2">IV. BUDGETARY REQUIREMENTS</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs text-gray-600">Item</th>
                          <th className="px-4 py-2 text-right text-xs text-gray-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedProposal.budgetaryRequirements.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">{item.item || 'N/A'}</td>
                            <td className="px-4 py-2 text-sm text-right">₱{(item.amount || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td className="px-4 py-2 text-sm">
                            <strong>Total</strong>
                          </td>
                          <td className="px-4 py-2 text-sm text-right">
                            <strong>
                              ₱{selectedProposal.budgetaryRequirements.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toLocaleString()}
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recommendation */}
              {selectedProposal.recommendation && (
                <div>
                  <h3 className="text-sm mb-2">V. RECOMMENDATION</h3>
                  <p className="text-gray-900">{selectedProposal.recommendation}</p>
                </div>
              )}

              {/* Status Timeline */}
              <div className="pt-4 border-t">
                <h3 className="text-sm mb-3">Proposal Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Submitted</p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedProposal.submittedDate).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">By: {selectedProposal.submittedBy}</p>
                    </div>
                  </div>

                  {selectedProposal.reviewedDate && (
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        selectedProposal.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'
                      }`}></div>
                      <div>
                        <p className="text-sm">
                          {selectedProposal.status === 'approved' ? 'Approved' : 'Returned for Revision'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(selectedProposal.reviewedDate).toLocaleString()}
                        </p>
                        {selectedProposal.reviewedBy && (
                          <p className="text-xs text-gray-500">By: {selectedProposal.reviewedBy}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments */}
              {selectedProposal.comments && (
                <div className={`p-4 rounded-lg border ${
                  selectedProposal.status === 'approved'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <MessageSquare className={`w-5 h-5 mt-0.5 ${
                      selectedProposal.status === 'approved' ? 'text-green-600' : 'text-orange-600'
                    }`} />
                    <div>
                      <p className="text-sm mb-1">
                        <strong>Chairperson's {selectedProposal.status === 'approved' ? 'Comments' : 'Feedback'}:</strong>
                      </p>
                      <p className="text-sm text-gray-700">{selectedProposal.comments}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
              {selectedProposal.status === 'returned' && (
                <Button onClick={() => {
                  setShowDetailsModal(false);
                  navigate('/staff/activity/proposal/create');
                }}>
                  Create Revised Proposal
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
