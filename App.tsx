import React, { useState, useEffect, useCallback } from 'react';
import { AuctionSettings, Team, AIAdvice } from './types';
import { DEFAULT_SETTINGS, COLOR_PALETTE } from './constants';
import SettingsModal from './components/SettingsModal';
import TeamGrid from './components/TeamGrid';
import AuctionRecorder from './components/AuctionRecorder';
import TransactionHistory from './components/TransactionHistory';
import ScoutAdvice from './components/ScoutAdvice';
import { getAuctionAdvice } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AuctionSettings>(DEFAULT_SETTINGS);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isScouting, setIsScouting] = useState(false);
  const [scoutAdvice, setScoutAdvice] = useState<AIAdvice | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize teams when settings change (if not already set)
  useEffect(() => {
    setIsMounted(true);
    if (teams.length === 0) {
      const initialTeams = Array.from({ length: settings.teamCount }, (_, i) => ({
        id: `team-${i + 1}`,
        name: `Team ${i + 1}`,
        totalPurse: settings.pursePerTeam,
        spent: 0,
        rosterSize: settings.rosterSize,
        playersAcquired: []
      }));
      setTeams(initialTeams);
    }
  }, []);

  const handleSaveSettings = (newSettings: AuctionSettings) => {
    setSettings(newSettings);
    
    setTeams(prev => {
      const updatedTeams = [...prev];
      
      // If count increased, add new teams
      if (newSettings.teamCount > prev.length) {
        for (let i = prev.length; i < newSettings.teamCount; i++) {
          updatedTeams.push({
            id: `team-${Date.now()}-${i}`,
            name: `Team ${i + 1}`,
            totalPurse: newSettings.pursePerTeam,
            spent: 0,
            rosterSize: settings.rosterSize,
            playersAcquired: []
          });
        }
      } 
      // If count decreased, trim (warn user? for now just trim)
      else if (newSettings.teamCount < prev.length) {
        return updatedTeams.slice(0, newSettings.teamCount);
      }
      
      return updatedTeams;
    });
    
    setIsSettingsOpen(false);
  };

  const handleRenameTeam = (teamId: string, newName: string) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, name: newName } : t));
  };

  const recordAcquisition = (playerName: string, cost: number) => {
    if (!selectedTeamId) return;
    
    setTeams(prev => prev.map(team => {
      if (team.id === selectedTeamId) {
        return {
          ...team,
          spent: team.spent + cost,
          playersAcquired: [
            {
              id: Math.random().toString(36).substr(2, 9),
              name: playerName,
              cost,
              timestamp: Date.now()
            },
            ...team.playersAcquired
          ]
        };
      }
      return team;
    }));
  };

  const undoAcquisition = (teamId: string, acquisitionId: string) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        const player = team.playersAcquired.find(p => p.id === acquisitionId);
        if (!player) return team;
        return {
          ...team,
          spent: team.spent - player.cost,
          playersAcquired: team.playersAcquired.filter(p => p.id !== acquisitionId)
        };
      }
      return team;
    }));
  };

  const handleScout = async (playerName: string) => {
    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    if (!selectedTeam) return;

    setIsScouting(true);
    const advice = await getAuctionAdvice(selectedTeam, settings, playerName, teams);
    setScoutAdvice(advice);
    setIsScouting(false);
  };

  // Individual team data for Bar Chart
  const chartData = teams.map(t => ({
    name: t.name,
    Remaining: Math.max(0, settings.pursePerTeam - t.spent),
    Spent: t.spent
  }));

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || null;

  return (
    <div className="min-h-screen pb-12 bg-black text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-900/40 text-white">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">{settings.sportName}</h1>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Universal Purse Calculator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4 text-xs font-bold uppercase text-slate-400">
              <div className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
                Purse: <span className="text-emerald-400 ml-1">{settings.pursePerTeam}</span>
              </div>
              <div className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
                Roster: <span className="text-zinc-400 ml-1">{settings.rosterSize}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm font-bold transition-all text-slate-300"
            >
              Reset / Config
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 mt-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Column - Main Dashboard */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* Analytics Section */}
            <section className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Market Spend Analysis</h2>
              <div className="w-full h-[250px]" style={{ minHeight: '250px' }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} stroke="#94a3b8" />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#f8fafc' }}
                        itemStyle={{ fontSize: '12px' }}
                        cursor={{fill: '#27272a', opacity: 0.4}}
                      />
                      <Bar dataKey="Spent" stackId="a" fill="#52525b" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Remaining" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.3} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            {/* Team Grid Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest">Team Rosters & Budgets</h2>
                <span className="text-xs text-slate-500">{teams.length} Active Teams</span>
              </div>
              <TeamGrid 
                teams={teams} 
                settings={settings} 
                selectedTeamId={selectedTeamId}
                onSelectTeam={setSelectedTeamId}
                onRenameTeam={handleRenameTeam}
              />
            </section>
          </div>

          {/* Right Column - Controls & History */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <AuctionRecorder 
                selectedTeam={selectedTeam} 
                settings={settings}
                onRecord={recordAcquisition}
              />
              
              <div className="h-[calc(100vh-28rem)] min-h-[400px]">
                <TransactionHistory 
                  teams={teams} 
                  selectedTeamId={selectedTeamId}
                  onUndo={undoAcquisition} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SettingsModal 
        settings={settings}
        onSave={handleSaveSettings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ScoutAdvice 
        advice={scoutAdvice}
        loading={isScouting}
        onClose={() => {
          setScoutAdvice(null);
          setIsScouting(false);
        }}
      />

      {/* Footer Branding */}
      <footer className="mt-20 border-t border-zinc-800 py-10 text-center">
        <p className="text-slate-500 text-sm font-medium">Built for competitive drafts and high-stakes auctions.</p>
        <div className="mt-2 flex justify-center items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          <span>Real-time Math</span>
          <span>•</span>
          <span>AI Scouting</span>
          <span>•</span>
          <span>Purse Tracking</span>
        </div>
      </footer>
    </div>
  );
};

export default App;