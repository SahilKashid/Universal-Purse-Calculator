import React from 'react';
import { AIAdvice } from '../types';

interface Props {
  advice: AIAdvice | null;
  loading: boolean;
  onClose: () => void;
}

const ScoutAdvice: React.FC<Props> = ({ advice, loading, onClose }) => {
  if (!loading && !advice) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
        
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            GEMINI SCOUT REPORT
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-zinc-900 rounded-lg text-slate-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse">Analyzing player market and your budget...</p>
          </div>
        ) : advice ? (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <p className="text-slate-300 leading-relaxed italic">"{advice.summary}"</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tactical Recommendations</h4>
                <ul className="space-y-2">
                  {advice.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                      <span className="text-emerald-500">▹</span> {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-slate-500 text-sm font-bold uppercase">Calculated Max Bid</span>
              <span className="text-3xl font-black text-emerald-400 mono">{advice.suggestedMaxBid}</span>
            </div>
            
            <button 
              onClick={onClose}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-bold transition-colors text-white border border-zinc-800"
            >
              Back to Auction
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ScoutAdvice;