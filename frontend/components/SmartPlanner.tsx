import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { UserProfile, ScheduleSlot } from '../types';
import { getSmartAdvice } from '../services/geminiService';

interface Props {
  profile: UserProfile;
  schedule: ScheduleSlot[];
}

export const SmartPlanner: React.FC<Props> = ({ profile, schedule }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getSmartAdvice(profile, schedule);
    setAdvice(result);
    setLoading(false);
  };

  // Format simple markdown-like text (bolding)
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-electric-400">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="bg-gradient-to-r from-electric-900/40 to-dark-800 rounded-2xl p-6 border border-electric-500/20">
        <div className="flex items-center mb-4">
          <Sparkles className="w-6 h-6 text-electric-400 mr-3" />
          <h2 className="text-xl font-bold text-white">AI Smart Planner</h2>
        </div>
        <p className="text-slate-300 text-sm mb-6">
          Get personalized advice on when to run your appliances based on today's load shedding schedule.
        </p>
        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="w-full bg-electric-500 hover:bg-electric-400 text-dark-950 font-bold py-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing Schedule...
            </>
          ) : (
            'Generate Plan'
          )}
        </button>
      </div>

      {advice && (
        <div className="flex-1 bg-dark-800 rounded-2xl p-6 border border-dark-700 overflow-y-auto">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Action Plan</h3>
          <div className="space-y-4 text-slate-200 leading-relaxed">
            {advice.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? <p key={idx}>{formatText(paragraph)}</p> : null
            ))}
          </div>
        </div>
      )}
      
      {!advice && !loading && (
        <div className="flex-1 flex items-center justify-center text-slate-500 border-2 border-dashed border-dark-700 rounded-2xl p-6 text-center">
          Tap the button above to get your AI-powered daily plan.
        </div>
      )}
    </div>
  );
};
