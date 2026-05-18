import { Layout } from './Layout';
import { Wallet, Calendar, GraduationCap, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const chartData = [
    { name: 'Programs', value: 35, color: '#2563eb' },
    { name: 'Scholarships', value: 30, color: '#fbbf24' },
    { name: 'Events', value: 25, color: '#10b981' },
  ];

  return (
    <Layout currentPage="dashboard" onNavigate={onNavigate}>
      <div className="space-y-6">
        <h2 className="text-[#1e3a5f]">Dashboard Overview</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="text-[#6b7280] mb-1">Total Budget</div>
            <div className="text-[#1e3a5f]">₱50,000</div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="text-[#6b7280] mb-1">Upcoming Events</div>
            <div className="text-[#1e3a5f]">4</div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="text-[#6b7280] mb-1">Number of Scholars</div>
            <div className="text-[#1e3a5f]">12</div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="text-[#6b7280] mb-1">Pending Reports</div>
            <div className="text-[#1e3a5f]">3</div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-[#1e3a5f] mb-4">Budget Allocation and Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-3 gap-6">
          {/* Budget Management Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-[#1e3a5f] mb-4">Budget Management</h3>
            <div className="space-y-3">
              <button 
                onClick={() => onNavigate('budget')}
                className="w-full flex items-center gap-3 text-[#4a5c6e] hover:text-[#1e3a5f] transition-colors text-left"
              >
                <div className="w-8 h-8 bg-[#bfdbfe] rounded flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span>Add, edit, and track SK funds</span>
              </button>
              <button 
                onClick={() => onNavigate('budget')}
                className="w-full flex items-center gap-3 text-[#4a5c6e] hover:text-[#1e3a5f] transition-colors text-left"
              >
                <div className="w-8 h-8 bg-[#bfdbfe] rounded flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span>Record expenses</span>
              </button>
              <button 
                onClick={() => onNavigate('reports')}
                className="w-full flex items-center gap-3 text-[#4a5c6e] hover:text-[#1e3a5f] transition-colors text-left"
              >
                <div className="w-8 h-8 bg-[#bfdbfe] rounded flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span>Generate financial reports</span>
              </button>
            </div>
          </div>

          {/* Event & Program Management Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-[#1e3a5f] mb-4">Event & Program Management</h3>
            <div className="space-y-3">
              <button 
                onClick={() => onNavigate('events')}
                className="w-full flex items-center gap-3 text-[#4a5c6e] hover:text-[#1e3a5f] transition-colors text-left"
              >
                <div className="w-8 h-8 bg-[#bfdbfe] rounded flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span>Create and schedule events</span>
              </button>
              <button 
                onClick={() => onNavigate('events')}
                className="w-full flex items-center gap-3 text-[#4a5c6e] hover:text-[#1e3a5f] transition-colors text-left"
              >
                <div className="w-8 h-8 bg-[#bfdbfe] rounded flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span>Track attendance and participants</span>
              </button>
              <button 
                onClick={() => onNavigate('events')}
                className="w-full flex items-center gap-3 text-[#4a5c6e] hover:text-[#1e3a5f] transition-colors text-left"
              >
                <div className="w-8 h-8 bg-[#bfdbfe] rounded flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span>Store documentation</span>
              </button>
            </div>
          </div>

          {/* Scholarship Management Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-[#1e3a5f] mb-4">Scholarship Management</h3>
            <div className="space-y-3">
              <button 
                onClick={() => onNavigate('scholarships')}
                className="w-full flex items-center gap-3 text-[#4a5c6e] hover:text-[#1e3a5f] transition-colors text-left"
              >
                <div className="w-8 h-8 bg-[#bfdbfe] rounded flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span>Register scholars</span>
              </button>
              <button 
                onClick={() => onNavigate('allowance-tracking')}
                className="w-full flex items-center gap-3 text-[#4a5c6e] hover:text-[#1e3a5f] transition-colors text-left"
              >
                <div className="w-8 h-8 bg-[#bfdbfe] rounded flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span>Track allowances</span>
              </button>
              <button 
                onClick={() => onNavigate('reports')}
                className="w-full flex items-center gap-3 text-[#4a5c6e] hover:text-[#1e3a5f] transition-colors text-left"
              >
                <div className="w-8 h-8 bg-[#bfdbfe] rounded flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span>Generate scholarship reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
