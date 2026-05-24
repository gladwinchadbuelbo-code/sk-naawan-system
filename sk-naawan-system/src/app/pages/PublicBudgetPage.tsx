import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  ArrowLeft,
  Download,
  Filter,
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Shield,
  Search
} from 'lucide-react';
import { storage } from '../utils/storage';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import logoImage from 'figma:asset/c1c184dbafb09f96366bc3ee26a02e53e96d0e3e.png';

export function PublicBudgetPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  // Load approved budget data
  const funds = storage.getFunds() || [];
  const budgetProposals = storage.getBudgetProposals() || [];
  const approvedBudgetProposals = budgetProposals.filter((p: any) => p.status === 'approved');

  // Calculate totals
  const totalIncome = useMemo(() => 
    funds.filter((f: any) => f.type === 'income').reduce((sum: number, f: any) => sum + f.amount, 0),
    [funds]
  );

  const totalExpenses = useMemo(() => 
    funds.filter((f: any) => f.type === 'expense').reduce((sum: number, f: any) => sum + f.amount, 0),
    [funds]
  );

  const remainingBudget = totalIncome - totalExpenses;
  const utilizationRate = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0;

  // Get all categories
  const categories = Array.from(new Set(funds.map((f: any) => f.category)));

  // Get all years
  const years = Array.from(new Set(funds.map((f: any) => new Date(f.date).getFullYear())));

  // Filter funds
  const filteredFunds = funds.filter((f: any) => {
    const matchesSearch = f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         f.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    const matchesYear = yearFilter === 'all' || new Date(f.date).getFullYear().toString() === yearFilter;
    return matchesSearch && matchesCategory && matchesYear;
  });

  // Budget by category (for pie chart)
  const budgetByCategory = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};
    funds.filter((f: any) => f.type === 'expense').forEach((f: any) => {
      categoryMap[f.category] = (categoryMap[f.category] || 0) + f.amount;
    });

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];
    return Object.keys(categoryMap).sort().map((category, index) => ({
      name: category,
      value: categoryMap[category],
      color: colors[index % colors.length],
      id: `public-category-${category.replace(/\s+/g, '-').toLowerCase()}`,
    }));
  }, [funds]);

  // Monthly expenses (for bar chart)
  const monthlyData = useMemo(() => {
    const monthMap: { [key: string]: number } = {};
    funds.filter((f: any) => f.type === 'expense').forEach((f: any) => {
      const month = new Date(f.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthMap[month] = (monthMap[month] || 0) + f.amount;
    });

    return Object.keys(monthMap).map((month, index) => ({
      id: `public-month-${index}-${month.replace(/\s+/g, '-').toLowerCase()}`,
      month,
      amount: monthMap[month],
    })).slice(-6); // Last 6 months
  }, [funds]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate('/public')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portal
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <img src={logoImage} alt="SK Logo" className="w-6 h-6 object-contain" />
                <span>SK Transparency Portal</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Staff Login
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl">Budget Transparency</h1>
              <p className="text-gray-600">View approved budget allocations and financial reports</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-8 h-8" />
              <span className="text-sm">Total Allocation</span>
            </div>
            <p className="text-3xl mb-1">₱{totalIncome.toLocaleString()}</p>
            <p className="text-xs text-green-100">{funds.filter((f: any) => f.type === 'income').length} allocations</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-8 h-8" />
              <span className="text-sm">Total Expenses</span>
            </div>
            <p className="text-3xl mb-1">₱{totalExpenses.toLocaleString()}</p>
            <p className="text-xs text-red-100">{funds.filter((f: any) => f.type === 'expense').length} transactions</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-8 h-8" />
              <span className="text-sm">Remaining Budget</span>
            </div>
            <p className="text-3xl mb-1">₱{remainingBudget.toLocaleString()}</p>
            <p className="text-xs text-blue-100">Available funds</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8" />
              <span className="text-sm">Utilization Rate</span>
            </div>
            <p className="text-3xl mb-1">{utilizationRate}%</p>
            <p className="text-xs text-purple-100">Budget utilized</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Budget by Category */}
          <Card className="p-6" key="public-pie-chart-card">
            <h3 className="text-lg mb-4">Budget by Category</h3>
            {budgetByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} key="public-pie-container">
                <PieChart id="public-pie-chart">
                  <Pie
                    key="public-pie-data"
                    data={budgetByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ₱${entry.value.toLocaleString()}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={false}
                  >
                    {budgetByCategory.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip key="public-pie-tooltip" wrapperStyle={{ outline: 'none' }} />
                  <Legend key="public-pie-legend" wrapperStyle={{ paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No expense data available
              </div>
            )}
          </Card>

          {/* Monthly Expenses */}
          <Card className="p-6" key="public-bar-chart-card">
            <h3 className="text-lg mb-4">Monthly Expenses (Last 6 Months)</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} key="public-bar-container">
                <BarChart data={monthlyData} id="public-bar-chart">
                  <CartesianGrid key="public-bar-grid" strokeDasharray="3 3" />
                  <XAxis key="public-bar-xaxis" dataKey="month" />
                  <YAxis key="public-bar-yaxis" />
                  <Tooltip
                    key="public-bar-tooltip"
                    formatter={(value: number) => `₱${value.toLocaleString()}`}
                    wrapperStyle={{ outline: 'none' }}
                  />
                  <Bar key="public-bar-amount" dataKey="amount" fill="#3b82f6" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No monthly data available
              </div>
            )}
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg">Filter Budget Records</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search description or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat: string) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">Year</label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year: number) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Budget Records */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Budget Records</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 text-sm">Date</th>
                  <th className="text-left p-3 text-sm">Category</th>
                  <th className="text-left p-3 text-sm">Description</th>
                  <th className="text-left p-3 text-sm">Type</th>
                  <th className="text-right p-3 text-sm">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredFunds.length > 0 ? (
                  filteredFunds.map((fund: any) => (
                    <tr key={fund.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(fund.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <Badge variant="outline">{fund.category}</Badge>
                      </td>
                      <td className="p-3 text-sm">{fund.description}</td>
                      <td className="p-3 text-sm">
                        <Badge className={fund.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {fund.type === 'income' ? 'Allocation' : 'Expense'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-right">
                        <span className={fund.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {fund.type === 'income' ? '+' : '-'}₱{fund.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      No budget records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredFunds.length > 0 && (
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredFunds.length} of {funds.length} records
              </p>
            </div>
          )}
        </Card>

        {/* Approved Budget Proposals */}
        <div className="mt-8">
          <h2 className="text-2xl mb-6">Approved Budget Proposals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedBudgetProposals.length > 0 ? (
              approvedBudgetProposals.map((proposal: any) => (
                <Card key={proposal.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg flex-1">{proposal.title}</h3>
                    <Badge className="bg-green-100 text-green-700">Approved</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{proposal.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">₱{(proposal.totalAmount || proposal.amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget Items:</span>
                      <span className="font-medium">{(proposal.items || proposal.breakdown || []).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Submitted:</span>
                      <span className="text-gray-500">{new Date(proposal.submittedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Proposal
                  </Button>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center col-span-full">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500">No approved budget proposals yet</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}