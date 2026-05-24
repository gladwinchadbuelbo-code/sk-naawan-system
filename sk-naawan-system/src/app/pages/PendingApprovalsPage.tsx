import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, MessageSquare, Calendar, Wallet, FileText, Clock, User } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
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

interface BudgetProposal {
  id: number;
  title: string;
  description: string;
  totalAmount: number;
  items: Array<{
    category: string;
    description: string;
    amount: number;
  }>;
  attachments: any[];
  submittedBy: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'returned';
  comments?: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

export function PendingApprovalsPage() {
  const navigate = useNavigate();
  const { canApprove, user } = useAuth();
  const [activityProposals, setActivityProposals] = useState<ActivityProposal[]>([]);
  const [budgetProposals, setBudgetProposals] = useState<BudgetProposal[]>([]);
  const [selectedActivityProposal, setSelectedActivityProposal] = useState<ActivityProposal | null>(null);
  const [selectedBudgetProposal, setSelectedBudgetProposal] = useState<BudgetProposal | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'return'>('approve');

  useEffect(() => {
    // Load proposals from localStorage
    const storedActivityProposals = storage.getActivityProposals();
    const storedBudgetProposals = storage.getBudgetProposals();
    
    setActivityProposals(storedActivityProposals);
    setBudgetProposals(storedBudgetProposals);
  }, []);

  if (!canApprove()) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl mb-2">Access Denied</h2>
          <p className="text-gray-600">Only SK President can access pending approvals.</p>
        </Card>
      </div>
    );
  }

  const pendingActivityProposals = activityProposals.filter(p => p.status === 'pending');
  const pendingBudgetProposals = budgetProposals.filter(p => p.status === 'pending');

  const handleReviewActivityProposal = (proposal: ActivityProposal) => {
    setSelectedActivityProposal(proposal);
    setSelectedBudgetProposal(null);
    setShowReviewModal(true);
    setReviewComments('');
  };

  const handleReviewBudgetProposal = (proposal: BudgetProposal) => {
    setSelectedBudgetProposal(proposal);
    setSelectedActivityProposal(null);
    setShowReviewModal(true);
    setReviewComments('');
  };

  const handleSubmitReview = () => {
    if (selectedActivityProposal) {
      const updatedProposals = activityProposals.map(p =>
        p.id === selectedActivityProposal.id
          ? { 
              ...p, 
              status: reviewAction === 'approve' ? 'approved' : 'returned', 
              comments: reviewComments,
              reviewedBy: user?.fullName,
              reviewedDate: new Date().toISOString()
            }
          : p
      );
      setActivityProposals(updatedProposals);
      storage.setActivityProposals(updatedProposals);

      // Add notification for Secretary
      storage.addNotification({
        recipient: 'secretary',
        title: `${reviewAction === 'approve' ? '✅' : '↩️'} Activity Proposal ${reviewAction === 'approve' ? 'Approved' : 'Returned'}`,
        message: `Your proposal "${selectedActivityProposal.title}" has been ${reviewAction === 'approve' ? 'approved' : 'returned for revision'}. ${reviewComments ? `Comment: ${reviewComments}` : ''}`,
        type: reviewAction === 'approve' ? 'success' : 'warning',
        link: '/staff/my-proposals',
      });

      // If approved, create the event
      if (reviewAction === 'approve') {
        const events = storage.getEvents() || [];
        const newEvent = {
          id: Date.now(),
          title: selectedActivityProposal.title,
          description: selectedActivityProposal.rationale,
          date: selectedActivityProposal.duration.split('-')[0]?.trim() || new Date().toISOString().split('T')[0],
          venue: selectedActivityProposal.venue,
          time: '9:00 AM - 5:00 PM',
          status: 'Upcoming',
          budget: selectedActivityProposal.activityCost,
          assignedOfficials: [selectedActivityProposal.submittedBy],
          proposalId: selectedActivityProposal.id,
        };
        storage.setEvents([...events, newEvent]);
      }

      toast.success(`Activity proposal ${reviewAction === 'approve' ? 'approved' : 'returned'} successfully`);
    } else if (selectedBudgetProposal) {
      const updatedProposals = budgetProposals.map(p =>
        p.id === selectedBudgetProposal.id
          ? { 
              ...p, 
              status: reviewAction === 'approve' ? 'approved' : 'returned', 
              comments: reviewComments,
              reviewedBy: user?.fullName,
              reviewedDate: new Date().toISOString()
            }
          : p
      );
      setBudgetProposals(updatedProposals);
      storage.setBudgetProposals(updatedProposals);

      // Add notification for Treasurer
      storage.addNotification({
        recipient: 'treasurer',
        title: `${reviewAction === 'approve' ? '✅' : '↩️'} Budget Proposal ${reviewAction === 'approve' ? 'Approved' : 'Returned'}`,
        message: `Your proposal "${selectedBudgetProposal.title}" has been ${reviewAction === 'approve' ? 'approved' : 'returned for revision'}. ${reviewComments ? `Comment: ${reviewComments}` : ''}`,
        type: reviewAction === 'approve' ? 'success' : 'warning',
      });

      // If approved, add budget allocation
      if (reviewAction === 'approve') {
        const funds = storage.getFunds() || [];
        const newFund = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          category: 'Budget Allocation',
          description: selectedBudgetProposal.title,
          type: 'income' as const,
          amount: selectedBudgetProposal.totalAmount,
          proposalId: selectedBudgetProposal.id,
        };
        storage.setFunds([...funds, newFund]);
      }

      toast.success(`Budget proposal ${reviewAction === 'approve' ? 'approved' : 'returned'} successfully`);
    }

    storage.addActivity({
      type: 'approval',
      action: reviewAction === 'approve' ? 'approved' : 'returned',
      description: `${user?.fullName} ${reviewAction === 'approve' ? 'approved' : 'returned'} ${selectedActivityProposal ? 'activity' : 'budget'} proposal`,
    });

    setShowReviewModal(false);
    setSelectedActivityProposal(null);
    setSelectedBudgetProposal(null);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Pending Approvals</h1>
        <p className="text-gray-600">Review and approve proposals from Secretary and Treasurer</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Activity Proposals</p>
              <h3 className="text-3xl mt-1">{pendingActivityProposals.length}</h3>
            </div>
            <Calendar className="w-10 h-10 text-orange-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Budget Proposals</p>
              <h3 className="text-3xl mt-1">{pendingBudgetProposals.length}</h3>
            </div>
            <Wallet className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Pending</p>
              <h3 className="text-3xl mt-1">{pendingActivityProposals.length + pendingBudgetProposals.length}</h3>
            </div>
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity">
            <Calendar className="w-4 h-4 mr-2" />
            Activity Proposals ({pendingActivityProposals.length})
          </TabsTrigger>
          <TabsTrigger value="budget">
            <Wallet className="w-4 h-4 mr-2" />
            Budget Proposals ({pendingBudgetProposals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          {pendingActivityProposals.length > 0 ? (
            <div className="space-y-4">
              {pendingActivityProposals.map((proposal) => (
                <Card key={proposal.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl">{proposal.title}</h3>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{proposal.rationale || 'No rationale provided'}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <p>{proposal.duration || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Venue:</span>
                          <p>{proposal.venue || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Cost:</span>
                          <p className="text-green-600">₱{(proposal.activityCost || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Fund Source:</span>
                          <p>{proposal.sourceOfFund || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-500">
                        <User className="w-4 h-4 inline mr-1" />
                        Submitted by {proposal.submittedBy} on {new Date(proposal.submittedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => {
                          setReviewAction('approve');
                          handleReviewActivityProposal(proposal);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        onClick={() => {
                          setReviewAction('return');
                          handleReviewActivityProposal(proposal);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Return for Revision
                      </Button>
                    </div>
                  </div>
                  {proposal.requirements && proposal.requirements.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-2">Requirements:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {proposal.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg mb-2">No Pending Activity Proposals</h3>
              <p className="text-gray-600">All activity proposals have been reviewed.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="budget">
          {pendingBudgetProposals.length > 0 ? (
            <div className="space-y-4">
              {pendingBudgetProposals.map((proposal) => (
                <Card key={proposal.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl">{proposal.title}</h3>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{proposal.description}</p>
                      <div className="mb-3">
                        <span className="text-gray-500 text-sm">Total Amount:</span>
                        <p className="text-2xl text-green-600">₱{(proposal.totalAmount || 0).toLocaleString()}</p>
                      </div>
                      <div className="mt-3 text-sm text-gray-500">
                        <User className="w-4 h-4 inline mr-1" />
                        Submitted by {proposal.submittedBy} on {new Date(proposal.submittedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => {
                          setReviewAction('approve');
                          handleReviewBudgetProposal(proposal);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        onClick={() => {
                          setReviewAction('return');
                          handleReviewBudgetProposal(proposal);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Return for Revision
                      </Button>
                    </div>
                  </div>
                  {proposal.items && proposal.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-3">Budget Items:</p>
                      <div className="space-y-2">
                        {proposal.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{item.category || 'N/A'}</span>
                              <p className="text-gray-600 text-xs">{item.description || ''}</p>
                            </div>
                            <span className="text-green-600">₱{(item.amount || 0).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg mb-2">No Pending Budget Proposals</h3>
              <p className="text-gray-600">All budget proposals have been reviewed.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Return for Revision'} Proposal
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve'
                ? 'Review the proposal details and add approval comments.'
                : 'Provide clear feedback on what needs to be revised.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comments">
                {reviewAction === 'approve' ? 'Approval Comments (Optional)' : 'Revision Comments (Required)'}
              </Label>
              <Textarea
                id="comments"
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder={
                  reviewAction === 'approve'
                    ? 'Add any comments or notes about the approval...'
                    : 'Explain what needs to be revised...'
                }
                rows={6}
                required={reviewAction === 'return'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              className={
                reviewAction === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }
              disabled={reviewAction === 'return' && !reviewComments.trim()}
            >
              {reviewAction === 'approve' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Proposal
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Return for Revision
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}