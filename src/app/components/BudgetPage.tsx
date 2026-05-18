import { useState } from 'react';
import { Layout } from './Layout';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface BudgetPageProps {
  onNavigate: (page: string) => void;
}

interface Fund {
  id: number;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  remarks: string;
}

export function BudgetPage({ onNavigate }: BudgetPageProps) {
  const [funds, setFunds] = useState<Fund[]>([
    { id: 1, amount: 50000, date: '2025-01-15', category: 'Government Allocation', type: 'income', remarks: 'Q1 Budget' },
    { id: 2, amount: 15000, date: '2025-02-10', category: 'Youth Programs', type: 'expense', remarks: 'Sports Event' },
    { id: 3, amount: 8000, date: '2025-02-20', category: 'Scholarships', type: 'expense', remarks: 'Monthly Allowance' },
    { id: 4, amount: 5000, date: '2025-03-05', category: 'Events', type: 'expense', remarks: 'Community Cleanup' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [formData, setFormData] = useState({ amount: '', date: '', category: '', type: 'income' as 'income' | 'expense', remarks: '' });

  const totalIncome = funds.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = funds.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
  const remainingBudget = totalIncome - totalExpenses;

  const handleAddFund = () => {
    const newFund: Fund = {
      id: funds.length + 1,
      amount: Number(formData.amount),
      date: formData.date,
      category: formData.category,
      type: formData.type,
      remarks: formData.remarks,
    };
    setFunds([...funds, newFund]);
    setShowAddModal(false);
    setFormData({ amount: '', date: '', category: '', type: 'income', remarks: '' });
  };

  const handleEditFund = () => {
    if (selectedFund) {
      setFunds(funds.map(f => f.id === selectedFund.id ? { ...selectedFund, ...formData, amount: Number(formData.amount) } : f));
      setShowEditModal(false);
      setSelectedFund(null);
      setFormData({ amount: '', date: '', category: '', type: 'income', remarks: '' });
    }
  };

  const handleDeleteFund = () => {
    if (selectedFund) {
      setFunds(funds.filter(f => f.id !== selectedFund.id));
      setShowDeleteModal(false);
      setSelectedFund(null);
    }
  };

  const openEditModal = (fund: Fund) => {
    setSelectedFund(fund);
    setFormData({ amount: fund.amount.toString(), date: fund.date, category: fund.category, type: fund.type, remarks: fund.remarks });
    setShowEditModal(true);
  };

  const openDeleteModal = (fund: Fund) => {
    setSelectedFund(fund);
    setShowDeleteModal(true);
  };

  return (
    <Layout currentPage="budget" onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[#1e3a5f]">Budget Management</h2>
          <div className="flex gap-3">
            <Button onClick={() => setShowExpenseModal(true)} className="bg-[#dc2626] hover:bg-[#b91c1c]">
              <TrendingDown className="w-4 h-4 mr-2" />
              Record Expense
            </Button>
            <Button onClick={() => setShowAddModal(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Plus className="w-4 h-4 mr-2" />
              Add Fund
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#6b7280] mb-1">Total Income</div>
                <div className="text-[#1e3a5f]">₱{totalIncome.toLocaleString()}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#6b7280] mb-1">Total Expenses</div>
                <div className="text-[#1e3a5f]">₱{totalExpenses.toLocaleString()}</div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#6b7280] mb-1">Remaining Budget</div>
                <div className="text-[#1e3a5f]">₱{remainingBudget.toLocaleString()}</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Funds Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-[#1e3a5f]">SK Funds History</h3>
            <Button onClick={() => onNavigate('reports')} variant="outline" className="text-[#2563eb]">
              Generate Financial Reports
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Date</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Type</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Category</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Amount</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Remarks</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {funds.map((fund) => (
                  <tr key={fund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-[#4a5c6e]">{fund.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        fund.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {fund.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#4a5c6e]">{fund.category}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">₱{fund.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">{fund.remarks}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(fund)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(fund)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Fund Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Fund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Enter remarks"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddFund} className="bg-[#2563eb] hover:bg-[#1d4ed8]">Add Fund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Fund Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Fund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-type">Type</Label>
              <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-remarks">Remarks</Label>
              <Input
                id="edit-remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleEditFund} className="bg-[#2563eb] hover:bg-[#1d4ed8]">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Expense Modal */}
      <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="expense-amount">Amount</Label>
              <Input
                id="expense-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value, type: 'expense' })}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label htmlFor="expense-date">Date</Label>
              <Input
                id="expense-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="expense-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Youth Programs">Youth Programs</SelectItem>
                  <SelectItem value="Scholarships">Scholarships</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expense-remarks">Remarks</Label>
              <Input
                id="expense-remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Enter remarks"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
            <Button onClick={handleAddFund} className="bg-[#dc2626] hover:bg-[#b91c1c]">Record Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-[#4a5c6e]">Are you sure you want to delete this fund entry? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button onClick={handleDeleteFund} className="bg-[#dc2626] hover:bg-[#b91c1c]">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
