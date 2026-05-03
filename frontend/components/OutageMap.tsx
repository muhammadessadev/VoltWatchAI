import React from 'react';
import { Map as MapIcon, Navigation } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
}

export const OutageMap: React.FC<Props> = ({ profile }) => {
  // Generate some random "hotspots" for the mock map
  const hotspots = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
    size: Math.random() * 40 + 20,
    intensity: Math.random() > 0.7 ? 'high' : 'medium'
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <MapIcon className="w-6 h-6 text-electric-400 mr-3" />
            <h2 className="text-xl font-bold text-white">Live Outage Map</h2>
          </div>
          <div className="flex items-center text-xs text-slate-400 bg-dark-900 px-3 py-1.5 rounded-full">
            <Navigation className="w-3 h-3 mr-1" />
            {profile.city}
          </div>
        </div>
        <p className="text-sm text-slate-400">Red zones indicate active outages reported by community nearby.</p>
      </div>

      <div className="flex-1 bg-dark-900 rounded-2xl border border-dark-700 relative overflow-hidden min-h-[400px]">
        {/* Mock Map Background (Grid pattern) */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* User Location Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-4 h-4 bg-electric-500 rounded-full border-2 border-dark-950 shadow-[0_0_15px_rgba(234,179,8,0.8)] z-10" />
          <div className="mt-1 bg-dark-950/80 text-xs text-white px-2 py-0.5 rounded backdrop-blur-sm border border-dark-700">
            {profile.area}
          </div>
        </div>

        {/* Outage Hotspots */}
        {hotspots.map(spot => (
          <div
            key={spot.id}
            className={`absolute rounded-full blur-xl mix-blend-screen animate-pulse ${
              spot.intensity === 'high' ? 'bg-rose-600/40' : 'bg-rose-500/20'
            }`}
            style={{
              top: spot.top,
              left: spot.left,
              width: `${spot.size}px`,
              height: `${spot.size}px`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-dark-950/80 backdrop-blur-md border border-dark-700 p-3 rounded-xl text-xs">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/50 mr-2" />
            <span className="text-slate-300">Reported Outage</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-electric-500 mr-2" />
            <span className="text-slate-300">Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};
