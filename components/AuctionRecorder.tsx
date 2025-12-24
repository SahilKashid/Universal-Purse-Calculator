import React, { useState } from 'react';
import { Team, AuctionSettings } from '../types';

interface Props {
  selectedTeam: Team | null;
  settings: AuctionSettings;
  onRecord: (playerName: string, cost: number) => void;
}

const AuctionRecorder: React.FC<Props> = ({ selectedTeam, settings, onRecord }) => {
  const [cost, setCost] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !cost) return;
    
    const bidValue = Number(cost);
    const remaining = settings.pursePerTeam - selectedTeam.spent;

    if (bidValue < settings.minBid) {
      alert(`Minimum bid is ${settings.minBid}`);
      return;
    }
    
    // Updated: The only limit is the actual remaining budget. 
    // We no longer reserve money for other roster slots.
    if (bidValue > remaining) {
      alert(`Insufficient funds. Only ${remaining} remaining.`);
      return;
    }

    // Default to a generic name since the specific target name field was removed
    const genericName = `Slot #${selectedTeam.playersAcquired.length + 1}`;
    onRecord(genericName, bidValue);
    setCost('');
  };

  return (
    <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 shadow-xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        <span className="p-1.5 bg-emerald-500/20 rounded-md">🔨</span>
        Active Hammer
      </h2>

      {!selectedTeam ? (
        <div className="text-center py-8 text-slate-600 border-2 border-dashed border-zinc-800 rounded-xl">
          <p className="text-sm">Select a team from the dashboard to record a bid</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-black/50 rounded-xl border border-zinc-800">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Recording for:</p>
            <p className="font-bold text-emerald-400">{selectedTeam.name}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Winning Bid</label>
            <input 
              type="number"
              placeholder="0"
              autoFocus
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 text-2xl font-bold text-emerald-400 mono focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Record Bid</span>
            <span className="text-sm opacity-50">Enter ↵</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default AuctionRecorder;