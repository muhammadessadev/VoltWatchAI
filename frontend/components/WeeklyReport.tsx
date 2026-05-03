import React, { useState, useEffect } from 'react';
import { BarChart3, Loader2 } from 'lucide-react';
import { generateWeeklyReport } from '../services/geminiService';
import { generateMockWeeklyData } from '../constants';

export const WeeklyReport: React.FC = () => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const mockData = generateMockWeeklyData();
      const result = await generateWeeklyReport(mockData);
      setReport(result);
      setLoading(false);
    };
    fetchReport();
  }, []);

  const formatMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('##')) {
        return <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">{line.replace(/#/g, '').trim()}</h3>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <li key={i} className="ml-4 mb-1 text-slate-300">{line.substring(2)}</li>;
      }
      // Bold text
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-electric-400">{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
      });
      
      return line.trim() ? <p key={i} className="mb-2 text-slate-300">{formattedLine}</p> : null;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
        <div className="flex items-center mb-2">
          <BarChart3 className="w-6 h-6 text-electric-400 mr-3" />
          <h2 className="text-xl font-bold text-white">Weekly Insights</h2>
        </div>
        <p className="text-sm text-slate-400">AI analysis of your load shedding patterns.</p>
      </div>

      <div className="flex-1 bg-dark-800 rounded-2xl p-6 border border-dark-700 overflow-y-auto">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-electric-500" />
            <p>Analyzing your weekly data...</p>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            {report ? formatMarkdown(report) : <p>Failed to load report.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
