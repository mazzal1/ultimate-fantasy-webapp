export interface SkillRequirement {
  minLevelRequirement?: number;
  requiredSkillId?: string;
  requiredSkillRank?: number;
}

export interface Skill extends SkillRequirement {
  id: string;
  name: string;
  effect: string;
  rank: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SkillInput extends SkillRequirement {
  name: string;
  effect: string;
  rank: number;
  tags: string[];
}
