export interface Campaign {
  id: string;
  name: string;
  description?: string;
  notes?: string;
  gameMasterId: string;
  playerIds: string[];
  characterIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignInput {
  name: string;
  description?: string;
  notes?: string;
}
