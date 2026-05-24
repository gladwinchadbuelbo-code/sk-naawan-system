import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, ArrowLeft, Send, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export function ActivityProposalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    activityCost: '',
    venue: '',
    sourceOfFund: '',
    rationale: '',
    objectives: [''],
    budgetaryRequirements: [{ item: '', amount: '' }],
    recommendation: '',
  });

  if (user?.role !== 'secretary') {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-orange-500" />
          <h2 className="text-xl mb-2">Access Denied</h2>
          <p className="text-gray-600">Only SK Secretary can create activity proposals.</p>
        </Card>
      </div>
    );
  }

  const handleAddObjective = () => {
    setFormData({
      ...formData,
      objectives: [...formData.objectives, ''],
    });
  };

  const handleRemoveObjective = (index: number) => {
    const newObjectives = formData.objectives.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      objectives: newObjectives.length > 0 ? newObjectives : [''],
    });
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({
      ...formData,
      objectives: newObjectives,
    });
  };

  const handleAddBudgetItem = () => {
    setFormData({
      ...formData,
      budgetaryRequirements: [...formData.budgetaryRequirements, { item: '', amount: '' }],
    });
  };

  const handleRemoveBudgetItem = (index: number) => {
    const newItems = formData.budgetaryRequirements.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      budgetaryRequirements: newItems.length > 0 ? newItems : [{ item: '', amount: '' }],
    });
  };

  const handleBudgetItemChange = (index: number, field: 'item' | 'amount', value: string) => {
    const newItems = [...formData.budgetaryRequirements];
    newItems[index][field] = value;
    setFormData({
      ...formData,
      budgetaryRequirements: newItems,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter project title');
      return;
    }
    if (!formData.duration.trim()) {
      toast.error('Please enter project duration');
      return;
    }
    if (!formData.venue.trim()) {
      toast.error('Please enter venue');
      return;
    }
    if (!formData.activityCost || parseFloat(formData.activityCost) <= 0) {
      toast.error('Please enter valid activity cost');
      return;
    }
    if (!formData.sourceOfFund.trim()) {
      toast.error('Please enter source of fund');
      return;
    }
    if (!formData.rationale.trim()) {
      toast.error('Please enter rationale');
      return;
    }
    const validObjectives = formData.objectives.filter(o => o.trim());
    if (validObjectives.length === 0) {
      toast.error('Please add at least one objective');
      return;
    }
    const validBudgetItems = formData.budgetaryRequirements.filter(
      item => item.item.trim() && parseFloat(item.amount) > 0
    );
    if (validBudgetItems.length === 0) {
      toast.error('Please add at least one valid budgetary requirement');
      return;
    }

    // Create proposal
    const proposals = storage.getActivityProposals();
    const newProposal = {
      id: Date.now(),
      title: formData.title,
      duration: formData.duration,
      activityCost: parseFloat(formData.activityCost),
      venue: formData.venue,
      sourceOfFund: formData.sourceOfFund,
      rationale: formData.rationale,
      objectives: validObjectives,
      budgetaryRequirements: validBudgetItems.map(item => ({
        item: item.item,
        amount: parseFloat(item.amount),
      })),
      recommendation: formData.recommendation,
      attachments: [],
      submittedBy: user?.fullName || 'SK Secretary',
      submittedDate: new Date().toISOString(),
      status: 'pending' as const,
    };

    storage.setActivityProposals([...proposals, newProposal]);

    // Add notification for SK Chairperson (President)
    storage.addNotification({
      recipient: 'chairperson',
      title: '🔔 New Activity Proposal Awaiting Approval',
      message: `${user?.fullName} submitted "${formData.title}" for your review and approval. Duration: ${formData.duration}`,
      type: 'proposal',
      link: '/staff/approvals',
    });

    // Log activity
    storage.addActivity({
      type: 'proposal',
      action: 'submitted',
      description: `${user?.fullName} submitted activity proposal: ${formData.title}`,
    });

    toast.success('✅ Activity proposal submitted! The SK Chairperson will be notified for approval.');
    navigate('/staff/events');
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
        <h1 className="text-3xl mb-2">Project Proposal</h1>
        <p className="text-gray-600">Submit a new project proposal for SK Chairperson approval</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 max-w-4xl">
          <div className="space-y-8">
            {/* I. PROJECT DETAILS */}
            <div>
              <h3 className="text-lg mb-4">I. PROJECT DETAILS</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">PROJECT TITLE *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Youth Leadership Summit 2025"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="duration">PROJECT DURATION *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., January 15-16, 2025"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="activityCost">ACTIVITY COST (₱) *</Label>
                    <Input
                      id="activityCost"
                      type="number"
                      step="0.01"
                      value={formData.activityCost}
                      onChange={(e) => setFormData({ ...formData, activityCost: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="venue">VENUE *</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="e.g., Barangay Hall"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sourceOfFund">SOURCE OF FUND *</Label>
                  <Input
                    id="sourceOfFund"
                    value={formData.sourceOfFund}
                    onChange={(e) => setFormData({ ...formData, sourceOfFund: e.target.value })}
                    placeholder="e.g., SK Fund, LGU Budget"
                    required
                  />
                </div>
              </div>
            </div>

            {/* II. RATIONALE */}
            <div>
              <h3 className="text-lg mb-4">II. RATIONALE</h3>
              <Textarea
                id="rationale"
                value={formData.rationale}
                onChange={(e) => setFormData({ ...formData, rationale: e.target.value })}
                placeholder="Explain the purpose and justification for this project..."
                rows={6}
                required
              />
            </div>

            {/* III. OBJECTIVES */}
            <div>
              <h3 className="text-lg mb-4">III. OBJECTIVES</h3>
              <div className="space-y-3">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder={`Objective ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.objectives.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveObjective(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddObjective}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Objective
                </Button>
              </div>
            </div>

            {/* IV. BUDGETARY REQUIREMENTS */}
            <div>
              <h3 className="text-lg mb-4">IV. BUDGETARY REQUIREMENTS</h3>
              <div className="space-y-3">
                {formData.budgetaryRequirements.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item.item}
                      onChange={(e) => handleBudgetItemChange(index, 'item', e.target.value)}
                      placeholder="Item description"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={(e) => handleBudgetItemChange(index, 'amount', e.target.value)}
                      placeholder="Amount (₱)"
                      className="w-32"
                    />
                    {formData.budgetaryRequirements.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBudgetItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddBudgetItem}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Budget Item
                </Button>
              </div>
            </div>

            {/* V. RECOMMENDATION */}
            <div>
              <h3 className="text-lg mb-4">V. RECOMMENDATION</h3>
              <Textarea
                id="recommendation"
                value={formData.recommendation}
                onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                placeholder="Optional: Add any recommendations or additional notes..."
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/staff/events')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                <Send className="w-4 h-4 mr-2" />
                Submit Proposal
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}