import type { CharacterInput, CharacterUpdateInput, Rank } from '../types/character';
import type { CampaignInput } from '../types/campaign';
import type { CompetencyInput, SkillInput } from '../types/skill';

const ranks: Rank[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];

export function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateRequired(value: string) {
  return value.trim().length > 0;
}

export function validateCharacterInput(input: CharacterInput | CharacterUpdateInput) {
  if ('name' in input && input.name !== undefined && !validateRequired(input.name)) {
    return 'Character name is required.';
  }

  if (input.level !== undefined && (input.level < 1 || input.level > 100)) {
    return 'Level must be between 1 and 100.';
  }

  const numericConstraints: Array<[number | undefined, string, number, number]> = [
    [input.age, 'Age', 0, 999],
    [input.statPoints, 'Stat points', 0, 500],
    [input.skillPoints, 'Skill points', 0, 500],
    [input.currentHp, 'Current HP', 0, 999],
    [input.maxHp, 'Max HP', 0, 999],
    [input.currentMana, 'Current mana', 0, 999],
    [input.maxMana, 'Max mana', 0, 999],
    [input.currentStamina, 'Current stamina', 0, 999],
    [input.maxStamina, 'Max stamina', 0, 999],
    [input.wounds, 'Wounds', 0, 8],
  ];

  for (const [value, label, min, max] of numericConstraints) {
    if (value !== undefined && (value < min || value > max)) {
      return `${label} must be between ${min} and ${max}.`;
    }
  }

  if (input.coreStats) {
    for (const value of Object.values(input.coreStats)) {
      if (value !== undefined && !ranks.includes(value)) {
        return 'Invalid rank in core stats.';
      }
    }
  }

  return null;
}

export function validateCampaignInput(input: CampaignInput) {
  if (!validateRequired(input.name)) {
    return 'Campaign name is required.';
  }

  return null;
}

export function validateSkillInput(input: SkillInput) {
  if (!validateRequired(input.name) || !validateRequired(input.description)) {
    return 'Skill name and description are required.';
  }

  if (!ranks.includes(input.maxRank)) {
    return 'maxRank must be a valid rank.';
  }

  return null;
}

export function validateCompetencyInput(input: CompetencyInput) {
  if (!validateRequired(input.name) || !validateRequired(input.description)) {
    return 'Competency name and description are required.';
  }

  return null;
}
