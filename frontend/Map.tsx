import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Navigation, Loader2 } from 'lucide-react';
import { useUser } from './UserContext';
import { fetchActiveOutages } from './geminiService';

interface OutageMarker {
  area: string;
  x: number;
  y: number;
}

export const Map = () => {
  const { profile } = useUser();
  const [outages, setOutages] = useState<OutageMarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOutages = async () => {
      if (profile?.city) {
        setLoading(true);
        const activeAreas = await fetchActiveOutages(profile.city);
        
        // Map the fetched areas to random coordinates on our simulated map grid
        const mappedOutages = activeAreas.map(area => ({
          area,
          x: 15 + Math.random() * 70, // Keep within 15% to 85% bounds
          y: 15 + Math.random() * 70
        }));
        
        setOutages(mappedOutages);
        setLoading(false);
      }
    };

    loadOutages();
  }, [profile?.city]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-volt-panel border border-volt-border rounded-2xl p-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <MapIcon className="w-6 h-6 text-volt-yellow" />
            <h2 className="text-xl font-bold text-white">Live Outage Map</h2>
          </div>
          <p className="text-volt-muted text-sm">Red zones indicate active outages reported by community nearby.</p>
        </div>
        <div className="bg-volt-dark border border-volt-border px-3 py-1.5 rounded-full flex items-center gap-2 text-sm text-volt-text">
            <Navigation className="w-3 h-3" />
            {profile?.city}
        </div>
      </div>

      <div className="flex-1 bg-volt-panel border border-volt-border rounded-2xl relative overflow-hidden min-h-[400px]">
        <div 
            className="absolute inset-0 opacity-10"
            style={{
                backgroundImage: 'linear-gradient(#2d3748 1px, transparent 1px), linear-gradient(90deg, #2d3748 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}
        ></div>
        
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-volt-muted">
            <Loader2 className="w-8 h-8 animate-spin text-volt-yellow mb-2" />
            <p>Scanning for active outages in {profile?.city}...</p>
          </div>
        ) : (
          <>
            {/* Dynamic Outage Markers */}
            {outages.map((outage, idx) => (
              <div 
                key={idx} 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${outage.x}%`, top: `${outage.y}%` }}
              >
                <div className="absolute w-32 h-32 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: `${idx * 0.5}s` }}></div>
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] z-10"></div>
                <div className="mt-1 bg-volt-dark/80 backdrop-blur-sm border border-red-900/50 px-2 py-0.5 rounded text-[10px] text-red-200 font-medium whitespace-nowrap z-20">
                    {outage.area}
                </div>
              </div>
            ))}

            {/* User Location Marker (Center) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30">
                <div className="w-4 h-4 bg-volt-yellow rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)] border-2 border-black"></div>
                <div className="mt-2 bg-volt-dark border border-volt-border px-2 py-1 rounded text-xs text-white font-medium">
                    {profile?.area} (You)
                </div>
            </div>
          </>
        )}

        <div className="absolute bottom-4 right-4 bg-volt-dark border border-volt-border rounded-lg p-3 space-y-2 z-40">
            <div className="flex items-center gap-2 text-xs text-volt-text">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                Reported Outage
            </div>
            <div className="flex items-center gap-2 text-xs text-volt-text">
                <div className="w-3 h-3 rounded-full bg-volt-yellow"></div>
                Your Location
            </div>
        </div>
      </div>
    </div>
  );
};
