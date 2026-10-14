import type { Rank } from './character';

export interface AbilityBase {
  id: string;
  ownerUserId?: string;
  name: string;
  description: string;
  maxRank: Rank;
  activationType: string;
  manaCost: number;
  staminaCost: number;
  minLevelRequirement: number;
  requiredAbilityIds: string[];
  requiredTitleIds: string[];
  tags: string[];
  isSystem: boolean;
  sharedCampaignIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill extends AbilityBase {}

export interface Item extends AbilityBase {}

export interface Competency {
  id: string;
  ownerUserId?: string;
  name: string;
  description: string;
  tags: string[];
  isSystem: boolean;
  sharedCampaignIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Title {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillInput {
  name: string;
  description: string;
  maxRank: Rank;
  activationType?: string;
  manaCost?: number;
  staminaCost?: number;
  minLevelRequirement?: number;
  requiredAbilityIds?: string[];
  requiredTitleIds?: string[];
  tags: string[];
}

export interface CompetencyInput {
  name: string;
  description: string;
  tags: string[];
}
