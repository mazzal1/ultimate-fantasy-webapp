import type { Competency, Item, Skill, Title } from './skill';

export type Rank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type CoreStats = {
  strength: Rank;
  agility: Rank;
  dexterity: Rank;
  resilience: Rank;
  magic: Rank;
  willpower: Rank;
  acumen: Rank;
  charisma: Rank;
  luck: Rank;
};

export interface CharacterCompetencyState {
  competencyId: string;
  rank: Rank;
}

export interface CharacterSkillState {
  skillId: string;
  rank: Rank;
}

export interface CharacterItemState {
  itemId: string;
  equipped: boolean;
}

export interface CharacterCompetencyEntry {
  competency: Competency;
  rank: Rank;
}

export interface CharacterSkillEntry {
  skill: Skill;
  rank: Rank;
}

export interface CharacterItemEntry {
  item: Item;
  equipped: boolean;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  playerName?: string;
  gender?: string;
  race?: string;
  age?: number;
  background?: string;
  level: number;
  statPoints: number;
  skillPoints: number;
  coreStats: CoreStats;
  currentHp: number;
  maxHp: number;
  currentMana: number;
  maxMana: number;
  currentStamina: number;
  maxStamina: number;
  wounds: number;
  competencyStates: CharacterCompetencyState[];
  skillStates: CharacterSkillState[];
  titleIds: string[];
  itemStates: CharacterItemState[];
  competencies: CharacterCompetencyEntry[];
  skills: CharacterSkillEntry[];
  titles: Title[];
  items: CharacterItemEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CharacterInput {
  name: string;
  playerName?: string;
  gender?: string;
  race?: string;
  age?: number;
  background?: string;
  level?: number;
  statPoints?: number;
  skillPoints?: number;
  coreStats?: Partial<CoreStats>;
  currentHp?: number;
  maxHp?: number;
  currentMana?: number;
  maxMana?: number;
  currentStamina?: number;
  maxStamina?: number;
  wounds?: number;
  competencyStates?: CharacterCompetencyState[];
  skillStates?: CharacterSkillState[];
  titleIds?: string[];
  itemStates?: CharacterItemState[];
}

export type CharacterUpdateInput = Partial<CharacterInput>;
