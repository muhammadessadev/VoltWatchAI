import React, { useState, useEffect } from 'react';
import { BarChart2, Loader2 } from 'lucide-react';
import { useUser } from './UserContext';
import { generateWeeklyReport } from './geminiService';

export const Reports = () => {
  const { profile } = useUser();
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (profile) {
        const result = await generateWeeklyReport(profile);
        setReport(result);
        setLoading(false);
      }
    };
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-volt-panel border border-volt-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <BarChart2 className="w-6 h-6 text-volt-yellow" />
          <h2 className="text-xl font-bold text-white">Weekly Insights</h2>
        </div>
        <p className="text-volt-muted text-sm">
          AI analysis of your load shedding patterns.
        </p>
      </div>

      <div className="bg-volt-panel border border-volt-border rounded-2xl p-6 flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-volt-muted space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-volt-yellow" />
                <p>Analyzing past week's data...</p>
            </div>
        ) : (
            <div className="prose prose-invert max-w-none text-volt-text whitespace-pre-wrap">
                {report?.split('\n').map((line, i) => {
                    if (line.includes('**')) {
                        const parts = line.split('**');
                        return (
                            <p key={i} className="mb-3">
                                {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : part)}
                            </p>
                        )
                    }
                    if (line.trim().startsWith('*')) {
                        return <li key={i} className="ml-4 mb-2">{line.replace('*', '').trim()}</li>
                    }
                    return <p key={i} className="mb-3">{line}</p>;
                })}
            </div>
        )}
      </div>
    </div>
  );
};
