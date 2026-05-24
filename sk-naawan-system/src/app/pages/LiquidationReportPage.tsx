import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Printer, Upload, Lock, Edit, Plus, Trash2, Save, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
import type { LiquidationReport, ExpenseItem } from '../types/reports';

export function LiquidationReportPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { canEdit, user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(!eventId); // If no eventId, we're creating new
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const canEditReport = canEdit('liquidation');

  // Initialize report data
  const [report, setReport] = useState<LiquidationReport>({
    id: 0,
    eventId: eventId ? parseInt(eventId) : undefined,
    eventTitle: '',
    eventDate: '',
    venue: '',
    time: '',
    officers: {
      chairperson: '',
      treasurer: user?.fullName || '',
      secretary: '',
    },
    approvedBudget: 0,
    actualExpenses: 0,
    variance: 0,
    expenses: [],
    receipts: [],
    attendance: {
      total: 0,
      present: 0,
      percentage: 0,
    },
    preparedBy: user?.fullName || '',
    position: 'SK Treasurer',
    dateCreated: new Date().toISOString(),
    status: 'Draft',
    createdBy: user?.username || '',
  });

  // Load existing report if eventId is provided
  useEffect(() => {
    if (eventId) {
      const reports = storage.getReports() || [];
      const existingReport = reports.find((r: LiquidationReport) => r.eventId === parseInt(eventId) && r.id);
      if (existingReport) {
        setReport(existingReport);
        setIsEditing(false);
      } else {
        // Load event data if available
        const events = storage.getEvents() || [];
        const event = events.find((e: any) => e.id === parseInt(eventId));
        if (event) {
          setReport(prev => ({
            ...prev,
            eventTitle: event.title,
            eventDate: event.date,
            venue: event.venue,
            time: event.time,
            approvedBudget: event.budget || 0,
          }));
        }
      }
    }
  }, [eventId, user]);

  // Calculate totals
  useEffect(() => {
    const totalExpenses = report.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const variance = report.approvedBudget - totalExpenses;
    setReport(prev => ({
      ...prev,
      actualExpenses: totalExpenses,
      variance: variance,
    }));
  }, [report.expenses, report.approvedBudget]);

  const handleSaveReport = () => {
    if (!canEditReport) {
      toast.error('You do not have permission to save liquidation reports');
      return;
    }

    if (!report.eventTitle || !report.eventDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const reports = storage.getReports() || [];
    let updatedReports;

    if (report.id) {
      // Update existing
      updatedReports = reports.map((r: LiquidationReport) => 
        r.id === report.id ? { ...report } : r
      );
      toast.success('Liquidation report updated successfully');
    } else {
      // Create new
      const newReport = {
        ...report,
        id: Date.now(),
        dateCreated: new Date().toISOString(),
      };
      updatedReports = [...reports, newReport];
      setReport(newReport);
      toast.success('Liquidation report created successfully');
    }

    storage.setReports(updatedReports);
    storage.addActivity({
      type: 'report',
      action: report.id ? 'updated' : 'created',
      description: `${report.id ? 'Updated' : 'Created'} liquidation report: ${report.eventTitle}`,
    });
    setIsEditing(false);
  };

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const receiptFile = formData.get('receipt') as File;
    
    const newExpense: ExpenseItem = {
      id: editingExpense?.id || Date.now(),
      date: formData.get('date') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      orNumber: formData.get('orNumber') as string,
      amount: Number(formData.get('amount')),
      supplier: formData.get('supplier') as string,
      hasReceipt: receiptFile && receiptFile.size > 0,
      receiptFileName: receiptFile && receiptFile.size > 0 ? receiptFile.name : undefined,
      receiptUrl: receiptFile && receiptFile.size > 0 ? URL.createObjectURL(receiptFile) : undefined,
    };

    if (editingExpense) {
      setReport(prev => ({
        ...prev,
        expenses: prev.expenses.map(exp => 
          exp.id === editingExpense.id ? newExpense : exp
        ),
      }));
      toast.success('Expense updated');
    } else {
      setReport(prev => ({
        ...prev,
        expenses: [...prev.expenses, newExpense],
      }));
      toast.success('Expense added');
    }

    setShowExpenseModal(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expenseId: number) => {
    setReport(prev => ({
      ...prev,
      expenses: prev.expenses.filter(exp => exp.id !== expenseId),
    }));
    toast.success('Expense deleted');
  };

  const handleGeneratePDF = () => {
    toast.success('PDF generation coming soon!');
  };

  if (!canEditReport && !report.id) {
    return (
      <div className="p-8">
        <Card className="p-12 text-center">
          <Lock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            Only the SK Treasurer can create liquidation reports.
          </p>
          <Button onClick={() => navigate('/staff/reports?tab=events')}>
            Back to Reports
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/staff/reports?tab=events')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl">Liquidation Report</h1>
            {canEditReport ? (
              <Badge className="bg-green-600 hover:bg-green-700">
                <Edit className="w-3 h-3 mr-1" />
                Can Edit
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Lock className="w-3 h-3 mr-1" />
                View Only
              </Badge>
            )}
            <Badge variant={report.status === 'Approved' ? 'default' : 'secondary'}>
              {report.status}
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">Financial liquidation report with receipt tracking</p>
        </div>
        <div className="flex gap-3">
          {canEditReport && (
            <>
              {isEditing ? (
                <Button onClick={handleSaveReport} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Report
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Report
                </Button>
              )}
            </>
          )}
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          {report.id && (
            <>
              <Button variant="outline" onClick={handleGeneratePDF}>
                <Download className="w-4 h-4 mr-2" />
                Generate PDF
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Editor Form */}
      {isEditing && (
        <Card className="p-6">
          <h3 className="text-lg mb-4">Event Information</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Event Title *</Label>
              <Input
                value={report.eventTitle}
                onChange={(e) => setReport(prev => ({ ...prev, eventTitle: e.target.value }))}
                placeholder="Enter event title"
                disabled={!canEditReport}
              />
            </div>
            <div>
              <Label>Event Date *</Label>
              <Input
                type="date"
                value={report.eventDate}
                onChange={(e) => setReport(prev => ({ ...prev, eventDate: e.target.value }))}
                disabled={!canEditReport}
              />
            </div>
            <div>
              <Label>Venue</Label>
              <Input
                value={report.venue}
                onChange={(e) => setReport(prev => ({ ...prev, venue: e.target.value }))}
                placeholder="Enter venue"
                disabled={!canEditReport}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                value={report.time}
                onChange={(e) => setReport(prev => ({ ...prev, time: e.target.value }))}
                placeholder="e.g., 9:00 AM - 5:00 PM"
                disabled={!canEditReport}
              />
            </div>
          </div>

          <h3 className="text-lg mb-4 mt-6">Responsible Officers</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Chairperson</Label>
              <Input
                value={report.officers.chairperson}
                onChange={(e) => setReport(prev => ({ 
                  ...prev, 
                  officers: { ...prev.officers, chairperson: e.target.value }
                }))}
                placeholder="Chairperson name"
                disabled={!canEditReport}
              />
            </div>
            <div>
              <Label>Treasurer</Label>
              <Input
                value={report.officers.treasurer}
                onChange={(e) => setReport(prev => ({ 
                  ...prev, 
                  officers: { ...prev.officers, treasurer: e.target.value }
                }))}
                placeholder="Treasurer name"
                disabled={!canEditReport}
              />
            </div>
            <div>
              <Label>Secretary</Label>
              <Input
                value={report.officers.secretary}
                onChange={(e) => setReport(prev => ({ 
                  ...prev, 
                  officers: { ...prev.officers, secretary: e.target.value }
                }))}
                placeholder="Secretary name"
                disabled={!canEditReport}
              />
            </div>
          </div>

          <h3 className="text-lg mb-4 mt-6">Budget Summary</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Approved Budget</Label>
              <Input
                type="number"
                value={report.approvedBudget}
                onChange={(e) => setReport(prev => ({ ...prev, approvedBudget: Number(e.target.value) }))}
                placeholder="0"
                disabled={!canEditReport}
              />
            </div>
            <div>
              <Label>Actual Expenses</Label>
              <Input
                type="number"
                value={report.actualExpenses}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>Variance</Label>
              <Input
                type="number"
                value={report.variance}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* Receipt Compliance Status */}
          {report.expenses.length > 0 && (
            <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Receipt Compliance</h4>
                    <p className="text-sm text-gray-600">
                      {report.expenses.filter(e => e.hasReceipt).length} of {report.expenses.length} expenses have receipts uploaded
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.expenses.filter(e => e.hasReceipt).length === report.expenses.length ? (
                    <Badge className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      100% Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {Math.round((report.expenses.filter(e => e.hasReceipt).length / report.expenses.length) * 100)}% Complete
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          )}

          <h3 className="text-lg mb-4 mt-6">Expenses</h3>
          {canEditReport && (
            <Button 
              onClick={() => {
                setEditingExpense(null);
                setShowExpenseModal(true);
              }} 
              className="mb-4"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          )}
          
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm">Date</th>
                  <th className="text-left py-3 px-4 text-sm">Category</th>
                  <th className="text-left py-3 px-4 text-sm">Description</th>
                  <th className="text-left py-3 px-4 text-sm">OR Number</th>
                  <th className="text-left py-3 px-4 text-sm">Supplier</th>
                  <th className="text-right py-3 px-4 text-sm">Amount</th>
                  <th className="text-center py-3 px-4 text-sm">Receipt</th>
                  {canEditReport && <th className="text-right py-3 px-4 text-sm">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {report.expenses.length === 0 ? (
                  <tr>
                    <td colSpan={canEditReport ? 8 : 7} className="py-8 text-center text-gray-500">
                      No expenses added yet
                    </td>
                  </tr>
                ) : (
                  report.expenses.map((expense) => (
                    <tr key={expense.id} className="border-t">
                      <td className="py-3 px-4 text-sm">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-sm">{expense.category}</td>
                      <td className="py-3 px-4 text-sm">{expense.description}</td>
                      <td className="py-3 px-4 text-sm">{expense.orNumber}</td>
                      <td className="py-3 px-4 text-sm">{expense.supplier}</td>
                      <td className="py-3 px-4 text-sm text-right">₱{expense.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-center">
                        {expense.hasReceipt ? (
                          <div className="flex items-center justify-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600">Uploaded</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            <span className="text-xs text-amber-600">Missing</span>
                          </div>
                        )}
                      </td>
                      {canEditReport && (
                        <td className="py-3 px-4 text-sm">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingExpense(expense);
                                setShowExpenseModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
              {report.expenses.length > 0 && (
                <tfoot className="bg-gray-50 border-t-2">
                  <tr>
                    <td colSpan={5} className="py-3 px-4 text-right">
                      <strong>Total Expenses:</strong>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <strong>₱{report.actualExpenses.toLocaleString()}</strong>
                    </td>
                    <td></td>
                    {canEditReport && <td></td>}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <h3 className="text-lg mb-4 mt-6">Attendance</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Total Participants</Label>
              <Input
                type="number"
                value={report.attendance.total}
                onChange={(e) => {
                  const total = Number(e.target.value);
                  const percentage = total > 0 ? Math.round((report.attendance.present / total) * 100) : 0;
                  setReport(prev => ({ 
                    ...prev, 
                    attendance: { 
                      ...prev.attendance, 
                      total,
                      percentage 
                    }
                  }));
                }}
                placeholder="0"
                disabled={!canEditReport}
              />
            </div>
            <div>
              <Label>Present</Label>
              <Input
                type="number"
                value={report.attendance.present}
                onChange={(e) => {
                  const present = Number(e.target.value);
                  const percentage = report.attendance.total > 0 
                    ? Math.round((present / report.attendance.total) * 100) 
                    : 0;
                  setReport(prev => ({ 
                    ...prev, 
                    attendance: { 
                      ...prev.attendance, 
                      present,
                      percentage 
                    }
                  }));
                }}
                placeholder="0"
                disabled={!canEditReport}
              />
            </div>
            <div>
              <Label>Attendance Rate</Label>
              <Input
                value={`${report.attendance.percentage}%`}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Report Preview */}
      {showPreview && report.id && (
        <Card className="p-8 max-w-5xl mx-auto bg-white">
          {/* Report Header */}
          <div className="text-center border-b pb-6 mb-6">
            <h2 className="text-2xl">LIQUIDATION REPORT</h2>
            <p className="text-gray-600 mt-2">Sangguniang Kabataan</p>
            <p className="text-gray-600">Barangay [Name]</p>
          </div>

          {/* Event Information */}
          <div className="mb-8">
            <h3 className="text-lg mb-4 border-b pb-2">I. EVENT INFORMATION</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Event Title:</p>
                <p>{report.eventTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date:</p>
                <p>{new Date(report.eventDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Venue:</p>
                <p>{report.venue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time:</p>
                <p>{report.time}</p>
              </div>
            </div>
          </div>

          {/* Responsible Officers */}
          <div className="mb-8">
            <h3 className="text-lg mb-4 border-b pb-2">II. RESPONSIBLE OFFICERS</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Chairperson:</p>
                <p>{report.officers.chairperson}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Treasurer:</p>
                <p>{report.officers.treasurer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Secretary:</p>
                <p>{report.officers.secretary}</p>
              </div>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="mb-8">
            <h3 className="text-lg mb-4 border-b pb-2">III. BUDGET SUMMARY</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Approved Budget:</span>
                <span>₱{report.approvedBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Actual Expenses:</span>
                <span>₱{report.actualExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold">Variance:</span>
                <span className={`font-bold ${report.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₱{report.variance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Expenses */}
          <div className="mb-8">
            <h3 className="text-lg mb-4 border-b pb-2">IV. ITEMIZED EXPENSES</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-3">Date</th>
                  <th className="text-left py-2 px-3">Category</th>
                  <th className="text-left py-2 px-3">Description</th>
                  <th className="text-left py-2 px-3">OR Number</th>
                  <th className="text-left py-2 px-3">Supplier</th>
                  <th className="text-right py-2 px-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {report.expenses.map((expense) => (
                  <tr key={expense.id} className="border-b">
                    <td className="py-2 px-3">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="py-2 px-3">{expense.category}</td>
                    <td className="py-2 px-3">{expense.description}</td>
                    <td className="py-2 px-3">{expense.orNumber}</td>
                    <td className="py-2 px-3">{expense.supplier}</td>
                    <td className="py-2 px-3 text-right">₱{expense.amount.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan={5} className="py-2 px-3 text-right">Total:</td>
                  <td className="py-2 px-3 text-right">₱{report.actualExpenses.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Attendance */}
          <div className="mb-8">
            <h3 className="text-lg mb-4 border-b pb-2">V. ATTENDANCE</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Expected Participants:</span>
                <span>{report.attendance.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Actual Attendees:</span>
                <span>{report.attendance.present}</span>
              </div>
              <div className="flex justify-between">
                <span>Attendance Rate:</span>
                <span>{report.attendance.percentage}%</span>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-12 grid grid-cols-2 gap-12">
            <div className="text-center">
              <div className="border-b border-black inline-block min-w-[200px] pb-1 mb-2">
                {report.preparedBy}
              </div>
              <p className="text-sm">{report.position}</p>
              <p className="text-sm text-gray-600">Prepared By</p>
            </div>
            <div className="text-center">
              <div className="border-b border-black inline-block min-w-[200px] pb-1 mb-2">
                {report.officers.chairperson || '_________________'}
              </div>
              <p className="text-sm">SK Chairperson</p>
              <p className="text-sm text-gray-600">Noted By</p>
            </div>
          </div>
        </Card>
      )}

      {/* Add/Edit Expense Modal */}
      <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
            <DialogDescription>
              {editingExpense ? 'Update the details of this expense.' : 'Add a new expense to the report.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddExpense}>
            <div className="space-y-4">
              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  name="date"
                  defaultValue={editingExpense?.date || ''}
                  required
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Input
                  name="category"
                  defaultValue={editingExpense?.category || ''}
                  placeholder="e.g., Venue & Equipment"
                  required
                />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea
                  name="description"
                  defaultValue={editingExpense?.description || ''}
                  placeholder="Describe the expense"
                  required
                />
              </div>
              <div>
                <Label>OR Number *</Label>
                <Input
                  name="orNumber"
                  defaultValue={editingExpense?.orNumber || ''}
                  placeholder="e.g., OR-2025-101"
                  required
                />
              </div>
              <div>
                <Label>Supplier *</Label>
                <Input
                  name="supplier"
                  defaultValue={editingExpense?.supplier || ''}
                  placeholder="Supplier/Vendor name"
                  required
                />
              </div>
              <div>
                <Label>Amount *</Label>
                <Input
                  type="number"
                  name="amount"
                  defaultValue={editingExpense?.amount || ''}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label>Receipt/OR Copy</Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    name="receipt"
                    accept="image/*,application/pdf"
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Upload a photo or PDF of the official receipt (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowExpenseModal(false);
                  setEditingExpense(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}