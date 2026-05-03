import React, { useState } from 'react';
import { Zap, ArrowRight, MapPin, Building2, Plug } from 'lucide-react';
import { UserProfile } from '../types';
import { CITIES, DISCOS, APPLIANCES } from '../constants';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [area, setArea] = useState('');
  const [disco, setDisco] = useState(DISCOS[0]);
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);

  const toggleAppliance = (app: string) => {
    setSelectedAppliances(prev =>
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    );
  };

  const handleNext = () => {
    if (step === 2 && (!name.trim() || !area.trim())) return;
    if (step < 4) setStep(step + 1);
    else onComplete({ name: name.trim(), city, area: area.trim(), disco, appliances: selectedAppliances });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950">
      <div className="max-w-md w-full bg-dark-900 rounded-2xl shadow-2xl border border-dark-800 p-8 relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-dark-800">
          <div 
            className="h-full bg-electric-500 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div className="text-center animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-electric-500/20 p-4 rounded-full">
                <Zap className="w-12 h-12 text-electric-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-white">Welcome to VoltWatch</h1>
            <p className="text-slate-400 mb-8 text-lg">"Never be caught off guard again"</p>
            <button
              onClick={handleNext}
              className="w-full bg-electric-500 hover:bg-electric-400 text-dark-950 font-bold py-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center justify-center"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 text-electric-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Location</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-electric-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-electric-500 outline-none"
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Area / Neighborhood</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Gulshan-e-Iqbal, DHA Phase 5"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-electric-500 outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleNext}
              disabled={!name.trim() || !area.trim()}
              className="w-full mt-8 bg-electric-500 hover:bg-electric-400 disabled:opacity-50 text-dark-950 font-bold py-4 rounded-xl transition-colors flex items-center justify-center"
            >
              Next <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center mb-6">
              <Building2 className="w-6 h-6 text-electric-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Provider</h2>
            </div>
            <p className="text-slate-400 mb-6">Select your electricity distribution company (DISCO).</p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {DISCOS.map(d => (
                <button
                  key={d}
                  onClick={() => setDisco(d)}
                  className={`w-full text-left px-4 py-4 rounded-xl border transition-all ${
                    disco === d 
                      ? 'bg-electric-500/10 border-electric-500 text-electric-400' 
                      : 'bg-dark-800 border-dark-700 text-slate-300 hover:bg-dark-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full mt-6 bg-electric-500 hover:bg-electric-400 text-dark-950 font-bold py-4 rounded-xl transition-colors flex items-center justify-center"
            >
              Next <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center mb-6">
              <Plug className="w-6 h-6 text-electric-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Appliances</h2>
            </div>
            <p className="text-slate-400 mb-6">What major appliances do you use? This helps AI plan your schedule.</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {APPLIANCES.map(app => (
                <label
                  key={app}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedAppliances.includes(app)
                      ? 'bg-electric-500/10 border-electric-500 text-electric-400'
                      : 'bg-dark-800 border-dark-700 text-slate-400 hover:bg-dark-700'
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
            <button
              onClick={handleNext}
              className="w-full bg-electric-500 hover:bg-electric-400 text-dark-950 font-bold py-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center justify-center"
            >
              Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
