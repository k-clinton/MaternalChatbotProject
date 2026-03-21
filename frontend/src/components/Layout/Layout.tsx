import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Settings as SettingsIcon, Calendar, Activity, LogOut } from 'lucide-react';
import { cn } from '../../utils/tw';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Vitals History', path: '/vitals', icon: Activity },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Chat Assistant', path: '/chat', icon: MessageCircle },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen flex bg-maternal-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-maternal-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-maternal-800 tracking-tight flex items-center">
            <span className="bg-maternal-600 text-white p-1 rounded-lg mr-2">MC</span>
            MaternalCare
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-maternal-600 text-white shadow-sm"
                    : "text-maternal-600 hover:bg-maternal-100 hover:text-maternal-800"
                )}
              >
                <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-maternal-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-maternal-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center overflow-hidden">
              <div className="h-10 w-10 shrink-0 rounded-full bg-maternal-100 flex items-center justify-center text-maternal-700 font-bold border-2 border-white shadow-sm">
                {user ? getInitials(user.name) : '??'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold text-maternal-900 truncate">{user?.name || 'Guest'}</p>
                <p className="text-xs text-maternal-600 font-medium">Week {user?.weeksPregnant || '?'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-maternal-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
