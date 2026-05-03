import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, MapPin, Building2, Plug } from 'lucide-react';
import { useUser } from './UserContext';
import { CITIES, PROVIDERS, APPLIANCES } from './types';

const CardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="bg-volt-panel border-t-4 border-volt-yellow rounded-xl shadow-2xl w-full max-w-md p-8">
      {children}
    </div>
  </div>
);

export const Welcome = () => {
  const navigate = useNavigate();
  return (
    <CardLayout>
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-yellow-900/30 rounded-full flex items-center justify-center">
          <Zap className="w-10 h-10 text-volt-yellow" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to VoltWatch</h1>
          <p className="text-volt-muted">"Never be caught off guard again"</p>
        </div>
        <button
          onClick={() => navigate('/location')}
          className="w-full bg-volt-yellow hover:bg-volt-yellowHover text-black font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Get Started <span className="text-xl">→</span>
        </button>
      </div>
    </CardLayout>
  );
};

export const LocationSetup = () => {
  const navigate = useNavigate();
  const { updateProfile, profile } = useUser();
  const [name, setName] = useState(profile?.name || '');
  const [city, setCity] = useState(profile?.city || CITIES[0]);
  const [area, setArea] = useState(profile?.area || '');

  const handleNext = () => {
    if (name && area) {
      updateProfile({ name, city, area });
      navigate('/provider');
    }
  };

  return (
    <CardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="text-volt-yellow w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Location</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-volt-text mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-volt-dark border border-volt-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-volt-yellow transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-volt-text mb-1">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-volt-dark border border-volt-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-volt-yellow transition-colors appearance-none"
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-volt-text mb-1">Area / Neighborhood</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Gulshan-e-Iqbal, DHA Phase 5"
              className="w-full bg-volt-dark border border-volt-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-volt-yellow transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!name || !area}
          className="w-full bg-volt-yellow hover:bg-volt-yellowHover disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-8"
        >
          Next <span>→</span>
        </button>
      </div>
    </CardLayout>
  );
};

export const ProviderSetup = () => {
  const navigate = useNavigate();
  const { updateProfile, profile } = useUser();
  const [provider, setProvider] = useState(profile?.provider || PROVIDERS[0]);

  const handleNext = () => {
    updateProfile({ provider });
    navigate('/appliances');
  };

  return (
    <CardLayout>
      <div className="space-y-6 flex flex-col h-[500px]">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="text-volt-yellow w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Provider</h2>
        </div>
        <p className="text-volt-muted text-sm">Select your electricity distribution company (DISCO).</p>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {PROVIDERS.map(p => (
            <button
              key={p}
              onClick={() => setProvider(p)}
              className={`w-full text-left px-4 py-4 rounded-lg border transition-all ${
                provider === p 
                  ? 'border-volt-yellow bg-volt-dark text-volt-yellow' 
                  : 'border-volt-border bg-volt-dark text-white hover:border-gray-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-volt-yellow hover:bg-volt-yellowHover text-black font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shrink-0"
        >
          Next <span>→</span>
        </button>
      </div>
    </CardLayout>
  );
};

export const ApplianceSetup = () => {
  const navigate = useNavigate();
  const { updateProfile, profile } = useUser();
  const [selected, setSelected] = useState<string[]>(profile?.appliances || []);

  const toggleAppliance = (app: string) => {
    setSelected(prev => 
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    );
  };

  const handleFinish = () => {
    // Fixed: Use updateProfile to ensure state is saved correctly before navigating
    updateProfile({ appliances: selected });
    navigate('/dashboard');
  };

  return (
    <CardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Plug className="text-volt-yellow w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Appliances</h2>
        </div>
        <p className="text-volt-muted text-sm">What major appliances do you use? This helps AI plan your schedule.</p>
        
        <div className="grid grid-cols-2 gap-3">
          {APPLIANCES.map(app => (
            <button
              key={app}
              onClick={() => toggleAppliance(app)}
              className={`px-3 py-4 rounded-lg border text-sm text-left transition-all ${
                selected.includes(app)
                  ? 'border-volt-yellow bg-volt-dark text-volt-yellow' 
                  : 'border-volt-border bg-volt-dark text-volt-text hover:border-gray-500'
              }`}
            >
              {app}
            </button>
          ))}
        </div>

        <button
          onClick={handleFinish}
          className="w-full bg-volt-yellow hover:bg-volt-yellowHover text-black font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-8"
        >
          Go to Dashboard <span>→</span>
        </button>
      </div>
    </CardLayout>
  );
};
