const STAT_KEYS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

function validateRange(label, value, min, max) {
  if (value === undefined || value === null) {
    return null;
  }

  if (Number.isNaN(Number(value)) || value < min || value > max) {
    return `${label} must be between ${min} and ${max}.`;
  }

  return null;
}

export function validateCharacterInput(input, isUpdate = false) {
  if (!isUpdate && (!input.name || input.name.trim().length === 0)) {
    return 'Character name is required.';
  }

  if (input.name !== undefined && input.name.trim().length === 0) {
    return 'Character name is required.';
  }

  const levelError = validateRange('Level', input.level, 1, 20);
  if (levelError) {
    return levelError;
  }

  for (const key of STAT_KEYS) {
    const error = validateRange(key, input[key], 1, 20);
    if (error) {
      return error;
    }
  }

  for (const key of ['currentHp', 'maxHp', 'currentStamina', 'maxStamina', 'currentMana', 'maxMana']) {
    const error = validateRange(key, input[key], 0, 999);
    if (error) {
      return error;
    }
  }

  return null;
}

export function validateCampaignInput(input, isUpdate = false) {
  if (!isUpdate && (!input.name || input.name.trim().length === 0)) {
    return 'Campaign name is required.';
  }

  if (input.name !== undefined && input.name.trim().length === 0) {
    return 'Campaign name is required.';
  }

  return null;
}

export function validateSkillInput(input, isUpdate = false) {
  if (!isUpdate && (!input.name || !input.effect)) {
    return 'Skill name and effect are required.';
  }

  if (input.name !== undefined && input.name.trim().length === 0) {
    return 'Skill name is required.';
  }

  if (input.effect !== undefined && input.effect.trim().length === 0) {
    return 'Skill effect is required.';
  }

  const rankError = validateRange('Rank', input.rank, 1, 5);
  if (rankError) {
    return rankError;
  }

  return null;
}
