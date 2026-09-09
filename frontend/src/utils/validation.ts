import type { CharacterInput, CharacterUpdateInput } from '../types/character';
import type { CampaignInput } from '../types/campaign';
import type { SkillInput } from '../types/skill';

const statNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;

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

  if (input.level !== undefined && (input.level < 1 || input.level > 20)) {
    return 'Level must be between 1 and 20.';
  }

  for (const statName of statNames) {
    const value = input[statName];
    if (value !== undefined && (value < 1 || value > 20)) {
      return `${statName} must be between 1 and 20.`;
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
  if (!validateRequired(input.name) || !validateRequired(input.effect)) {
    return 'Skill name and effect are required.';
  }

  if (input.rank < 1 || input.rank > 5) {
    return 'Skill rank must be between 1 and 5.';
  }

  return null;
}
