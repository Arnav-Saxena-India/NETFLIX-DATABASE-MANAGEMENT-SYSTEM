import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Film, CreditCard, DollarSign, History, Star, BarChart2, Lightbulb, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: Home },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Shows', path: '/admin/shows', icon: Film },
  { name: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
  { name: 'Payments', path: '/admin/payments', icon: DollarSign },
  { name: 'Watch History', path: '/admin/history', icon: History },
  { name: 'Reviews', path: '/admin/reviews', icon: Star },
  { name: 'Reports', path: '/admin/reports', icon: BarChart2 },
  { name: 'Recommendations', path: '/admin/recommend', icon: Lightbulb },
];

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#141414] border-r border-white/5 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <h1 className="text-xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent uppercase tracking-wider">
          APERTURE
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-white border-r-2 border-red-600 bg-red-600/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-red-500' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {onLogout && (
        <div className="border-t border-white/5 p-4">
          <button 
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-500" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
