import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Lightbulb, MessageSquare, Map as MapIcon, Battery, BarChart2, User, Zap } from 'lucide-react';
import { useUser } from './UserContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: Home, label: 'Home', exact: true },
  { path: '/dashboard/planner', icon: Lightbulb, label: 'Planner' },
  { path: '/dashboard/chat', icon: MessageSquare, label: 'AI Chat' },
  { path: '/dashboard/map', icon: MapIcon, label: 'Map' },
  { path: '/dashboard/tracker', icon: Battery, label: 'Tracker' },
  { path: '/dashboard/reports', icon: BarChart2, label: 'Reports' },
  { path: '/dashboard/profile', icon: User, label: 'Profile' },
];

export const DashboardLayout = () => {
  const { profile } = useUser();
  const location = useLocation();

  if (!profile) return null;

  return (
    <div className="flex h-screen bg-volt-dark overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-volt-dark border-r border-volt-border flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-volt-yellow p-2 rounded-lg">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold text-white">VoltWatch</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);
                
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-volt-panel text-volt-yellow' 
                    : 'text-volt-muted hover:bg-volt-panelHover hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-volt-panel rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white font-bold">
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-medium truncate">{profile.name}</p>
              <p className="text-volt-muted text-xs truncate">{profile.area}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-volt-dark p-8">
        <div className="max-w-4xl mx-auto">
            <Outlet />
        </div>
      </main>
    </div>
  );
};
