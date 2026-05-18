import { useState } from 'react';
import { Layout } from './Layout';
import { Plus, Edit, Eye, Trash2, Wallet, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ScholarshipsPageProps {
  onNavigate: (page: string) => void;
}

interface Scholar {
  id: number;
  name: string;
  age: number;
  school: string;
  gradeLevel: string;
  status: 'active' | 'inactive' | 'graduated';
  allowanceAmount: number;
  lastAllowance: string;
}

export function ScholarshipsPage({ onNavigate }: ScholarshipsPageProps) {
  const [scholars, setScholars] = useState<Scholar[]>([
    { id: 1, name: 'Juan Dela Cruz', age: 16, school: 'Barangay High School', gradeLevel: 'Grade 10', status: 'active', allowanceAmount: 1000, lastAllowance: '2025-11-01' },
    { id: 2, name: 'Maria Santos', age: 15, school: 'Community High School', gradeLevel: 'Grade 9', status: 'active', allowanceAmount: 1000, lastAllowance: '2025-11-01' },
    { id: 3, name: 'Pedro Garcia', age: 17, school: 'Barangay High School', gradeLevel: 'Grade 11', status: 'active', allowanceAmount: 1200, lastAllowance: '2025-11-01' },
    { id: 4, name: 'Ana Reyes', age: 18, school: 'Senior High School', gradeLevel: 'Grade 12', status: 'active', allowanceAmount: 1200, lastAllowance: '2025-11-01' },
    { id: 5, name: 'Jose Mercado', age: 14, school: 'Community High School', gradeLevel: 'Grade 8', status: 'active', allowanceAmount: 800, lastAllowance: '2025-11-01' },
  ]);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    school: '',
    gradeLevel: '',
    status: 'active' as 'active' | 'inactive' | 'graduated',
    allowanceAmount: '',
  });

  const handleRegisterScholar = () => {
    const newScholar: Scholar = {
      id: scholars.length + 1,
      name: formData.name,
      age: Number(formData.age),
      school: formData.school,
      gradeLevel: formData.gradeLevel,
      status: formData.status,
      allowanceAmount: Number(formData.allowanceAmount),
      lastAllowance: new Date().toISOString().split('T')[0],
    };
    setScholars([...scholars, newScholar]);
    setShowRegisterModal(false);
    setFormData({ name: '', age: '', school: '', gradeLevel: '', status: 'active', allowanceAmount: '' });
  };

  const handleEditScholar = () => {
    if (selectedScholar) {
      setScholars(scholars.map(s => s.id === selectedScholar.id ? {
        ...s,
        ...formData,
        age: Number(formData.age),
        allowanceAmount: Number(formData.allowanceAmount),
      } : s));
      setShowEditModal(false);
      setSelectedScholar(null);
      setFormData({ name: '', age: '', school: '', gradeLevel: '', status: 'active', allowanceAmount: '' });
    }
  };

  const handleDeleteScholar = () => {
    if (selectedScholar) {
      setScholars(scholars.filter(s => s.id !== selectedScholar.id));
      setShowDeleteModal(false);
      setSelectedScholar(null);
    }
  };

  const openEditModal = (scholar: Scholar) => {
    setSelectedScholar(scholar);
    setFormData({
      name: scholar.name,
      age: scholar.age.toString(),
      school: scholar.school,
      gradeLevel: scholar.gradeLevel,
      status: scholar.status,
      allowanceAmount: scholar.allowanceAmount.toString(),
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (scholar: Scholar) => {
    setSelectedScholar(scholar);
    setShowDeleteModal(true);
  };

  const activeScholars = scholars.filter(s => s.status === 'active').length;
  const totalAllowances = scholars.reduce((sum, s) => sum + s.allowanceAmount, 0);

  return (
    <Layout currentPage="scholarships" onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[#1e3a5f]">Scholarship Management</h2>
          <div className="flex gap-3">
            <Button onClick={() => onNavigate('allowance-tracking')} variant="outline" className="text-[#2563eb]">
              <Wallet className="w-4 h-4 mr-2" />
              Track Allowances
            </Button>
            <Button onClick={() => setShowRegisterModal(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Plus className="w-4 h-4 mr-2" />
              Register Scholar
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#6b7280] mb-1">Total Scholars</div>
                <div className="text-[#1e3a5f]">{scholars.length}</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#6b7280] mb-1">Active Scholars</div>
                <div className="text-[#1e3a5f]">{activeScholars}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#6b7280] mb-1">Monthly Allowances</div>
                <div className="text-[#1e3a5f]">₱{totalAllowances.toLocaleString()}</div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Scholars Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-[#1e3a5f]">Scholar List</h3>
            <Button onClick={() => onNavigate('reports')} variant="outline" className="text-[#2563eb]">
              Generate Scholarship Reports
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Name</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Age</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">School</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Grade Level</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Status</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Monthly Allowance</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Last Allowance</th>
                  <th className="px-6 py-3 text-left text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {scholars.map((scholar) => (
                  <tr key={scholar.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-[#4a5c6e]">{scholar.name}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">{scholar.age}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">{scholar.school}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">{scholar.gradeLevel}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        scholar.status === 'active' ? 'bg-green-100 text-green-800' :
                        scholar.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {scholar.status.charAt(0).toUpperCase() + scholar.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#4a5c6e]">₱{scholar.allowanceAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[#4a5c6e]">{scholar.lastAllowance}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(scholar)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(scholar)}
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

      {/* Register Scholar Modal */}
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Scholar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter age"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="Enter school name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Select value={formData.gradeLevel} onValueChange={(value) => setFormData({ ...formData, gradeLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade 7">Grade 7</SelectItem>
                    <SelectItem value="Grade 8">Grade 8</SelectItem>
                    <SelectItem value="Grade 9">Grade 9</SelectItem>
                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                    <SelectItem value="Grade 11">Grade 11</SelectItem>
                    <SelectItem value="Grade 12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="allowanceAmount">Monthly Allowance</Label>
                <Input
                  id="allowanceAmount"
                  type="number"
                  value={formData.allowanceAmount}
                  onChange={(e) => setFormData({ ...formData, allowanceAmount: e.target.value })}
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'graduated') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegisterModal(false)}>Cancel</Button>
            <Button onClick={handleRegisterScholar} className="bg-[#2563eb] hover:bg-[#1d4ed8]">Register Scholar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Scholar Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Scholar Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-age">Age</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-school">School</Label>
              <Input
                id="edit-school"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-gradeLevel">Grade Level</Label>
                <Select value={formData.gradeLevel} onValueChange={(value) => setFormData({ ...formData, gradeLevel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade 7">Grade 7</SelectItem>
                    <SelectItem value="Grade 8">Grade 8</SelectItem>
                    <SelectItem value="Grade 9">Grade 9</SelectItem>
                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                    <SelectItem value="Grade 11">Grade 11</SelectItem>
                    <SelectItem value="Grade 12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-allowanceAmount">Monthly Allowance</Label>
                <Input
                  id="edit-allowanceAmount"
                  type="number"
                  value={formData.allowanceAmount}
                  onChange={(e) => setFormData({ ...formData, allowanceAmount: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'graduated') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleEditScholar} className="bg-[#2563eb] hover:bg-[#1d4ed8]">Save Changes</Button>
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
            <p className="text-[#4a5c6e]">Are you sure you want to remove this scholar from the program? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button onClick={handleDeleteScholar} className="bg-[#dc2626] hover:bg-[#b91c1c]">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
