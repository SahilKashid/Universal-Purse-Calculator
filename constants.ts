import { AuctionSettings } from './types';

export const DEFAULT_SETTINGS: AuctionSettings = {
  sportName: 'Fantasy Sports',
  pursePerTeam: 200,
  rosterSize: 15,
  minBid: 1,
  teamCount: 12
};

export const COLOR_PALETTE = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // emerald
  '#f59e0b', // amber
  '#78716c', // stone (was violet)
  '#14b8a6', // teal (was pink)
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#0ea5e9'  // sky (was indigo)
];