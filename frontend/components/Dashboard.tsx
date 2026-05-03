import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle2, MapPin, BellRing, HelpCircle } from 'lucide-react';
import { UserProfile, ScheduleSlot } from '../types';

interface Props {
  profile: UserProfile;
  schedule: ScheduleSlot[];
}

export const Dashboard: React.FC<Props> = ({ profile, schedule }) => {
  const [reported, setReported] = useState(false);

  const handleReport = () => {
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  };

  // Check if there's an upcoming outage within the next hour (mock logic)
  const hasUpcomingOutage = schedule.length > 0 && schedule[0].status === 'confirmed';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'predicted': return 'bg-electric-500/10 border-electric-500/30 text-electric-400';
      case 'unclear': return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
      default: return 'bg-dark-800 border-dark-700 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'predicted': return <Clock className="w-5 h-5 text-electric-400" />;
      case 'unclear': return <HelpCircle className="w-5 h-5 text-slate-400" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl p-6 border border-dark-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-electric-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Hello, {profile.name || 'User'}</h2>
            <div className="flex items-center text-slate-400 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {profile.area}, {profile.city}
            </div>
          </div>
          <div className="flex items-center bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-medium">Power is ON</span>
          </div>
        </div>
      </div>

      {/* Smart Alert Banner */}
      {hasUpcomingOutage && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-start">
          <div className="bg-rose-500/20 p-2 rounded-full mr-3 mt-0.5">
            <BellRing className="w-5 h-5 text-rose-400 animate-bounce" />
          </div>
          <div>
            <h4 className="text-rose-400 font-bold mb-1">Smart Alert</h4>
            <p className="text-sm text-rose-200/80">
              Push notification sent: "Charge devices now, outage predicted at {schedule[0].start}"
            </p>
          </div>
        </div>
      )}

      {/* Schedule Section */}
      <div>
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-electric-400" />
          Today's Outage Schedule
        </h3>
        <div className="space-y-3">
          {schedule.map((slot, idx) => (
            <div key={idx} className={`rounded-xl p-4 border flex items-center justify-between ${getStatusColor(slot.status)}`}>
              <div className="flex items-center">
                <div className="bg-dark-900/50 p-2 rounded-lg mr-4">
                  {getStatusIcon(slot.status)}
                </div>
                <div>
                  <div className="font-bold text-lg">{slot.start} - {slot.end}</div>
                  <div className="text-xs opacity-80 capitalize">{slot.status} Window</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{slot.confidence}%</div>
                <div className="text-xs opacity-80">Confidence</div>
              </div>
            </div>
          ))}
          {schedule.length === 0 && (
            <div className="text-center py-8 text-slate-500 bg-dark-800 rounded-xl border border-dark-700">
              No outages predicted for today! 🎉
            </div>
          )}
        </div>
      </div>

      {/* Community Action */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 text-center">
        <h4 className="text-white font-medium mb-2">Community Report</h4>
        <p className="text-sm text-slate-400 mb-4">Tap "Outage Now" to confirm. AI updates confidence for your area.</p>
        <button
          onClick={handleReport}
          disabled={reported}
          className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center ${
            reported 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
          }`}
        >
          {reported ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Report Confirmed
            </>
          ) : (
            'Outage Happening Now'
          )}
        </button>
      </div>
    </div>
  );
};
