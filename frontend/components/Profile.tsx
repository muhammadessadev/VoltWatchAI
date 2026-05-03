import React, { useState } from 'react';
import { User, Save, CheckCircle2, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { CITIES, DISCOS, APPLIANCES } from '../constants';

interface Props {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onLogout: () => void;
}

export const Profile: React.FC<Props> = ({ profile, onUpdate, onLogout }) => {
  const [name, setName] = useState(profile.name || '');
  const [city, setCity] = useState(profile.city);
  const [area, setArea] = useState(profile.area || '');
  const [disco, setDisco] = useState(profile.disco);
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>(profile.appliances);
  const [saved, setSaved] = useState(false);

  const toggleAppliance = (app: string) => {
    setSelectedAppliances(prev =>
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !area.trim()) return;
    onUpdate({ name: name.trim(), city, area: area.trim(), disco, appliances: selectedAppliances });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-electric-400 mr-3" />
          <h2 className="text-xl font-bold text-white">Your Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-electric-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-electric-500 focus:border-transparent outline-none transition-all"
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Area / Neighborhood</label>
            <input
              type="text"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-electric-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Electricity Provider (DISCO)</label>
            <select
              value={disco}
              onChange={(e) => setDisco(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-electric-500 focus:border-transparent outline-none transition-all"
            >
              {DISCOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Major Appliances</label>
            <div className="grid grid-cols-2 gap-3">
              {APPLIANCES.map(app => (
                <label
                  key={app}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedAppliances.includes(app)
                      ? 'bg-electric-500/10 border-electric-500 text-electric-400'
                      : 'bg-dark-900 border-dark-700 text-slate-400 hover:bg-dark-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedAppliances.includes(app)}
                    onChange={() => toggleAppliance(app)}
                  />
                  <span className="text-sm font-medium">{app}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-2">
            <button
              type="submit"
              disabled={saved}
              className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center ${
                saved 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-electric-500 hover:bg-electric-400 text-dark-950 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Profile Updated
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onLogout();
              }}
              className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
