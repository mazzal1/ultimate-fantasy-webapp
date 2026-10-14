import { canUseRankAtLevel, isValidRank } from './gameRules.js';

const CORE_STATS = ['strength', 'agility', 'dexterity', 'resilience', 'magic', 'willpower', 'acumen', 'charisma', 'luck'];

function validateRequiredName(label, value) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return `${label} is required.`;
  }

  return null;
}

function validateRange(label, value, min, max) {
  if (value === undefined || value === null) {
    return null;
  }

  if (!Number.isInteger(value) || value < min || value > max) {
    return `${label} must be between ${min} and ${max}.`;
  }

  return null;
}

function validateRankStateList(list, level, label) {
  if (list === undefined) {
    return null;
  }

  if (!Array.isArray(list)) {
    return `${label} must be a list.`;
  }

  for (const entry of list) {
    if (!entry || typeof entry !== 'object') {
      return `${label} entries must be objects.`;
    }

    if (!entry.rank || !isValidRank(entry.rank)) {
      return `${label} rank must be one of F,E,D,C,B,A,S.`;
    }

    if (!canUseRankAtLevel(entry.rank, level)) {
      return `${label} rank ${entry.rank} requires level ${entry.rank === 'F' || entry.rank === 'E' ? 1 : entry.rank === 'D' ? 10 : entry.rank === 'C' ? 20 : entry.rank === 'B' ? 30 : entry.rank === 'A' ? 40 : 50} or higher.`;
    }
  }

  return null;
}

export function validateCharacterInput(input, isUpdate = false) {
  if (!isUpdate) {
    const nameError = validateRequiredName('Character name', input.name);
    if (nameError) {
      return nameError;
    }
  } else if (input.name !== undefined) {
    const nameError = validateRequiredName('Character name', input.name);
    if (nameError) {
      return nameError;
    }
  }

  const level = input.level ?? 1;
  const levelError = validateRange('Level', level, 1, 100);
  if (levelError) {
    return levelError;
  }

  const ageError = validateRange('Age', input.age, 0, 999);
  if (ageError) {
    return ageError;
  }

  const statPointsError = validateRange('Stat points', input.statPoints, 0, 500);
  if (statPointsError) {
    return statPointsError;
  }

  const skillPointsError = validateRange('Skill points', input.skillPoints, 0, 500);
  if (skillPointsError) {
    return skillPointsError;
  }

  const woundsError = validateRange('Wounds', input.wounds, 0, 8);
  if (woundsError) {
    return woundsError;
  }

  const resourceErrors = [
    validateRange('Current hp', input.currentHp, 0, 999),
    validateRange('Max hp', input.maxHp, 0, 999),
    validateRange('Current mana', input.currentMana, 0, 999),
    validateRange('Max mana', input.maxMana, 0, 999),
    validateRange('Current stamina', input.currentStamina, 0, 999),
    validateRange('Max stamina', input.maxStamina, 0, 999),
  ].find(Boolean);
  if (resourceErrors) {
    return resourceErrors;
  }

  if (input.coreStats !== undefined) {
    if (!input.coreStats || typeof input.coreStats !== 'object') {
      return 'coreStats must be an object.';
    }

    for (const stat of CORE_STATS) {
      const rank = input.coreStats[stat];
      if (rank === undefined) {
        continue;
      }

      if (!isValidRank(rank)) {
        return `Invalid rank for ${stat}.`;
      }

      if (!canUseRankAtLevel(rank, level)) {
        return `Rank ${rank} for ${stat} requires a higher level.`;
      }
    }
  }

  const competencyStateError = validateRankStateList(input.competencyStates, level, 'Competency state');
  if (competencyStateError) {
    return competencyStateError;
  }

  const skillStateError = validateRankStateList(input.skillStates, level, 'Skill state');
  if (skillStateError) {
    return skillStateError;
  }

  return null;
}

export function validateCampaignInput(input, isUpdate = false) {
  if (!isUpdate) {
    const error = validateRequiredName('Campaign name', input.name);
    if (error) {
      return error;
    }
  } else if (input.name !== undefined) {
    const error = validateRequiredName('Campaign name', input.name);
    if (error) {
      return error;
    }
  }

  return null;
}

export function validateSkillInput(input, isUpdate = false) {
  if (!isUpdate) {
    const nameError = validateRequiredName('Skill name', input.name);
    if (nameError) {
      return nameError;
    }

    const descriptionError = validateRequiredName('Skill description', input.description ?? input.effect);
    if (descriptionError) {
      return descriptionError;
    }
  }

  if (input.maxRank !== undefined && !isValidRank(input.maxRank)) {
    return 'maxRank must be one of F,E,D,C,B,A,S.';
  }

  const minLevelError = validateRange('Minimum level requirement', input.minLevelRequirement, 1, 100);
  if (minLevelError) {
    return minLevelError;
  }

  const manaCostError = validateRange('Mana cost', input.manaCost, 0, 999);
  if (manaCostError) {
    return manaCostError;
  }

  const staminaCostError = validateRange('Stamina cost', input.staminaCost, 0, 999);
  if (staminaCostError) {
    return staminaCostError;
  }

  if (input.kind !== undefined && !['SKILL', 'ITEM'].includes(input.kind)) {
    return 'kind must be SKILL or ITEM.';
  }

  return null;
}

export function validateCompetencyInput(input, isUpdate = false) {
  if (!isUpdate) {
    const error = validateRequiredName('Competency name', input.name);
    if (error) {
      return error;
    }
  }

  if (input.description !== undefined && input.description.trim().length === 0) {
    return 'Competency description is required.';
  }

  return null;
}
