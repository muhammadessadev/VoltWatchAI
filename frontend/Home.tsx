import React from 'react';
import { MapPin, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { useUser } from './UserContext';

export const Home = () => {
  const { profile, isPowerOn, setIsPowerOn, todaySchedule, isLoadingSchedule } = useUser();

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-volt-panel border border-volt-border rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Hello, {profile.name}</h1>
          <div className="flex items-center text-volt-muted text-sm gap-1">
            <MapPin className="w-4 h-4" />
            <span>{profile.area}, {profile.city}</span>
          </div>
        </div>
        <button 
            onClick={() => setIsPowerOn(!isPowerOn)}
            className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-medium transition-colors ${
                isPowerOn 
                ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' 
                : 'bg-red-900/30 border-red-500/50 text-red-400'
            }`}
        >
          <div className={`w-2 h-2 rounded-full ${isPowerOn ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
          Power is {isPowerOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Schedule Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-volt-yellow" />
          <h2 className="text-lg font-semibold text-white">Today's Outage Schedule</h2>
        </div>

        {isLoadingSchedule ? (
          <div className="flex flex-col items-center justify-center py-8 text-volt-muted space-y-3 bg-volt-panel border border-volt-border rounded-xl">
            <Loader2 className="w-6 h-6 animate-spin text-volt-yellow" />
            <p className="text-sm">Fetching real-time schedule for {profile.area}...</p>
          </div>
        ) : todaySchedule.length > 0 ? (
          <div className="space-y-3">
            {todaySchedule.map((slot) => (
              <div 
                  key={slot.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                      slot.type === 'Predicted' 
                      ? 'bg-yellow-900/10 border-yellow-700/50' 
                      : 'bg-red-900/10 border-red-900/50'
                  }`}
              >
                <div className="flex items-center gap-4">
                  {slot.type === 'Predicted' ? (
                      <Clock className="w-5 h-5 text-yellow-500" />
                  ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <p className={`font-bold text-lg ${slot.type === 'Predicted' ? 'text-yellow-500' : 'text-red-400'}`}>
                      {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-volt-muted text-sm">{slot.type} Window</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${slot.type === 'Predicted' ? 'text-yellow-500' : 'text-red-400'}`}>
                      {slot.confidence}%
                  </p>
                  <p className="text-volt-muted text-sm">Confidence</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl border bg-volt-panel border-volt-border text-center text-volt-muted">
            No schedule data available for today.
          </div>
        )}
      </div>

      {/* Community Report */}
      <div className="bg-volt-panel border border-volt-border rounded-2xl p-6 text-center mt-8">
        <h3 className="text-white font-semibold mb-2">Community Report</h3>
        <p className="text-volt-muted text-sm mb-4">Tap "Outage Now" to confirm. AI updates confidence for your area.</p>
        <button className="w-full bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-400 font-medium py-3 rounded-xl transition-colors">
          Outage Happening Now
        </button>
      </div>
    </div>
  );
};
