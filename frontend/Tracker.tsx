import React, { useState, useEffect } from 'react';
import { Battery, BatteryCharging, Fuel } from 'lucide-react';
import { useUser } from './UserContext';

export const Tracker = () => {
  const { isPowerOn } = useUser();
  
  // Initialize state from localStorage to persist across reloads
  const [battery, setBattery] = useState(() => Number(localStorage.getItem('vw_battery') || 80));
  const [fuel, setFuel] = useState(() => Number(localStorage.getItem('vw_fuel') || 15));
  const [lastUpdated, setLastUpdated] = useState(() => Number(localStorage.getItem('vw_lastUpdated') || Date.now()));

  // Catch up on missed time when component mounts or power state changes
  useEffect(() => {
    const now = Date.now();
    const elapsedSeconds = (now - lastUpdated) / 1000;

    if (elapsedSeconds > 0) {
      if (!isPowerOn) {
        // Drain: 100% battery = 4 hours = 14400 seconds. Drain per second = 100 / 14400
        const batteryDrain = elapsedSeconds * (100 / 14400);
        // Fuel: 50L = 72 hours = 259200 seconds. Drain per second = 50 / 259200
        const fuelDrain = elapsedSeconds * (50 / 259200);

        setBattery(prev => Math.max(0, prev - batteryDrain));
        setFuel(prev => Math.max(0, prev - fuelDrain));
      } else {
        // Charge battery: 0 to 100 in 2 hours = 7200 seconds. Charge per second = 100 / 7200
        const batteryCharge = elapsedSeconds * (100 / 7200);
        setBattery(prev => Math.min(100, prev + batteryCharge));
      }
    }
    setLastUpdated(now);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPowerOn]);

  // Live updates interval
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setLastUpdated(now);
      localStorage.setItem('vw_lastUpdated', now.toString());

      if (!isPowerOn) {
        setBattery(prev => {
          const next = Math.max(0, prev - (100 / 14400));
          localStorage.setItem('vw_battery', next.toString());
          return next;
        });
        setFuel(prev => {
          const next = Math.max(0, prev - (50 / 259200));
          localStorage.setItem('vw_fuel', next.toString());
          return next;
        });
      } else {
        setBattery(prev => {
          const next = Math.min(100, prev + (100 / 7200));
          localStorage.setItem('vw_battery', next.toString());
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPowerOn]);

  // Manual override handlers
  const handleBatteryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBattery(val);
    localStorage.setItem('vw_battery', val.toString());
  };

  const handleFuelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setFuel(val);
    localStorage.setItem('vw_fuel', val.toString());
  };

  const batteryHours = (battery / 100) * 4; 
  const fuelHours = (fuel / 50) * 72; 

  return (
    <div className="space-y-6">
      <div className="bg-volt-panel border border-volt-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-8">
          <BatteryCharging className="w-6 h-6 text-volt-yellow" />
          <h2 className="text-xl font-bold text-white">Backup Power Tracker</h2>
        </div>

        {/* UPS Section */}
        <div className="space-y-4 mb-10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-volt-text flex items-center gap-2"><Battery className="w-4 h-4"/> UPS Battery Capacity</span>
            <span className="text-volt-yellow font-bold">{Math.round(battery)}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={battery} 
            onChange={handleBatteryChange}
            className="w-full h-2 bg-volt-dark rounded-lg appearance-none cursor-pointer accent-volt-yellow"
          />
          <div className="flex justify-between text-xs text-volt-muted">
            <span>Empty</span>
            <span>Full</span>
          </div>
          
          <div className="bg-volt-dark border border-volt-border rounded-xl p-4 flex items-start gap-3 mt-2">
             <BatteryCharging className="w-5 h-5 text-volt-yellow shrink-0 mt-0.5" />
             <div>
                 <p className="text-volt-muted text-sm">AI estimates backup time per outage slot:</p>
                 <p className="text-white font-bold text-lg">{batteryHours.toFixed(1)} hours remaining</p>
             </div>
          </div>
        </div>

        <hr className="border-volt-border mb-8" />

        {/* Generator Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-volt-text flex items-center gap-2"><Fuel className="w-4 h-4"/> Generator Log (Fuel)</span>
            <span className="text-volt-yellow font-bold">{fuel.toFixed(1)} L</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="50" 
            value={fuel} 
            onChange={handleFuelChange}
            className="w-full h-2 bg-volt-dark rounded-lg appearance-none cursor-pointer accent-volt-yellow"
          />
          <div className="flex justify-between text-xs text-volt-muted">
            <span>0L</span>
            <span>50L</span>
          </div>

          <div className="bg-volt-dark border border-volt-border rounded-xl p-4 flex items-start gap-3 mt-2">
             <Fuel className="w-5 h-5 text-volt-yellow shrink-0 mt-0.5" />
             <div>
                 <p className="text-volt-muted text-sm">AI calculates hours left:</p>
                 <p className="text-white font-bold text-lg">{Math.floor(fuelHours)} hours remaining</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
