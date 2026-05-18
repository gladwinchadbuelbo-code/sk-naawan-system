import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Plus, Trash2, ArrowLeft, Send } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface BudgetItem {
  category: string;
  customCategory?: string;
  description: string;
  amount: string;
}

export function BudgetProposalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { category: '', description: '', amount: '' },
  ]);

  if (user?.role !== 'treasurer') {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-xl mb-2">Access Denied</h2>
          <p className="text-gray-600">Only SK Treasurer can create budget proposals.</p>
        </Card>
      </div>
    );
  }

  const categories = [
    'Programs and Projects',
    'Office Supplies',
    'Transportation',
    'Food and Venue',
    'Equipment',
    'Documentation',
    'Honorarium',
    'Miscellaneous',
    'Custom',
  ];

  const handleAddItem = () => {
    setBudgetItems([...budgetItems, { category: '', description: '', amount: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = budgetItems.filter((_, i) => i !== index);
    setBudgetItems(newItems.length > 0 ? newItems : [{ category: '', description: '', amount: '' }]);
  };

  const handleItemChange = (index: number, field: keyof BudgetItem, value: string) => {
    const newItems = [...budgetItems];
    newItems[index][field] = value;

    // Clear custom category when switching away from "Custom"
    if (field === 'category' && value !== 'Custom') {
      newItems[index].customCategory = '';
    }

    setBudgetItems(newItems);
  };

  const calculateTotal = () => {
    return budgetItems.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter budget proposal title');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter budget description');
      return;
    }

    // Validate budget items
    const validItems = budgetItems.filter(
      item => {
        const hasCategory = item.category && (item.category !== 'Custom' || item.customCategory?.trim());
        return hasCategory && item.description.trim() && parseFloat(item.amount) > 0;
      }
    );

    if (validItems.length === 0) {
      toast.error('Please add at least one valid budget item');
      return;
    }

    // Create proposal
    const proposals = storage.getBudgetProposals();
    const newProposal = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      totalAmount: calculateTotal(),
      items: validItems.map(item => ({
        category: item.category === 'Custom' ? (item.customCategory || 'Custom') : item.category,
        description: item.description,
        amount: parseFloat(item.amount),
      })),
      attachments: [],
      submittedBy: user?.fullName || 'SK Treasurer',
      submittedDate: new Date().toISOString(),
      status: 'pending' as const,
    };

    storage.setBudgetProposals([...proposals, newProposal]);

    // Add notification for SK Chairperson (President)
    storage.addNotification({
      recipient: 'chairperson',
      title: '🔔 New Budget Proposal Awaiting Approval',
      message: `${user?.fullName} submitted "${formData.title}" for your review and approval. Total budget: ₱${calculateTotal().toLocaleString()}`,
      type: 'proposal',
      link: '/staff/approvals',
    });

    // Log activity
    storage.addActivity({
      type: 'proposal',
      action: 'submitted',
      description: `${user?.fullName} submitted budget proposal: ${formData.title}`,
    });

    toast.success('✅ Budget proposal submitted! The SK Chairperson will be notified for approval.');
    navigate('/staff/budget');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/staff/budget')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Budget
        </Button>
        <h1 className="text-3xl mb-2">Create Budget Proposal</h1>
        <p className="text-gray-600">Submit a new budget proposal for SK President approval</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl mb-4">Proposal Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Proposal Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Q1 2025 Budget Allocation"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the purpose and scope of this budget..."
                    rows={4}
                    required
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Budget Items</h2>
                <Button type="button" variant="outline" onClick={handleAddItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {budgetItems.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Item #{index + 1}</span>
                      {budgetItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`category-${index}`}>Category *</Label>
                        <Select
                          value={item.category}
                          onValueChange={(value) => handleItemChange(index, 'category', value)}
                        >
                          <SelectTrigger id={`category-${index}`}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {item.category === 'Custom' && (
                          <Input
                            className="mt-2"
                            value={item.customCategory || ''}
                            onChange={(e) => handleItemChange(index, 'customCategory', e.target.value)}
                            placeholder="Enter custom category name"
                          />
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`amount-${index}`}>Amount (₱) *</Label>
                        <Input
                          id={`amount-${index}`}
                          type="number"
                          step="0.01"
                          value={item.amount}
                          onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`description-${index}`}>Description *</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Describe this budget item..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl mb-4">Proposal Summary</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Budget Items</p>
                  <p className="text-2xl">{budgetItems.filter(item => item.category && item.amount).length}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl text-green-600">
                    ₱{calculateTotal().toLocaleString('en-PH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Proposal
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/staff/budget')}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}