
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../../utils/tw';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Chat Assistant', path: '/chat', icon: MessageCircle },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex bg-maternal-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-maternal-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-maternal-800 tracking-tight">MaternalCare</h1>
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
                    ? "bg-maternal-500 text-white shadow-sm"
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
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-maternal-300 flex items-center justify-center text-maternal-800 font-semibold">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-maternal-900">Jane Doe</p>
              <p className="text-xs text-maternal-600">Week 24</p>
            </div>
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
