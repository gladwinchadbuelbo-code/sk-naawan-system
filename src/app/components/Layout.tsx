import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, Calendar, FileText, Menu, LogOut, Settings, ClipboardList, User, UserCircle2, Wallet2, FileEdit, CheckCircle, Bell, Loader2, Archive } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import logoImage from 'figma:asset/c1c184dbafb09f96366bc3ee26a02e53e96d0e3e.png';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoggingOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to false for mobile-first
  const [pendingCount, setPendingCount] = useState(0);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Update pending count for chairperson
  useEffect(() => {
    if (user?.role === 'chairperson') {
      const activityProposals = storage.getActivityProposals().filter((p: any) => p.status === 'pending');
      const budgetProposals = storage.getBudgetProposals().filter((p: any) => p.status === 'pending');
      setPendingCount(activityProposals.length + budgetProposals.length);
    }
  }, [user, location]);

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
    ...(user?.role === 'chairperson' ? [{ 
      name: 'Approvals', 
      href: '/staff/approvals', 
      icon: CheckCircle,
      badge: pendingCount > 0 ? pendingCount : undefined 
    }] : []),
    { name: 'Budget', href: '/staff/budget', icon: Wallet },
    { name: 'Events', href: '/staff/events', icon: Calendar },
    { name: 'Reports', href: '/staff/reports', icon: FileText },
    { name: 'Archives', href: '/staff/archives', icon: Archive },
    { name: 'Settings', href: '/staff/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    } finally {
      setShowLogoutDialog(false);
    }
  };

  // Get role display info
  const getRoleInfo = () => {
    if (!user) return { icon: UserCircle2, label: 'User', color: 'bg-blue-600' };
    
    switch (user.role) {
      case 'chairperson':
        return { icon: User, label: 'Chairperson', color: 'bg-purple-600' };
      case 'treasurer':
        return { icon: Wallet2, label: 'Treasurer', color: 'bg-green-600' };
      case 'secretary':
        return { icon: FileEdit, label: 'Secretary', color: 'bg-orange-600' };
      default:
        return { icon: UserCircle2, label: 'User', color: 'bg-blue-600' };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          bg-[#111827] text-white
          transition-all duration-300 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${sidebarOpen ? 'w-64' : 'md:w-20'}
          w-64 md:w-auto
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="SK Logo" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-xl">SK Naawan IMS</h1>
                <p className="text-xs text-gray-400 mt-1">Activities, Budget & Reporting</p>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center justify-center w-full">
              <img src={logoImage} alt="SK Logo" className="w-8 h-8 object-contain" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-[#059669] text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-[#059669]'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-[#059669]'}`} />
                {(sidebarOpen || window.innerWidth >= 768) && <span>{item.name}</span>}
                {item.badge && sidebarOpen && (
                  <div className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-700/50 space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-xl">
              <div className={`w-8 h-8 rounded-full ${roleInfo.color} flex items-center justify-center`}>
                <RoleIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{user?.fullName || 'SK Official'}</p>
                <p className="text-xs text-gray-400 truncate">SK {roleInfo.label}</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-[#059669] rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5 text-[#059669]" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        {/* Mobile Header Bar */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="SK Logo" className="w-8 h-8 object-contain" />
            <div>
              <h1 className="text-sm">IDMS SK</h1>
              <p className="text-xs text-gray-500">{roleInfo.label}</p>
            </div>
          </div>
          {pendingCount > 0 && user?.role === 'chairperson' && (
            <div className="ml-auto">
              <button
                onClick={() => navigate('/staff/approvals')}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm"
              >
                <Bell className="w-4 h-4" />
                <span>{pendingCount}</span>
              </button>
            </div>
          )}
        </div>
        
        <Outlet />
      </main>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? This will end your session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 mr-2" />
              )}
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}