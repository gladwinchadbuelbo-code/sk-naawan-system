import { useNavigate } from 'react-router-dom';
import { Wallet, Calendar, FileText, TrendingUp, TrendingDown, AlertCircle, User, Wallet2, FileEdit } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { storage } from '../utils/storage';
import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Zero-State Mode - First day of the month
  const isZeroState = true; // Set to false to load actual data

  // Load data from localStorage
  const funds = storage.getFunds() || [];
  const events = storage.getEvents() || [];

  // Calculate budget totals
  const totalIncome = useMemo(() =>
    funds.filter((f: any) => f.type === 'income').reduce((sum: number, f: any) => sum + f.amount, 0),
    [funds]
  );

  const totalExpenses = useMemo(() =>
    funds.filter((f: any) => f.type === 'expense').reduce((sum: number, f: any) => sum + f.amount, 0),
    [funds]
  );

  const remainingBudget = totalIncome - totalExpenses;

  // Group expenses by category for pie chart
  const budgetData = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};
    funds
      .filter((f: any) => f.type === 'expense')
      .forEach((f: any) => {
        categoryMap[f.category] = (categoryMap[f.category] || 0) + f.amount;
      });

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];
    return Object.keys(categoryMap).sort().map((category, index) => ({
      name: category,
      value: categoryMap[category],
      color: colors[index % colors.length],
      id: `dashboard-category-${category.replace(/\s+/g, '-').toLowerCase()}`,
    }));
  }, [funds]);

  // Get upcoming events
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return events
      .filter((e: any) => {
        const eventDate = new Date(e.date);
        return eventDate >= today && (e.status === 'Upcoming' || e.status === 'Planning');
      })
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [events]);

  // Get recent transactions
  const recentTransactions = useMemo(() => {
    return [...funds]
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [funds]);

  // Pending reports (events that need reports)
  const pendingReports = useMemo(() => {
    const today = new Date();
    return events
      .filter((e: any) => {
        const eventDate = new Date(e.date);
        return eventDate < today && e.status === 'Completed';
      })
      .slice(0, 3)
      .map((e: any) => ({
        id: e.id,
        event: e.title,
        type: 'Liquidation',
        dueDate: new Date(new Date(e.date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }));
  }, [events]);

  const getRoleInfo = () => {
    if (!user) return { icon: User, label: 'User', color: 'bg-blue-600', greeting: 'Welcome' };

    switch (user.role) {
      case 'chairperson':
        return {
          icon: User,
          label: 'Chairperson',
          color: 'bg-purple-600',
          greeting: `Welcome, ${user.fullName}`
        };
      case 'treasurer':
        return {
          icon: Wallet2,
          label: 'Treasurer',
          color: 'bg-green-600',
          greeting: `Welcome, ${user.fullName}`
        };
      case 'secretary':
        return {
          icon: FileEdit,
          label: 'Secretary',
          color: 'bg-orange-600',
          greeting: `Welcome, ${user.fullName}`
        };
      default:
        return { icon: User, label: 'User', color: 'bg-blue-600', greeting: 'Welcome' };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  // Archived months data
  const archivedMonths = [
    { month: 'March 2026', income: 150000, expenses: 120000 },
    { month: 'February 2026', income: 200000, expenses: 180000 },
    { month: 'January 2026', income: 175000, expenses: 140000 },
  ];

  return (
    <div className="p-8 space-y-8 ph-pattern-bg min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl">SK Naawan IMS Dashboard</h1>
            <Badge className={`${roleInfo.color} text-white`}>
              <RoleIcon className="w-3 h-3 mr-1" />
              SK {roleInfo.label}
            </Badge>
          </div>
          <p className="text-gray-600">{roleInfo.greeting}</p>
          <p className="text-gray-500 text-sm mt-1">
            May 2026 - Overview of SK programs, budget transparency, and reporting activities
          </p>
        </div>
      </div>

      {/* Summary Cards - Zero State */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#059669] to-[#047857] text-white border-0 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Total Funds Received</p>
              <h3 className="text-3xl font-bold mt-2">₱0.00</h3>
              <p className="text-xs text-emerald-100 mt-2">May 2026</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white border-0 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Expenses</p>
              <h3 className="text-3xl font-bold mt-2">₱0.00</h3>
              <p className="text-xs text-red-100 mt-2">May 2026</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#10B981] to-[#059669] text-white border-0 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Balance</p>
              <h3 className="text-3xl font-bold mt-2">₱0.00</h3>
              <p className="text-xs text-emerald-100 mt-2">May 2026</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#047857] to-[#065F46] text-white border-0 shadow-lg rounded-xl hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Upcoming Events</p>
              <h3 className="text-3xl font-bold mt-2">0</h3>
              <p className="text-xs text-emerald-100 mt-2">May 2026</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions - Role Based */}
      {user && (
        <Card className="p-6 rounded-xl">
          <h3 className="text-lg mb-4 text-[#111827] font-semibold">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.role === 'secretary' && (
              <Button
                onClick={() => navigate('/staff/events/proposal/create')}
                className="bg-[#059669] hover:bg-[#047857] h-auto py-4 flex-col gap-2 rounded-xl"
              >
                <FileEdit className="w-6 h-6" />
                <span>Create Activity Proposal</span>
                <span className="text-xs opacity-80">Submit new event ideas</span>
              </Button>
            )}
            {user.role === 'secretary' && (
              <Button
                onClick={() => navigate('/staff/my-proposals')}
                className="bg-[#10B981] hover:bg-[#059669] h-auto py-4 flex-col gap-2 rounded-xl"
              >
                <FileText className="w-6 h-6" />
                <span>My Proposals</span>
                <span className="text-xs opacity-80">Track proposal status</span>
              </Button>
            )}
            {user.role === 'treasurer' && (
              <>
                <Button
                  onClick={() => navigate('/staff/budget', { state: { openExpenseModal: true } })}
                  className="bg-[#EF4444] hover:bg-[#DC2626] h-auto py-4 flex-col gap-2 rounded-xl"
                >
                  <TrendingDown className="w-6 h-6" />
                  <span>Record Expense</span>
                  <span className="text-xs opacity-80">Track expenditures</span>
                </Button>
                <Button
                  onClick={() => navigate('/staff/budget/proposal/create')}
                  className="bg-[#059669] hover:bg-[#047857] h-auto py-4 flex-col gap-2 rounded-xl"
                >
                  <Wallet2 className="w-6 h-6" />
                  <span>Create Budget Proposal</span>
                  <span className="text-xs opacity-80">Submit budget requests</span>
                </Button>
                <Button
                  onClick={() => navigate('/staff/my-budget-proposals')}
                  className="bg-[#10B981] hover:bg-[#059669] h-auto py-4 flex-col gap-2 rounded-xl"
                >
                  <FileText className="w-6 h-6" />
                  <span>My Budget Proposals</span>
                  <span className="text-xs opacity-80">Track proposal status</span>
                </Button>
              </>
            )}
            {user.role === 'chairperson' && (
              <Button
                onClick={() => navigate('/staff/approvals')}
                className="bg-[#F59E0B] hover:bg-[#D97706] h-auto py-4 flex-col gap-2 rounded-xl"
              >
                <AlertCircle className="w-6 h-6" />
                <span>Review Pending Approvals</span>
                <span className="text-xs opacity-80">Approve proposals</span>
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Content Grid - Zero State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Allocation Chart - Empty State */}
        <Card className="p-6 rounded-xl">
          <h3 className="text-lg mb-4 text-[#111827] font-semibold">Budget Allocation</h3>
          <div className="h-[300px] flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 text-sm">No data</p>
              </div>
            </div>
            <p className="text-gray-500 mt-6 text-sm">No expense data yet</p>
            <p className="text-gray-400 text-xs mt-1">Add expenses to see budget allocation</p>
          </div>
        </Card>

        {/* Upcoming Events - Empty State */}
        <Card className="p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#111827] font-semibold">Upcoming Events</h3>
            <button
              onClick={() => navigate('/staff/events')}
              className="text-sm text-[#059669] hover:text-[#047857] font-medium"
            >
              View all
            </button>
          </div>
          <div className="h-[200px] flex flex-col items-center justify-center text-center">
            <Calendar className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-gray-700">No upcoming events for May</p>
            <Button
              onClick={() => navigate('/staff/events')}
              className="mt-4 text-[#059669] hover:text-[#047857]"
              variant="link"
            >
              + Add Event
            </Button>
          </div>
        </Card>

        {/* Pending Reports - Empty State */}
        <Card className="p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#111827] font-semibold">Pending Reports</h3>
            <button
              onClick={() => navigate('/staff/reports')}
              className="text-sm text-[#059669] hover:text-[#047857] font-medium"
            >
              View all
            </button>
          </div>
          <div className="h-[200px] flex flex-col items-center justify-center text-gray-500">
            <FileText className="w-12 h-12 mb-3 text-gray-300" />
            <p>No pending reports</p>
            <p className="text-sm mt-1">Reports will appear after events are completed</p>
          </div>
        </Card>

        {/* Recent Transactions - Empty State */}
        <Card className="p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#111827] font-semibold">Recent Transactions</h3>
            <button
              onClick={() => navigate('/staff/budget')}
              className="text-sm text-[#059669] hover:text-[#047857] font-medium"
            >
              View all
            </button>
          </div>
          <div className="h-[200px] flex flex-col items-center justify-center text-gray-500">
            <Wallet className="w-12 h-12 mb-3 text-gray-300" />
            <p>No transactions recorded yet</p>
            <Button
              onClick={() => navigate('/staff/budget')}
              variant="link"
              className="mt-2 text-blue-600"
            >
              Add your first transaction
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
