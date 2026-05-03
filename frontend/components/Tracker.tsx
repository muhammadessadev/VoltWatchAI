import React from 'react';
import { Battery, BatteryCharging, Fuel, AlertCircle } from 'lucide-react';
import { TrackerState } from '../types';

interface Props {
  state: TrackerState;
  onChange: (newState: TrackerState) => void;
}

export const Tracker: React.FC<Props> = ({ state, onChange }) => {
  const upsHours = Math.round((state.upsBattery / 100) * 4);
  const genHours = Math.round(state.generatorFuel * 1.5);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <div className="flex items-center mb-6">
          <BatteryCharging className="w-6 h-6 text-electric-400 mr-3" />
          <h2 className="text-xl font-bold text-white">Backup Power Tracker</h2>
        </div>

        {/* UPS Section */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <label className="text-sm font-medium text-slate-300 flex items-center">
              <Battery className="w-4 h-4 mr-2 text-slate-400" />
              UPS Battery Capacity
            </label>
            <span className="text-electric-400 font-bold">{state.upsBattery}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.upsBattery}
            onChange={(e) => onChange({ ...state, upsBattery: parseInt(e.target.value) })}
            className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-electric-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Empty</span>
            <span>Full</span>
          </div>
          <div className="mt-3 text-sm text-slate-400 bg-dark-900/50 p-3 rounded-lg border border-dark-700 flex items-start">
            <div className="bg-electric-500/10 p-1.5 rounded mr-3 mt-0.5">
              <BatteryCharging className="w-4 h-4 text-electric-400" />
            </div>
            <div>
              <p>AI estimates backup time per outage slot:</p>
              <strong className="text-white text-lg">{upsHours} hours remaining</strong>
            </div>
          </div>
        </div>

        <hr className="border-dark-700 mb-8" />

        {/* Generator Section */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="text-sm font-medium text-slate-300 flex items-center">
              <Fuel className="w-4 h-4 mr-2 text-slate-400" />
              Generator Log (Fuel)
            </label>
            <span className="text-electric-400 font-bold">{state.generatorFuel} L</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={state.generatorFuel}
            onChange={(e) => onChange({ ...state, generatorFuel: parseInt(e.target.value) })}
            className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-electric-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>0L</span>
            <span>50L</span>
          </div>
          
          <div className="mt-3 text-sm text-slate-400 bg-dark-900/50 p-3 rounded-lg border border-dark-700 flex items-start">
            <div className="bg-electric-500/10 p-1.5 rounded mr-3 mt-0.5">
              <Fuel className="w-4 h-4 text-electric-400" />
            </div>
            <div>
              <p>AI calculates hours left:</p>
              <strong className="text-white text-lg">{genHours} hours remaining</strong>
            </div>
          </div>

          {state.generatorFuel < 5 && (
            <div className="mt-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Low-fuel alert: Please refill soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
