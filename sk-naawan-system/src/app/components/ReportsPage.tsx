import { useState } from 'react';
import { Layout } from './Layout';
import { Download, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportsPageProps {
  onNavigate: (page: string) => void;
}

export function ReportsPage({ onNavigate }: ReportsPageProps) {
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-12-31');
  const [reportType, setReportType] = useState('all');

  // Budget Data
  const budgetBarData = [
    { month: 'Jan', income: 50000, expenses: 20000 },
    { month: 'Feb', income: 0, expenses: 23000 },
    { month: 'Mar', income: 0, expenses: 5000 },
    { month: 'Apr', income: 25000, expenses: 15000 },
    { month: 'May', income: 0, expenses: 12000 },
    { month: 'Jun', income: 0, expenses: 18000 },
  ];

  const budgetPieData = [
    { name: 'Youth Programs', value: 35000, color: '#2563eb' },
    { name: 'Scholarships', value: 28000, color: '#10b981' },
    { name: 'Events', value: 20000, color: '#fbbf24' },
    { name: 'Office', value: 10000, color: '#6366f1' },
  ];

  const budgetTableData = [
    { category: 'Youth Programs', amount: 35000, percentage: '37.6%' },
    { category: 'Scholarships', amount: 28000, percentage: '30.1%' },
    { category: 'Events', amount: 20000, percentage: '21.5%' },
    { category: 'Office Supplies', amount: 10000, percentage: '10.8%' },
  ];

  // Scholarship Data
  const scholarshipLineData = [
    { month: 'Jan', scholars: 8, allowances: 8000 },
    { month: 'Feb', scholars: 10, allowances: 10000 },
    { month: 'Mar', scholars: 12, allowances: 12000 },
    { month: 'Apr', scholars: 12, allowances: 12000 },
    { month: 'May', scholars: 11, allowances: 11000 },
    { month: 'Jun', scholars: 12, allowances: 12000 },
  ];

  const scholarshipTableData = [
    { name: 'Juan Dela Cruz', totalReceived: 6000, lastRelease: '2025-11-01', status: 'Active' },
    { name: 'Maria Santos', totalReceived: 6000, lastRelease: '2025-11-01', status: 'Active' },
    { name: 'Pedro Garcia', totalReceived: 7200, lastRelease: '2025-11-01', status: 'Active' },
    { name: 'Ana Reyes', totalReceived: 7200, lastRelease: '2025-11-01', status: 'Active' },
    { name: 'Jose Mercado', totalReceived: 4800, lastRelease: '2025-11-01', status: 'Active' },
  ];

  // Event Data
  const eventBarData = [
    { month: 'Jan', events: 2, participants: 80 },
    { month: 'Feb', events: 3, participants: 120 },
    { month: 'Mar', events: 2, participants: 95 },
    { month: 'Apr', events: 4, participants: 150 },
    { month: 'May', events: 3, participants: 110 },
    { month: 'Jun', events: 2, participants: 85 },
  ];

  const eventTableData = [
    { event: 'Youth Leadership Summit', date: '2025-12-15', participants: 50, budget: 15000, status: 'Upcoming' },
    { event: 'Sports Festival', date: '2025-12-20', participants: 100, budget: 20000, status: 'Upcoming' },
    { event: 'Community Cleanup', date: '2025-11-10', participants: 30, budget: 5000, status: 'Completed' },
    { event: 'Feeding Program', date: '2025-11-05', participants: 80, budget: 8000, status: 'Completed' },
  ];

  return (
    <Layout currentPage="reports" onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[#1e3a5f]">Reports & Analytics</h2>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-[#6b7280]" />
            <div className="flex gap-4 flex-1">
              <div className="flex-1">
                <Label htmlFor="dateFrom">From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="dateTo">To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="budget">Budget Only</SelectItem>
                    <SelectItem value="scholarship">Scholarship Only</SelectItem>
                    <SelectItem value="event">Event Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="mt-6 bg-[#2563eb] hover:bg-[#1d4ed8]">
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Report Tabs */}
        <Tabs defaultValue="budget" className="w-full">
          <TabsList className="w-full justify-start bg-white rounded-lg p-1">
            <TabsTrigger value="budget">Budget Reports</TabsTrigger>
            <TabsTrigger value="scholarship">Scholarship Reports</TabsTrigger>
            <TabsTrigger value="event">Event Reports</TabsTrigger>
          </TabsList>

          {/* Budget Reports Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Income vs Expenses Bar Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[#1e3a5f]">Income vs Expenses</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Budget Allocation Pie Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[#1e3a5f]">Budget Allocation by Category</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={budgetPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${((entry.value / 93000) * 100).toFixed(1)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {budgetPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Budget Summary Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-[#1e3a5f]">Budget Summary</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Excel
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Category</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Amount Spent</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {budgetTableData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-[#4a5c6e]">{item.category}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">₱{item.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">{item.percentage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Scholarship Reports Tab */}
          <TabsContent value="scholarship" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Scholar Growth Line Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[#1e3a5f]">Scholar Growth & Allowance Distribution</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scholarshipLineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="scholars" stroke="#2563eb" name="Number of Scholars" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="allowances" stroke="#10b981" name="Total Allowances (₱)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Scholarship Distribution Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-[#1e3a5f]">Scholarship Distribution Summary</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Excel
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Scholar Name</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Total Received</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Last Release</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {scholarshipTableData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-[#4a5c6e]">{item.name}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">₱{item.totalReceived.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">{item.lastRelease}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Event Reports Tab */}
          <TabsContent value="event" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Events and Participation Bar Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[#1e3a5f]">Events & Participation Overview</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="events" fill="#2563eb" name="Number of Events" />
                    <Bar yAxisId="right" dataKey="participants" fill="#fbbf24" name="Total Participants" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Event Summary Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-[#1e3a5f]">Event Summary</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Excel
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Event Name</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Date</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Participants</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Budget</th>
                      <th className="px-6 py-3 text-left text-[#6b7280]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {eventTableData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-[#4a5c6e]">{item.event}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">{item.date}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">{item.participants}</td>
                        <td className="px-6 py-4 text-[#4a5c6e]">₱{item.budget.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                            item.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
