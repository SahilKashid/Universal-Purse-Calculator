
export interface Team {
  id: string;
  name: string;
  totalPurse: number;
  spent: number;
  rosterSize: number;
  playersAcquired: PlayerAcquisition[];
}

export interface PlayerAcquisition {
  id: string;
  name: string;
  cost: number;
  position?: string;
  timestamp: number;
}

export interface AuctionSettings {
  sportName: string;
  pursePerTeam: number;
  rosterSize: number;
  minBid: number;
  teamCount: number;
}

export interface AIAdvice {
  summary: string;
  recommendations: string[];
  suggestedMaxBid: number;
}
