import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, Wallet, FileText, Shield, Upload, Download, Eye, X, Loader2, Archive } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { PermissionInfo } from '../components/PermissionInfo';

interface FundEntry {
  id: number;
  date: string;
  category: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  orNumber?: string;
  supplier?: string;
  receiptId?: number;
  // Receipt attachment
  receipt?: {
    fileName: string;
    fileData: string; // base64
    uploadedAt: string;
    uploadedBy: string;
  };
}

interface Receipt {
  id: number;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  category: string;
  orNumber: string;
  amount: number;
  supplier: string;
  description: string;
  linkedToTransaction?: number;
}

export function BudgetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { canEdit, user } = useAuth(); // Add user to get current user info
  const [showAddFundModal, setShowAddFundModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showViewReceiptModal, setShowViewReceiptModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<FundEntry | null>(null);
  const [entryToArchive, setEntryToArchive] = useState<FundEntry | null>(null);
  const [selectedReceiptFile, setSelectedReceiptFile] = useState<File | null>(null);
  const canEditBudget = canEdit('budget');

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load funds from localStorage
  const [funds, setFunds] = useState<FundEntry[]>([]);

  useEffect(() => {
    loadFunds();
  }, []);

  // Auto-open expense modal if navigated from Dashboard
  useEffect(() => {
    if (location.state?.openExpenseModal && canEditBudget) {
      setShowAddExpenseModal(true);
      // Clear the state to prevent reopening on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, canEditBudget, navigate, location.pathname]);

  const loadFunds = () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const storedFunds = storage.getFunds();
      if (storedFunds) {
        setFunds(storedFunds);
      } else {
        setFunds([]);
      }
    } catch (error: any) {
      setLoadError(error.message || 'Failed to load budget data');
      toast.error('Failed to load budget data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalIncome = funds.filter((f) => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = funds.filter((f) => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
  const remainingBudget = totalIncome - totalExpenses;

  const validateFundEntry = (formData: FormData, type: 'income' | 'expense'): boolean => {
    const errors: string[] = [];
    const description = formData.get('description') as string;
    const amount = Number(formData.get('amount'));
    const category = formData.get('category') as string;

    if (!description || description.trim().length < 3) {
      errors.push('Description must be at least 3 characters');
    }
    if (!amount || amount <= 0) {
      errors.push('Amount must be greater than 0');
    }
    if (!category) {
      errors.push('Category is required');
    }

    if (type === 'expense') {
      const orNumber = formData.get('orNumber') as string;
      const supplier = formData.get('supplier') as string;
      
      if (!orNumber || orNumber.trim().length < 3) {
        errors.push('OR Number must be at least 3 characters');
      }
      if (!supplier || supplier.trim().length < 3) {
        errors.push('Supplier must be at least 3 characters');
      }

      // Check if adding expense exceeds budget
      if (amount > remainingBudget) {
        errors.push(`Insufficient funds. Remaining budget: ₱${remainingBudget.toLocaleString()}`);
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAddFund = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Permission check
    if (!canEditBudget) {
      toast.error('You do not have permission to add funds');
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    
    // Validate
    if (!validateFundEntry(formData, 'income')) {
      toast.error('Please fix validation errors');
      return;
    }

    try {
      setIsSaving(true);
      const newFund: FundEntry = {
        id: Date.now(),
        date: formData.get('date') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        type: 'income',
        amount: Number(formData.get('amount')),
      };
      
      const updatedFunds = [...funds, newFund];
      await storage.setFunds(updatedFunds);
      setFunds(updatedFunds);
      
      setShowAddFundModal(false);
      setValidationErrors([]);
      toast.success('Fund added successfully');
      
      storage.addActivity({
        type: 'budget',
        action: 'added',
        description: `Added income: ${newFund.description} (₱${newFund.amount.toLocaleString()})`,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add fund. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Permission check
    if (!canEditBudget) {
      toast.error('You do not have permission to record expenses');
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    
    // Validate
    if (!validateFundEntry(formData, 'expense')) {
      toast.error('Please fix validation errors');
      return;
    }

    try {
      setIsSaving(true);
      
      // Process receipt file if uploaded
      let receiptData = undefined;
      if (selectedReceiptFile) {
        const fileData = await fileToBase64(selectedReceiptFile);
        receiptData = {
          fileName: selectedReceiptFile.name,
          fileData: fileData,
          uploadedAt: new Date().toISOString(),
          uploadedBy: user?.fullName || 'Unknown User',
        };
      }
      
      const newExpense: FundEntry = {
        id: Date.now(),
        date: formData.get('date') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        type: 'expense',
        amount: Number(formData.get('amount')),
        orNumber: formData.get('orNumber') as string,
        supplier: formData.get('supplier') as string,
        receipt: receiptData,
      };
      
      const updatedFunds = [...funds, newExpense];
      await storage.setFunds(updatedFunds);
      setFunds(updatedFunds);
      
      setShowAddExpenseModal(false);
      setValidationErrors([]);
      setSelectedReceiptFile(null);
      
      const receiptMsg = receiptData ? ' with receipt' : '';
      toast.success(`Expense recorded successfully${receiptMsg}`);
      
      storage.addActivity({
        type: 'budget',
        action: 'added',
        description: `Recorded expense: ${newExpense.description} (₱${newExpense.amount.toLocaleString()})${receiptMsg}`,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to record expense. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (entry: FundEntry) => {
    setSelectedEntry(entry);
    setValidationErrors([]);
    setShowEditModal(true);
  };

  const handleUpdateEntry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEntry) return;

    const formData = new FormData(e.currentTarget);
    
    // Basic validation
    const description = formData.get('description') as string;
    const amount = Number(formData.get('amount'));
    
    if (!description || description.trim().length < 3) {
      toast.error('Description must be at least 3 characters');
      return;
    }
    if (!amount || amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    try {
      setIsSaving(true);
      const updatedFunds = funds.map((f) =>
        f.id === selectedEntry.id
          ? {
              ...f,
              date: formData.get('date') as string,
              category: formData.get('category') as string,
              description: formData.get('description') as string,
              amount: Number(formData.get('amount')),
              orNumber: formData.get('orNumber') as string || undefined,
              supplier: formData.get('supplier') as string || undefined,
            }
          : f
      );
      
      await storage.setFunds(updatedFunds);
      setFunds(updatedFunds);
      
      setShowEditModal(false);
      setSelectedEntry(null);
      setValidationErrors([]);
      toast.success('Entry updated successfully');
      
      storage.addActivity({
        type: 'budget',
        action: 'updated',
        description: `Updated ${selectedEntry.type}: ${description}`,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (entry: FundEntry) => {
    setSelectedEntry(entry);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEntry) return;

    try {
      setIsDeleting(true);
      const updatedFunds = funds.filter((f) => f.id !== selectedEntry.id);
      await storage.setFunds(updatedFunds);
      setFunds(updatedFunds);
      
      setShowDeleteModal(false);
      setSelectedEntry(null);
      toast.success('Entry deleted successfully');
      
      storage.addActivity({
        type: 'budget',
        action: 'deleted',
        description: `Deleted ${selectedEntry.type}: ${selectedEntry.description}`,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete entry. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Archive fund entry handler - show confirmation first
  const handleArchiveFundEntry = (entry: FundEntry) => {
    if (user?.role !== 'treasurer') {
      toast.error('Only Treasurer can archive fund entries');
      return;
    }

    setEntryToArchive(entry);
    setShowArchiveModal(true);
  };

  // Confirm archive action
  const confirmArchiveFundEntry = () => {
    if (!entryToArchive) return;

    try {
      storage.archiveFundEntry(entryToArchive, user?.fullName || 'Unknown User');
      setFunds(funds.filter(f => f.id !== entryToArchive.id));
      toast.success(`Fund entry "${entryToArchive.description}" has been archived`);

      storage.addActivity({
        type: 'budget',
        action: 'archived',
        description: `Archived ${entryToArchive.type}: ${entryToArchive.description}`,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to archive fund entry');
    } finally {
      setShowArchiveModal(false);
      setEntryToArchive(null);
    }
  };

  // File to base64 converter
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle receipt file selection
  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, JPG, or PNG file');
        e.target.value = '';
        return;
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      
      setSelectedReceiptFile(file);
    }
  };

  // View receipt handler
  const handleViewReceipt = (entry: FundEntry) => {
    setSelectedEntry(entry);
    setShowViewReceiptModal(true);
  };

  // Download receipt handler
  const handleDownloadReceipt = (entry: FundEntry) => {
    if (!entry.receipt) return;
    
    const link = document.createElement('a');
    link.href = entry.receipt.fileData;
    link.download = entry.receipt.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Receipt downloaded successfully');
  };

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading budget data...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <X className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl mb-2">Failed to Load Budget Data</h2>
          <p className="text-gray-600 mb-6">{loadError}</p>
          <Button onClick={loadFunds}>
            <Loader2 className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 ph-pattern-bg min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl">Budget Management</h1>
          <p className="text-gray-600 mt-2">Track and manage SK funds and expenses</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            {canEditBudget && (
              <Button onClick={() => setShowAddFundModal(true)} className="bg-[#059669] hover:bg-[#047857] rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Fund
              </Button>
            )}
            {user?.role === 'treasurer' && (
              <Button onClick={() => navigate('/staff/my-budget-proposals')} variant="outline" className="rounded-xl">
                <FileText className="w-4 h-4 mr-2" />
                My Proposals
              </Button>
            )}
            <Button onClick={() => navigate('/staff/reports?tab=budget')} variant="outline" className="rounded-xl">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
          <PermissionInfo resourceType="budget" compact />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#10B981] to-[#059669] text-white border-0 shadow-lg rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Total Funds</p>
              <h3 className="text-3xl font-bold mt-2">₱{totalIncome.toLocaleString()}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white border-0 shadow-lg rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Expenses</p>
              <h3 className="text-3xl font-bold mt-2">₱{totalExpenses.toLocaleString()}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#059669] to-[#047857] text-white border-0 shadow-lg rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Remaining Budget</p>
              <h3 className="text-3xl font-bold mt-2">₱{remainingBudget.toLocaleString()}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Funds Table */}
      <Card className="p-6 rounded-xl">
        <h3 className="text-lg mb-4 text-[#111827] font-semibold">SK Funds</h3>
        {funds.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#111827]">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#111827]">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#111827]">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#111827]">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#111827]">OR Number</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#111827]">Supplier</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[#111827]">Receipt</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#111827]">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#111827]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((fund, index) => (
                  <tr key={fund.id} className={`border-b border-gray-100 hover:bg-[#F9FAFB] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="py-3 px-4">{new Date(fund.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{fund.category}</td>
                    <td className="py-3 px-4">{fund.description}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          fund.type === 'income'
                            ? 'bg-emerald-100 text-[#10B981]'
                            : 'bg-red-100 text-[#EF4444]'
                        }`}
                      >
                        {fund.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{fund.orNumber || '-'}</td>
                    <td className="py-3 px-4">{fund.supplier || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      {fund.receipt ? (
                        <div className="flex justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewReceipt(fund)}
                            title="View receipt"
                          >
                            <Eye className="w-4 h-4 text-[#059669]" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadReceipt(fund)}
                            title="Download receipt"
                          >
                            <Download className="w-4 h-4 text-[#10B981]" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-semibold ${
                          fund.type === 'income' ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}
                      >
                        {fund.type === 'income' ? '+' : '-'}₱{fund.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        {canEditBudget ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(fund)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(fund)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleArchiveFundEntry(fund)}
                            >
                              <Archive className="w-4 h-4 text-gray-600" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">View Only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No budget records yet</p>
            <p className="text-sm mb-4">Add income or expenses to get started</p>
            {canEditBudget && (
              <Button onClick={() => setShowAddFundModal(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Fund
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Add Fund Modal */}
      <Dialog open={showAddFundModal} onOpenChange={setShowAddFundModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Fund</DialogTitle>
            <DialogDescription>Add a new income or fund source to the budget.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFund}>
            <div className="space-y-4">
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">Please fix the following errors:</p>
                  <ul className="list-disc list-inside text-sm text-red-700 mt-1">
                    {validationErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input type="date" id="date" name="date" required max={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Government Allocation">Government Allocation</SelectItem>
                    <SelectItem value="Donations">Donations</SelectItem>
                    <SelectItem value="Other Income">Other Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" name="description" required minLength={3} placeholder="Enter fund description..." />
              </div>
              <div>
                <Label htmlFor="amount">Amount (₱) *</Label>
                <Input type="number" id="amount" name="amount" min="0.01" step="0.01" required placeholder="0.00" />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => {
                setShowAddFundModal(false);
                setValidationErrors([]);
              }} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Fund'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Expense Modal */}
      <Dialog open={showAddExpenseModal} onOpenChange={setShowAddExpenseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Expense</DialogTitle>
            <DialogDescription>Record a new expense or budget allocation.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddExpense}>
            <div className="space-y-4">
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">Please fix the following errors:</p>
                  <ul className="list-disc list-inside text-sm text-red-700 mt-1">
                    {validationErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <Label htmlFor="exp-date">Date *</Label>
                <Input type="date" id="exp-date" name="date" required max={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <Label htmlFor="exp-category">Category *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Programs">Programs</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Other Expenses">Other Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="exp-description">Description *</Label>
                <Textarea id="exp-description" name="description" required minLength={3} placeholder="Enter expense description..." />
              </div>
              <div>
                <Label htmlFor="exp-orNumber">OR Number *</Label>
                <Input type="text" id="exp-orNumber" name="orNumber" required minLength={3} placeholder="Official Receipt Number" />
              </div>
              <div>
                <Label htmlFor="exp-supplier">Supplier *</Label>
                <Input type="text" id="exp-supplier" name="supplier" required minLength={3} placeholder="Supplier name" />
              </div>
              <div>
                <Label htmlFor="exp-amount">Amount (₱) *</Label>
                <Input type="number" id="exp-amount" name="amount" min="0.01" step="0.01" required placeholder="0.00" />
                <p className="text-xs text-gray-500 mt-1">Available budget: ₱{remainingBudget.toLocaleString()}</p>
              </div>
              <div>
                <Label htmlFor="exp-receipt">Receipt (Optional)</Label>
                <Input type="file" id="exp-receipt" name="receipt" onChange={handleReceiptFileChange} accept="image/jpeg, image/jpg, image/png, application/pdf" />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => {
                setShowAddExpenseModal(false);
                setValidationErrors([]);
                setSelectedReceiptFile(null);
              }} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Recording...
                  </>
                ) : (
                  'Record Expense'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
            <DialogDescription>Update the details of this budget entry.</DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <form onSubmit={handleUpdateEntry}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-date">Date *</Label>
                  <Input
                    type="date"
                    id="edit-date"
                    name="date"
                    defaultValue={selectedEntry.date}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category *</Label>
                  <Input
                    type="text"
                    id="edit-category"
                    name="category"
                    defaultValue={selectedEntry.category}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={selectedEntry.description}
                    required
                    minLength={3}
                  />
                </div>
                {selectedEntry.type === 'expense' && (
                  <>
                    <div>
                      <Label htmlFor="edit-orNumber">OR Number</Label>
                      <Input
                        type="text"
                        id="edit-orNumber"
                        name="orNumber"
                        defaultValue={selectedEntry.orNumber}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-supplier">Supplier</Label>
                      <Input
                        type="text"
                        id="edit-supplier"
                        name="supplier"
                        defaultValue={selectedEntry.supplier}
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="edit-amount">Amount (₱) *</Label>
                  <Input
                    type="number"
                    id="edit-amount"
                    name="amount"
                    defaultValue={selectedEntry.amount}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => {
                  setShowEditModal(false);
                  setValidationErrors([]);
                }} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Entry'
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
            <DialogDescription>Are you sure you want to delete this entry? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p><strong>Description:</strong> {selectedEntry.description}</p>
              <p><strong>Type:</strong> {selectedEntry.type === 'income' ? 'Income' : 'Expense'}</p>
              <p><strong>Amount:</strong> ₱{selectedEntry.amount.toLocaleString()}</p>
              {selectedEntry.orNumber && <p><strong>OR Number:</strong> {selectedEntry.orNumber}</p>}
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Receipt Modal */}
      <Dialog open={showViewReceiptModal} onOpenChange={setShowViewReceiptModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>View Receipt</DialogTitle>
            <DialogDescription>Receipt for: {selectedEntry?.description}</DialogDescription>
          </DialogHeader>
          {selectedEntry?.receipt && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">File Name</p>
                  <p className="font-medium">{selectedEntry.receipt.fileName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Uploaded By</p>
                  <p className="font-medium">{selectedEntry.receipt.uploadedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upload Date</p>
                  <p className="font-medium">{new Date(selectedEntry.receipt.uploadedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">₱{selectedEntry.amount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden bg-gray-100 max-h-[500px] overflow-y-auto">
                {selectedEntry.receipt.fileName.toLowerCase().endsWith('.pdf') ? (
                  <embed
                    src={selectedEntry.receipt.fileData}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                    className="w-full"
                  />
                ) : (
                  <img
                    src={selectedEntry.receipt.fileData}
                    alt="Receipt"
                    className="w-full h-auto object-contain"
                  />
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewReceiptModal(false)}>
              Close
            </Button>
            <Button onClick={() => selectedEntry && handleDownloadReceipt(selectedEntry)}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Modal */}
      <Dialog open={showArchiveModal} onOpenChange={setShowArchiveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Fund Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this fund entry?
            </DialogDescription>
          </DialogHeader>
          {entryToArchive && (
            <div className="py-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Description:</strong> {entryToArchive.description}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Type:</strong> {entryToArchive.type === 'income' ? 'Income' : 'Expense'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Amount:</strong> ₱{entryToArchive.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  This fund entry will be moved to the Archives section. You can restore it later if needed.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveModal(false)}>
              Cancel
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={confirmArchiveFundEntry}>
              <Archive className="w-4 h-4 mr-2" />
              Archive Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}