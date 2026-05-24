import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, Download, Eye, Plus, BarChart3, PieChart as PieChartIcon, TrendingUp, Shield, Edit, Lock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { toast } from 'sonner';

export function ReportsPage() {
  const navigate = useNavigate();
  const { user, canEdit } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('budget');
  const [reports, setReports] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Load reports and events from storage
  useEffect(() => {
    const storedReports = storage.getReports() || [];
    const storedEvents = storage.getEvents() || [];
    setReports(storedReports);
    setEvents(storedEvents);
  }, []);

  // Separate reports by type
  const liquidationReports = reports.filter(r => r.expenses !== undefined);
  const accomplishmentReports = reports.filter(r => r.objectives !== undefined);

  // Mock data for budget reports - Zero State
  const budgetChartData = [
    { id: 'month-jan', month: 'Jan', income: 0, expenses: 0 },
    { id: 'month-feb', month: 'Feb', income: 0, expenses: 0 },
    { id: 'month-mar', month: 'Mar', income: 0, expenses: 0 },
    { id: 'month-apr', month: 'Apr', income: 0, expenses: 0 },
    { id: 'month-may', month: 'May', income: 0, expenses: 0 },
    { id: 'month-jun', month: 'Jun', income: 0, expenses: 0 },
  ];

  const categoryData = [
    { name: 'Programs', value: 0, color: '#3b82f6', id: 'reports-programs' },
    { name: 'Operations', value: 0, color: '#10b981', id: 'reports-operations' },
    { name: 'Infrastructure', value: 0, color: '#f59e0b', id: 'reports-infrastructure' },
    { name: 'Reserved', value: 0, color: '#8b5cf6', id: 'reports-reserved' },
  ];

  const budgetReports: any[] = [];

  const templates = [
    { id: 1, name: 'Standard Liquidation Report', description: 'Financial liquidation template', lastModified: '2025-11-01' },
    { id: 2, name: 'Accomplishment Report', description: 'Event accomplishment report format', lastModified: '2025-10-15' },
    { id: 3, name: 'Event Summary Template', description: 'Quick event summary format', lastModified: '2025-09-20' },
  ];

  const getRolePermissions = () => {
    if (!user) return [];
    if (user.role === 'chairperson') return ['All Reports (Full Access)', 'Can Approve Reports'];
    if (user.role === 'treasurer') return ['Liquidation Reports (Edit)', 'Budget Reports (Edit)', 'View All Other Reports'];
    if (user.role === 'secretary') return ['Accomplishment Reports (Edit)', 'Event Documentation (Edit)', 'View All Other Reports'];
    return [];
  };

  return (
    <div className="p-8 space-y-8 ph-pattern-bg min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl">Reports & Documentation</h1>
          <p className="text-gray-600 mt-2">Generate and manage reports for budget, events, and programs</p>
        </div>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-900">Your Permissions</span>
          </div>
          <div className="space-y-1">
            {getRolePermissions().map((perm, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-blue-800">
                <Edit className="w-3 h-3" />
                <span>{perm}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="budget">Budget Reports</TabsTrigger>
          <TabsTrigger value="events">Event Reports</TabsTrigger>
          <TabsTrigger value="templates">Generated Templates</TabsTrigger>
          <TabsTrigger value="documentation">Documentation Packet</TabsTrigger>
        </TabsList>

        {/* Budget Reports Tab */}
        <TabsContent value="budget" className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6" key="reports-bar-chart-card">
              <h3 className="text-lg mb-4">Income vs Expenses</h3>
              {budgetChartData.every(d => d.income === 0 && d.expenses === 0) ? (
                <div className="h-[300px] flex flex-col items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="flex items-end justify-center gap-2 h-32">
                      <div className="w-8 h-0 bg-gray-200 rounded-t"></div>
                      <div className="w-8 h-0 bg-gray-200 rounded-t"></div>
                      <div className="w-8 h-0 bg-gray-200 rounded-t"></div>
                      <div className="w-8 h-0 bg-gray-200 rounded-t"></div>
                      <div className="w-8 h-0 bg-gray-200 rounded-t"></div>
                      <div className="w-8 h-0 bg-gray-200 rounded-t"></div>
                    </div>
                    <div className="h-1 bg-gray-300 w-64 mx-auto"></div>
                    <p className="text-gray-500 text-sm mt-4">No income or expense data</p>
                    <p className="text-gray-400 text-xs">All values are ₱0.00</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300} key="reports-bar-container">
                  <BarChart data={budgetChartData} id="reports-bar-chart">
                    <CartesianGrid key="reports-bar-grid" strokeDasharray="3 3" />
                    <XAxis key="reports-bar-xaxis" dataKey="month" />
                    <YAxis key="reports-bar-yaxis" />
                    <Tooltip
                      key="reports-bar-tooltip"
                      formatter={(value) => `₱${Number(value).toLocaleString()}`}
                      wrapperStyle={{ outline: 'none' }}
                    />
                    <Legend key="reports-bar-legend" wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar key="reports-bar-income" dataKey="income" fill="#10b981" name="Income" isAnimationActive={false} />
                    <Bar key="reports-bar-expenses" dataKey="expenses" fill="#ef4444" name="Expenses" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card className="p-6" key="reports-pie-chart-card">
              <h3 className="text-lg mb-4">Budget Allocation by Category</h3>
              {categoryData.every(c => c.value === 0) ? (
                <div className="h-[300px] flex flex-col items-center justify-center">
                  <div className="relative w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">No data</p>
                    </div>
                  </div>
                  <p className="text-gray-500 mt-6 text-sm">No budget allocation data yet</p>
                  <p className="text-gray-400 text-xs mt-1">All categories show 0%</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300} key="reports-pie-container">
                  <PieChart id="reports-pie-chart">
                    <Pie
                      key="reports-pie-data"
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      isAnimationActive={false}
                    >
                      {categoryData.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      key="reports-pie-tooltip"
                      formatter={(value) => `₱${Number(value).toLocaleString()}`}
                      wrapperStyle={{ outline: 'none' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Budget Reports List */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg">Budget Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Report Title</th>
                    <th className="text-left py-3 px-4">Date Generated</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetReports.length > 0 ? (
                    budgetReports.map((report) => (
                      <tr key={report.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{report.title}</td>
                        <td className="py-3 px-4">{new Date(report.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{report.type}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {report.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <FileText className="w-12 h-12 text-gray-300 mb-3" />
                          <p>No budget reports generated yet</p>
                          <p className="text-sm text-gray-400 mt-1">Click "Generate New Report" to create your first report</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Export Options */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Export Options</h3>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export to PDF
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export to CSV
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Event Reports Tab */}
        <TabsContent value="events" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className={`p-6 border-2 border-blue-100 ${
                canEdit('liquidation') 
                  ? 'cursor-pointer hover:shadow-lg transition-shadow hover:border-blue-300' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => canEdit('liquidation') && navigate('/staff/reports/liquidation')}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-blue-100 p-4 rounded-xl">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h4>Liquidation Report</h4>
                  <p className="text-sm text-gray-600 mt-1">Financial liquidation report</p>
                  {!canEdit('liquidation') && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Treasurer Only
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            <Card
              className={`p-6 border-2 border-green-100 ${
                canEdit('accomplishment')
                  ? 'cursor-pointer hover:shadow-lg transition-shadow hover:border-green-300'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => canEdit('accomplishment') && navigate('/staff/reports/accomplishment')}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-green-100 p-4 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h4>Accomplishment Report</h4>
                  <p className="text-sm text-gray-600 mt-1">Event accomplishment report format</p>
                  {!canEdit('accomplishment') && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Secretary Only
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-purple-100 hover:border-purple-300"
              onClick={() => navigate('/staff/reports/documentation')}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-purple-100 p-4 rounded-xl">
                  <Download className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h4>Documentation Packet</h4>
                  <p className="text-sm text-gray-600 mt-1">Complete event bundle (ZIP)</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Event Reports List */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Event Reports</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Report Title</th>
                    <th className="text-left py-3 px-4">Event Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Liquidation Reports */}
                  {liquidationReports.map((report) => (
                    <tr key={`liq-${report.id}`} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{report.eventTitle} - Liquidation</td>
                      <td className="py-3 px-4">{new Date(report.eventDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">Liquidation</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            report.status === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : report.status === 'Submitted'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/reports/liquidation/${report.eventId || report.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Accomplishment Reports */}
                  {accomplishmentReports.map((report) => (
                    <tr key={`acc-${report.id}`} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{report.eventTitle} - Accomplishment</td>
                      <td className="py-3 px-4">{new Date(report.eventDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">Accomplishment</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            report.status === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : report.status === 'Submitted'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/reports/accomplishment/${report.eventId || report.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {liquidationReports.length === 0 && accomplishmentReports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No reports generated yet. Click on the cards above to create your first report.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Generated Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Custom Report Templates</h3>
              <Button
                onClick={() => navigate('/staff/reports/templates/create')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4>{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Last modified: {new Date(template.lastModified).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/staff/reports/templates/${template.id}/edit`);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info('Preview feature coming soon');
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info('Use template feature coming soon');
                          }}
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Documentation Packet Tab */}
        <TabsContent value="documentation" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg mb-4">Generate Documentation Packet</h3>
            <p className="text-gray-600 mb-6">
              Create a complete documentation bundle including Activity Design, Attendance Sheet, Budget Breakdown, Receipts, Photos, Liquidation Report, and Accomplishment Report.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Select Event</label>
                <select className="w-full border rounded-lg px-4 py-2">
                  <option value="">Choose an event...</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm mb-2">Included Documents:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Activity Design</li>
                  <li>✓ Attendance Sheet</li>
                  <li>✓ Budget Breakdown</li>
                  <li>✓ Receipts & Vouchers</li>
                  <li>✓ Photo Documentation</li>
                  <li>✓ Liquidation Report</li>
                  <li>✓ Accomplishment Report</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Full Packet (ZIP)
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Contents
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Packets */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Recently Generated Packets</h3>
            <div className="space-y-3">
              {liquidationReports.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p>{report.title} - Complete Packet</p>
                      <p className="text-xs text-gray-600">Generated on {new Date(report.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}