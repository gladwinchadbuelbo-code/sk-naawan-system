import { useState } from 'react';
import { Layout } from './Layout';
import { ArrowLeft, Plus, Download, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AllowanceTrackingPageProps {
  onNavigate: (page: string) => void;
}

interface AllowanceRelease {
  id: number;
  scholarName: string;
  gradeLevel: string;
  amount: number;
  date: string;
  status: 'released' | 'pending' | 'received';
  receivedDate?: string;
}

export function AllowanceTrackingPage({ onNavigate }: AllowanceTrackingPageProps) {
  const [allowances, setAllowances] = useState<AllowanceRelease[]>([
    { id: 1, scholarName: 'Juan Dela Cruz', gradeLevel: 'Grade 10', amount: 1000, date: '2025-11-01', status: 'received', receivedDate: '2025-11-05' },
    { id: 2, scholarName: 'Maria Santos', gradeLevel: 'Grade 9', amount: 1000, date: '2025-11-01', status: 'received', receivedDate: '2025-11-06' },
    { id: 3, scholarName: 'Pedro Garcia', gradeLevel: 'Grade 11', amount: 1200, date: '2025-11-01', status: 'received', receivedDate: '2025-11-05' },
    { id: 4, scholarName: 'Ana Reyes', gradeLevel: 'Grade 12', amount: 1200, date: '2025-11-01', status: 'received', receivedDate: '2025-11-07' },
    { id: 5, scholarName: 'Jose Mercado', gradeLevel: 'Grade 8', amount: 800, date: '2025-11-01', status: 'received', receivedDate: '2025-11-08' },
    { id: 6, scholarName: 'Juan Dela Cruz', gradeLevel: 'Grade 10', amount: 1000, date: '2025-12-01', status: 'pending' },
    { id: 7, scholarName: 'Maria Santos', gradeLevel: 'Grade 9', amount: 1000, date: '2025-12-01', status: 'pending' },
  ]);

  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [formData, setFormData] = useState({
    scholarName: '',
    amount: '',
    date: '',
  });

  const handleReleaseAllowance = () => {
    const newAllowance: AllowanceRelease = {
      id: allowances.length + 1,
      scholarName: formData.scholarName,
      gradeLevel: 'Grade 10', // Would be fetched from scholar data
      amount: Number(formData.amount),
      date: formData.date,
      status: 'pending',
    };
    setAllowances([...allowances, newAllowance]);
    setShowReleaseModal(false);
    setFormData({ scholarName: '', amount: '', date: '' });
  };

  const markAsReceived = (id: number) => {
    setAllowances(allowances.map(allowance => {
      if (allowance.id === id && allowance.status === 'pending') {
        return {
          ...allowance,
          status: 'received' as const,
          receivedDate: new Date().toISOString().split('T')[0],
        };
      }
      return allowance;
    }));
  };

  const totalReleased = allowances.reduce((sum, a) => sum + a.amount, 0);
  const releasedCount = allowances.filter(a => a.status === 'received').length;
  const pendingCount = allowances.filter(a => a.status === 'pending').length;

  return (
    <Layout currentPage="scholarships" onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => onNavigate('scholarships')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scholarships
            </Button>
            <h2 className="text-[#1e3a5f]">Allowance Tracking</h2>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="text-[#10b981]">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={() => setShowReleaseModal(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Plus className="w-4 h-4 mr-2" />
              Release Allowance
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="text-[#6b7280] mb-1">Total Releases</div>
            <div className="text-[#1e3a5f]">{allowances.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-[#6b7280] mb-1">Received</div>
            <div className="text-[#1e3a5f]">{releasedCount}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="text-[#6b7280] mb-1">Pending</div>
            <div className="text-[#1e3a5f]">{pendingCount}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="text-[#6b7280] mb-1">Total Amount</div>
            <div className="text-[#1e3a5f]">₱{totalReleased.toLocaleString()}</div>
          </div>
        </div>

        {/* Allowance Release History */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-[#1e3a5f]">Allowance Release History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Date Released</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Scholar Name</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Grade Level</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Amount</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Status</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Date Received</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allowances.map((allowance) => (
                  <tr key={allowance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-[#4a5c6e]">{allowance.date}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">{allowance.scholarName}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">{allowance.gradeLevel}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">₱{allowance.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {allowance.status === 'received' ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 text-sm">Received</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-yellow-600" />
                            <span className="text-yellow-800 text-sm">Pending</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#4a5c6e]">
                      {allowance.receivedDate || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {allowance.status === 'pending' && (
                        <Button
                          onClick={() => markAsReceived(allowance.id)}
                          size="sm"
                          className="bg-[#10b981] hover:bg-[#059669]"
                        >
                          Mark as Received
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-[#1e3a5f] mb-4">Monthly Summary</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-[#6b7280] mb-1">November 2025</div>
              <div className="text-[#1e3a5f]">₱5,200</div>
              <div className="text-xs text-[#6b7280] mt-1">5 scholars</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-[#6b7280] mb-1">December 2025</div>
              <div className="text-[#1e3a5f]">₱2,000</div>
              <div className="text-xs text-[#6b7280] mt-1">2 scholars (pending)</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-[#6b7280] mb-1">Total YTD</div>
              <div className="text-[#1e3a5f]">₱{totalReleased.toLocaleString()}</div>
              <div className="text-xs text-[#6b7280] mt-1">{allowances.length} releases</div>
            </div>
          </div>
        </div>
      </div>

      {/* Release Allowance Modal */}
      <Dialog open={showReleaseModal} onOpenChange={setShowReleaseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Release Allowance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="scholarName">Scholar Name</Label>
              <Select value={formData.scholarName} onValueChange={(value) => setFormData({ ...formData, scholarName: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scholar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Juan Dela Cruz">Juan Dela Cruz</SelectItem>
                  <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                  <SelectItem value="Pedro Garcia">Pedro Garcia</SelectItem>
                  <SelectItem value="Ana Reyes">Ana Reyes</SelectItem>
                  <SelectItem value="Jose Mercado">Jose Mercado</SelectItem>
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
              <Label htmlFor="date">Release Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReleaseModal(false)}>Cancel</Button>
            <Button onClick={handleReleaseAllowance} className="bg-[#2563eb] hover:bg-[#1d4ed8]">Release Allowance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
