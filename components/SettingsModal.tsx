import React, { useState } from 'react';
import { AuctionSettings } from '../types';

interface Props {
  settings: AuctionSettings;
  onSave: (settings: AuctionSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<Props> = ({ settings, onSave, isOpen, onClose }) => {
  const [tempSettings, setTempSettings] = useState<AuctionSettings>(settings);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
        
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <span className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">⚙️</span>
          Auction Setup
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sport / League Name</label>
            <input 
              type="text"
              value={tempSettings.sportName}
              onChange={(e) => setTempSettings({...tempSettings, sportName: e.target.value})}
              className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-200"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Purse per Team</label>
              <input 
                type="number"
                value={tempSettings.pursePerTeam}
                onChange={(e) => setTempSettings({...tempSettings, pursePerTeam: Number(e.target.value)})}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-200 mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team Count</label>
              <input 
                type="number"
                value={tempSettings.teamCount}
                onChange={(e) => setTempSettings({...tempSettings, teamCount: Number(e.target.value)})}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-200 mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Roster Size</label>
              <input 
                type="number"
                value={tempSettings.rosterSize}
                onChange={(e) => setTempSettings({...tempSettings, rosterSize: Number(e.target.value)})}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-200 mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Min Bid</label>
              <input 
                type="number"
                value={tempSettings.minBid}
                onChange={(e) => setTempSettings({...tempSettings, minBid: Number(e.target.value)})}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-200 mono"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-zinc-700 rounded-xl hover:bg-zinc-800 transition-colors text-slate-400 font-bold text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(tempSettings)}
            className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white transition-all shadow-lg shadow-emerald-900/20 text-sm"
          >
            Start Auction
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;