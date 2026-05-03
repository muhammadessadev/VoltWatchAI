import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useUser } from './UserContext';
import { CITIES, PROVIDERS, APPLIANCES } from './types';

export const Profile = () => {
  const { profile, updateProfile, logout } = useUser();

  if (!profile) return null;

  const toggleAppliance = (app: string) => {
    const current = profile.appliances || [];
    const updated = current.includes(app) 
        ? current.filter(a => a !== app)
        : [...current, app];
    updateProfile({ appliances: updated });
  };

  return (
    <div className="bg-volt-panel border border-volt-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-volt-yellow" />
          <h2 className="text-xl font-bold text-white">Your Profile</h2>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-volt-text mb-1">Your Name</label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => updateProfile({ name: e.target.value })}
            className="w-full bg-volt-dark border border-volt-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-volt-yellow transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-volt-text mb-1">City</label>
          <select
            value={profile.city || CITIES[0]}
            onChange={(e) => updateProfile({ city: e.target.value })}
            className="w-full bg-volt-dark border border-volt-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-volt-yellow transition-colors appearance-none"
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-volt-text mb-1">Area / Neighborhood</label>
          <input
            type="text"
            value={profile.area || ''}
            onChange={(e) => updateProfile({ area: e.target.value })}
            className="w-full bg-volt-dark border border-volt-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-volt-yellow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-volt-text mb-1">Electricity Provider (DISCO)</label>
          <select
            value={profile.provider || PROVIDERS[0]}
            onChange={(e) => updateProfile({ provider: e.target.value })}
            className="w-full bg-volt-dark border border-volt-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-volt-yellow transition-colors appearance-none"
          >
            {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-volt-text mb-3">Major Appliances</label>
          <div className="grid grid-cols-2 gap-3">
            {APPLIANCES.map(app => (
              <button
                key={app}
                onClick={() => toggleAppliance(app)}
                className={`px-3 py-3 rounded-lg border text-sm text-left transition-all ${
                  (profile.appliances || []).includes(app)
                    ? 'border-volt-yellow bg-volt-dark text-volt-yellow' 
                    : 'border-volt-border bg-volt-dark text-volt-text hover:border-gray-500'
                }`}
              >
                {app}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-volt-border">
          <button 
            onClick={logout}
            className="w-full bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-400 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
