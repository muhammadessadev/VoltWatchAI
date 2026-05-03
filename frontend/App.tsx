import React, { useState, useEffect } from 'react';
import { Home, Lightbulb, MessageSquare, BarChart2, User as UserIcon, Map as MapIcon, Battery } from 'lucide-react';
import { UserProfile, TabType, ScheduleSlot, TrackerState } from './types';
import { generateMockSchedule } from './constants';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { SmartPlanner } from './components/SmartPlanner';
import { AIChat } from './components/AIChat';
import { OutageMap } from './components/OutageMap';
import { Tracker } from './components/Tracker';
import { WeeklyReport } from './components/WeeklyReport';
import { Profile } from './components/Profile';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('voltwatch_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [trackerState, setTrackerState] = useState<TrackerState>({ upsBattery: 80, generatorFuel: 15 });

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('voltwatch_profile', JSON.stringify(newProfile));
  };

  const handleLogout = () => {
    setProfile(null);
    localStorage.removeItem('voltwatch_profile');
    setActiveTab('dashboard');
  };

  useEffect(() => {
    if (!profile) return;
    
    const updateSchedule = () => {
      setSchedule(generateMockSchedule(profile.city, profile.disco));
    };

    updateSchedule();
    const interval = setInterval(updateSchedule, 60000 * 60); 
    
    return () => clearInterval(interval);
  }, [profile]);

  if (!profile) {
    return <Onboarding onComplete={handleUpdateProfile} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard profile={profile} schedule={schedule} />;
      case 'planner':
        return <SmartPlanner profile={profile} schedule={schedule} />;
      case 'chat':
        return <AIChat profile={profile} schedule={schedule} upsHours={Math.round((trackerState.upsBattery / 100) * 4)} />;
      case 'map':
        return <OutageMap profile={profile} />;
      case 'tracker':
        return <Tracker state={trackerState} onChange={setTrackerState} />;
      case 'reports':
        return <WeeklyReport />;
      case 'profile':
        return <Profile profile={profile} onUpdate={handleUpdateProfile} onLogout={handleLogout} />;
      default:
        return <Dashboard profile={profile} schedule={schedule} />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'planner', icon: Lightbulb, label: 'Planner' },
    { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
    { id: 'map', icon: MapIcon, label: 'Map' },
    { id: 'tracker', icon: Battery, label: 'Tracker' },
    { id: 'reports', icon: BarChart2, label: 'Reports' },
    { id: 'profile', icon: UserIcon, label: 'Profile' },
  ] as const;

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-dark-900 border-b border-dark-800 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-electric-500 rounded-lg flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(234,179,8,0.4)]">
            <Lightbulb className="w-5 h-5 text-dark-950" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">VoltWatch</h1>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-900 border-r border-dark-800 h-screen sticky top-0">
        <div className="p-6 flex items-center">
          <div className="w-10 h-10 bg-electric-500 rounded-xl flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
            <Lightbulb className="w-6 h-6 text-dark-950" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">VoltWatch</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-electric-500/10 text-electric-400 font-medium' 
                    : 'text-slate-400 hover:bg-dark-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-electric-400' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-dark-800">
          <div className="bg-dark-800 rounded-xl p-4 flex items-center">
            <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center text-slate-300 font-bold mr-3 uppercase shrink-0">
              {profile.name ? profile.name.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{profile.name}</p>
              <p className="text-xs text-slate-400 truncate">{profile.area}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-3xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Nav (Scrollable for many items) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-800 pb-safe z-20 overflow-x-auto hide-scrollbar">
        <div className="flex p-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center p-2 rounded-lg min-w-[72px] ${
                  isActive ? 'text-electric-400' : 'text-slate-500'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-electric-500/20' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Add CSS to hide scrollbar for mobile nav */}
      <style dangerouslySetContent={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default App;
