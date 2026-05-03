import React, { useState } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useUser } from './UserContext';
import { generatePlannerAdvice } from './geminiService';

export const Planner = () => {
  const { profile, todaySchedule } = useUser();
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!profile) return;
    setLoading(true);
    const result = await generatePlannerAdvice(profile, todaySchedule);
    setPlan(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-volt-panel border border-volt-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-6 h-6 text-volt-yellow" />
          <h2 className="text-xl font-bold text-white">AI Smart Planner</h2>
        </div>
        <p className="text-volt-muted text-sm mb-6">
          Get personalized advice on when to run your appliances based on today's load shedding schedule.
        </p>
        <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-volt-yellow hover:bg-volt-yellowHover text-black font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      {plan && (
        <div className="bg-volt-panel border border-volt-border rounded-2xl p-6 flex-1 overflow-y-auto custom-scrollbar">
          <h3 className="text-xs font-bold text-volt-muted uppercase tracking-wider mb-4">Your Action Plan</h3>
          <div className="prose prose-invert max-w-none text-volt-text whitespace-pre-wrap">
            {plan.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={i} className="text-volt-yellow font-bold mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
                }
                if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                        <p key={i} className="mb-2">
                            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : part)}
                        </p>
                    )
                }
                return <p key={i} className="mb-2">{line}</p>;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
