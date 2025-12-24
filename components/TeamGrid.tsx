import React, { useState } from 'react';
import { Team, AuctionSettings } from '../types';

interface Props {
  teams: Team[];
  settings: AuctionSettings;
  selectedTeamId: string | null;
  onSelectTeam: (id: string) => void;
  onRenameTeam: (id: string, newName: string) => void;
}

const TeamGrid: React.FC<Props> = ({ teams, settings, selectedTeamId, onSelectTeam, onRenameTeam }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (e: React.MouseEvent, team: Team) => {
    e.stopPropagation();
    setEditingId(team.id);
    setEditValue(team.name);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      onRenameTeam(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {teams.map((team) => {
        const remaining = settings.pursePerTeam - team.spent;
        const slotsRemaining = settings.rosterSize - team.playersAcquired.length;
        // Updated: Max bid is now simply the remaining purse, no longer enforcing slot reservation
        const maxBid = remaining; 
        const avgRemaining = slotsRemaining > 0 ? (remaining / slotsRemaining).toFixed(2) : '0.00';
        
        const isSelected = selectedTeamId === team.id;
        const isEditing = editingId === team.id;

        return (
          <div 
            key={team.id}
            onClick={() => onSelectTeam(team.id)}
            className={`
              relative p-5 rounded-2xl border-2 transition-all cursor-pointer group
              ${isSelected ? 'border-zinc-400 bg-slate-800 shadow-xl shadow-zinc-900/40' : 'border-slate-800 bg-slate-800/50 hover:border-slate-700 hover:bg-slate-800'}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0 pr-2">
                {isEditing ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-slate-900 border border-zinc-500 rounded px-1 text-lg font-bold outline-none text-slate-200"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 
                      className="font-bold text-lg truncate text-slate-200"
                      onDoubleClick={(e) => startEditing(e, team)}
                    >
                      {team.name}
                    </h3>
                    <button 
                      onClick={(e) => startEditing(e, team)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded text-slate-500 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </div>
                )}
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Slots: {team.playersAcquired.length} / {settings.rosterSize}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-400 mono">{remaining}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Remaining</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.max(0, (remaining / settings.pursePerTeam) * 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Available</span>
                <span className="font-bold text-zinc-400 mono">{maxBid > 0 ? maxBid : 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Avg / Slot</span>
                <span className="font-bold text-slate-200 mono">{avgRemaining}</span>
              </div>
            </div>

            {slotsRemaining === 0 && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center pointer-events-none">
                <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold text-slate-400 uppercase">
                  Roster Full
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TeamGrid;