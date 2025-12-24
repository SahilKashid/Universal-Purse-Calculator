import React, { useState, useEffect } from 'react';
import { Team } from '../types';

interface Props {
  teams: Team[];
  selectedTeamId: string | null;
  onUndo: (teamId: string, acquisitionId: string) => void;
}

const TransactionHistory: React.FC<Props> = ({ teams, selectedTeamId, onUndo }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'team'>('all');

  // Switch to team view when a team is selected, or revert to 'all' if deselected
  useEffect(() => {
    if (selectedTeamId) {
      setFilterMode('team');
    } else {
      setFilterMode('all');
    }
  }, [selectedTeamId]);

  const allHistory = teams.flatMap(team => 
    team.playersAcquired.map(p => ({ ...p, teamName: team.name, teamId: team.id }))
  ).sort((a, b) => b.timestamp - a.timestamp);

  const filteredHistory = filterMode === 'team' && selectedTeamId
    ? allHistory.filter(h => h.teamId === selectedTeamId)
    : allHistory;

  const selectedTeamName = teams.find(t => t.id === selectedTeamId)?.name;

  return (
    <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <span className="p-1.5 bg-slate-800 rounded-md">📜</span>
          Wire
        </h2>
        
        {selectedTeamId && (
            <div className="flex bg-black rounded-lg p-1 border border-zinc-800">
                <button
                    onClick={() => setFilterMode('all')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterMode === 'all' ? 'bg-zinc-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    ALL
                </button>
                <button
                    onClick={() => setFilterMode('team')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterMode === 'team' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    TEAM
                </button>
            </div>
        )}
      </div>
      
      {filterMode === 'team' && selectedTeamName && (
          <div className="mb-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-bold flex justify-between items-center">
             <span>History: {selectedTeamName}</span>
             <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">{filteredHistory.length} txns</span>
          </div>
      )}
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
        {filteredHistory.length === 0 ? (
          <p className="text-center text-slate-600 py-12 italic">
            {filterMode === 'team' ? "No acquisitions yet" : "No transactions yet"}
          </p>
        ) : (
          filteredHistory.map((item) => (
            <div 
              key={item.id} 
              className="p-3 bg-black/40 rounded-xl border border-zinc-800 flex justify-between items-center group hover:border-zinc-700 transition-colors"
            >
              <div>
                <p className="font-bold text-slate-200">{item.name}</p>
                <p className="text-xs text-slate-500">
                  <span className={`font-semibold ${filterMode === 'team' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {item.teamName}
                  </span> • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-emerald-400 mono">{item.cost}</span>
                <button 
                  onClick={() => onUndo(item.teamId, item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-900/40 text-red-400 rounded transition-all text-xs font-bold"
                  title="Undo Transaction"
                >
                  UNDO
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;