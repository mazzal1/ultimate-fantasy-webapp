import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Input, TextArea, Typography, tokens } from '../../design-system';
import { useI18n } from '../../hooks/useI18n';
import type { Character, CharacterItemState, CharacterUpdateInput, CoreStats, Rank } from '../../types/character';
import type { Competency, Item, Skill, Title } from '../../types/skill';

const rankOptions: Rank[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
const coreStatKeys = ['strength', 'agility', 'dexterity', 'resilience', 'magic', 'willpower', 'acumen', 'charisma', 'luck'] as const;
const minLevelByRank: Record<Rank, number> = {
  F: 1,
  E: 1,
  D: 10,
  C: 20,
  B: 30,
  A: 40,
  S: 50,
};
const rankColorMap: Record<Rank, string> = {
  F: '#B91C1C',
  E: '#EA580C',
  D: '#CA8A04',
  C: '#0F766E',
  B: '#1D4ED8',
  A: '#6D28D9',
  S: '#BE185D',
};

type SheetMode = 'play' | 'build';

type CharacterSheetProps = {
  character: Character;
  skills: Skill[];
  items: Item[];
  competencies: Competency[];
  titles: Title[];
  onSave: (input: CharacterUpdateInput) => Promise<Character>;
};

function toggleItemState(states: CharacterItemState[], itemId: string) {
  const existing = states.find((entry) => entry.itemId === itemId);
  if (!existing) {
    return [...states, { itemId, equipped: true }];
  }

  return states.map((entry) => (entry.itemId === itemId ? { ...entry, equipped: !entry.equipped } : entry));
}

function formatStatLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function rankToIndex(rank: Rank) {
  return rankOptions.indexOf(rank);
}

function canUseRankAtLevel(rank: Rank, level: number) {
  return level >= minLevelByRank[rank];
}

function getPreviousRank(rank: Rank): Rank | null {
  const nextIndex = rankToIndex(rank) - 1;
  if (nextIndex < 0) {
    return null;
  }

  return rankOptions[nextIndex];
}

function getNextRank(rank: Rank): Rank | null {
  const nextIndex = rankToIndex(rank) + 1;
  if (nextIndex >= rankOptions.length) {
    return null;
  }

  return rankOptions[nextIndex];
}

function RankBadge({ rank }: { rank: Rank }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 32,
        padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
        borderRadius: tokens.radii.pill,
        border: `1px solid ${rankColorMap[rank]}`,
        background: `${rankColorMap[rank]}22`,
        color: tokens.colors.text,
        fontFamily: tokens.fonts.heading,
        fontWeight: 700,
        letterSpacing: 1.2,
        textShadow: '0 1px 6px rgba(0, 0, 0, 0.35)',
      }}
    >
      {rank}
    </span>
  );
}

type RankStepperProps = {
  rank: Rank;
  disableDecrease: boolean;
  disableIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

function RankStepper({ rank, disableDecrease, disableIncrease, onDecrease, onIncrease }: RankStepperProps) {
  const buttonStyle = (disabled: boolean) => ({
    width: 30,
    height: 30,
    borderRadius: tokens.radii.pill,
    border: `1px solid ${tokens.colors.border}`,
    background: tokens.colors.surface,
    color: tokens.colors.text,
    fontWeight: 700,
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  });

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: tokens.spacing.sm, justifyContent: 'center' }}>
      <button type="button" style={buttonStyle(disableDecrease)} disabled={disableDecrease} onClick={onDecrease}>
        -
      </button>
      <RankBadge rank={rank} />
      <button type="button" style={buttonStyle(disableIncrease)} disabled={disableIncrease} onClick={onIncrease}>
        +
      </button>
    </div>
  );
}

type ResourceTrackerProps = {
  label: string;
  currentValue: number;
  maxValue: number;
  activeColor: string;
  onChange: (value: number) => void;
};

function ResourceTracker({ label, currentValue, maxValue, activeColor, onChange }: ResourceTrackerProps) {
  const safeMax = Math.max(0, Math.trunc(maxValue));
  const safeCurrent = Math.max(0, Math.min(safeMax, Math.trunc(currentValue)));
  const canDecrease = safeCurrent > 0;
  const canIncrease = safeCurrent < safeMax;
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);
  const [pulseKind, setPulseKind] = useState<'up' | 'down' | null>(null);
  const previousCurrentRef = useRef(safeCurrent);

  useEffect(() => {
    const previousValue = previousCurrentRef.current;
    previousCurrentRef.current = safeCurrent;
    if (safeCurrent === previousValue) {
      return;
    }

    const isIncrease = safeCurrent > previousValue;
    const nextPulseIndex = isIncrease ? safeCurrent - 1 : safeCurrent;
    if (nextPulseIndex < 0 || nextPulseIndex >= safeMax) {
      setPulseIndex(null);
      setPulseKind(null);
      return;
    }

    setPulseIndex(nextPulseIndex);
    setPulseKind(isIncrease ? 'up' : 'down');
    const timeoutId = window.setTimeout(() => {
      setPulseIndex((current) => (current === nextPulseIndex ? null : current));
      setPulseKind((current) => (current === (isIncrease ? 'up' : 'down') ? null : current));
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [safeCurrent, safeMax]);

  const controlButtonStyle = (disabled: boolean) => ({
    width: 28,
    height: 28,
    borderRadius: tokens.radii.pill,
    border: `1px solid ${tokens.colors.border}`,
    background: tokens.colors.surface,
    color: tokens.colors.text,
    fontWeight: 700,
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  });

  return (
    <div
      style={{
        display: 'grid',
        gap: tokens.spacing.sm,
        padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
        background: tokens.colors.surfaceAlt,
        borderRadius: tokens.radii.md,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>{label}</Typography>
        <Typography muted>
          {safeCurrent}/{safeMax}
        </Typography>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => onChange(safeCurrent - 1)} disabled={!canDecrease} style={controlButtonStyle(!canDecrease)}>
          -
        </button>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacing.xs, flex: 1 }}>
          {Array.from({ length: safeMax }).map((_, index) => {
            const filled = index < safeCurrent;
            return (
              <button
                key={`${label}-${index}`}
                type="button"
                onClick={() => onChange(index + 1)}
                aria-label={`${label} ${index + 1}`}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: tokens.radii.pill,
                  border: `1px solid ${activeColor}`,
                  background: filled ? activeColor : 'transparent',
                  opacity: filled ? 1 : 0.35,
                  cursor: 'pointer',
                  transform: pulseIndex === index ? (pulseKind === 'down' ? 'scale(0.88)' : 'scale(1.14)') : 'scale(1)',
                  boxShadow: pulseIndex === index ? (pulseKind === 'down' ? `0 0 0 4px ${tokens.colors.warning}33` : `0 0 0 4px ${activeColor}33`) : 'none',
                  transition: 'transform 160ms ease, box-shadow 160ms ease, background-color 140ms ease, opacity 140ms ease',
                }}
              />
            );
          })}
        </div>
        <button type="button" onClick={() => onChange(safeCurrent + 1)} disabled={!canIncrease} style={controlButtonStyle(!canIncrease)}>
          +
        </button>
      </div>
    </div>
  );
}

export function CharacterSheet({ character, skills, items, competencies, titles, onSave }: CharacterSheetProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<SheetMode>('play');
  const [form, setForm] = useState<CharacterUpdateInput>({
    name: character.name,
    playerName: character.playerName,
    gender: character.gender,
    race: character.race,
    age: character.age,
    background: character.background,
    level: character.level,
    statPoints: character.statPoints,
    skillPoints: character.skillPoints,
    coreStats: character.coreStats,
    currentHp: character.currentHp,
    maxHp: character.maxHp,
    currentMana: character.currentMana,
    maxMana: character.maxMana,
    currentStamina: character.currentStamina,
    maxStamina: character.maxStamina,
    wounds: character.wounds,
    competencyStates: character.competencyStates,
    skillStates: character.skillStates,
    titleIds: character.titleIds,
    itemStates: character.itemStates,
  });
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedTitleIds = useMemo(() => new Set(form.titleIds ?? []), [form.titleIds]);
  const selectedItemIds = useMemo(() => new Set((form.itemStates ?? []).map((state) => state.itemId)), [form.itemStates]);
  const skillNameById = useMemo(() => new Map(skills.map((skill) => [skill.id, skill.name])), [skills]);
  const competencyNameById = useMemo(() => new Map(competencies.map((competency) => [competency.id, competency.name])), [competencies]);
  const mergedCoreStats: CoreStats = useMemo(
    () => ({ ...character.coreStats, ...(form.coreStats ?? {}) }),
    [character.coreStats, form.coreStats],
  );
  const currentLevel = form.level ?? character.level;
  const currentSkillPoints = form.skillPoints ?? character.skillPoints;
  const currentStatPoints = form.statPoints ?? character.statPoints;
  const canDecreaseLevelByPoints = currentSkillPoints > 0 && currentStatPoints > 0 && currentLevel > 1;
  const canDecreaseLevelByRank = useMemo(() => {
    const nextLevel = currentLevel - 1;
    if (nextLevel < 1) {
      return false;
    }

    for (const key of coreStatKeys) {
      if (!canUseRankAtLevel(mergedCoreStats[key], nextLevel)) {
        return false;
      }
    }

    for (const state of form.skillStates ?? []) {
      if (!canUseRankAtLevel(state.rank, nextLevel)) {
        return false;
      }
    }

    for (const state of form.competencyStates ?? []) {
      if (!canUseRankAtLevel(state.rank, nextLevel)) {
        return false;
      }
    }

    return true;
  }, [currentLevel, mergedCoreStats, form.skillStates, form.competencyStates]);

  const applyUpdatedCharacter = (updated: Character) => {
    setForm({
      name: updated.name,
      playerName: updated.playerName,
      gender: updated.gender,
      race: updated.race,
      age: updated.age,
      background: updated.background,
      level: updated.level,
      statPoints: updated.statPoints,
      skillPoints: updated.skillPoints,
      coreStats: updated.coreStats,
      currentHp: updated.currentHp,
      maxHp: updated.maxHp,
      currentMana: updated.currentMana,
      maxMana: updated.maxMana,
      currentStamina: updated.currentStamina,
      maxStamina: updated.maxStamina,
      wounds: updated.wounds,
      competencyStates: updated.competencyStates,
      skillStates: updated.skillStates,
      titleIds: updated.titleIds,
      itemStates: updated.itemStates,
    });
  };

  const save = async (nextForm: CharacterUpdateInput = form) => {
    try {
      setBusy(true);
      setError(null);
      const updated = await onSave(nextForm);
      applyUpdatedCharacter(updated);
      setFeedback(t('character.saved'));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : t('character.saveError'));
    } finally {
      setBusy(false);
    }
  };

  const savePlayResources = async () => {
    await save({
      currentHp: form.currentHp,
      currentMana: form.currentMana,
      currentStamina: form.currentStamina,
    });
  };

  const stepCoreStat = (key: keyof CoreStats, direction: 'up' | 'down') => {
    setForm((current) => {
      const baseStats = { ...character.coreStats, ...(current.coreStats ?? {}) };
      const currentRank = baseStats[key];
      const nextRank = direction === 'up' ? getNextRank(currentRank) : getPreviousRank(currentRank);
      if (!nextRank) {
        return current;
      }

      const level = current.level ?? character.level;
      const statPoints = current.statPoints ?? character.statPoints;
      if (direction === 'up') {
        if (statPoints <= 0 || !canUseRankAtLevel(nextRank, level)) {
          return current;
        }

        return {
          ...current,
          statPoints: statPoints - 1,
          coreStats: { ...baseStats, [key]: nextRank },
        };
      }

      return {
        ...current,
        statPoints: statPoints + 1,
        coreStats: { ...baseStats, [key]: nextRank },
      };
    });
  };

  const stepSkillRank = (skillId: string, direction: 'up' | 'down') => {
    setForm((current) => {
      const states = current.skillStates ?? [];
      const level = current.level ?? character.level;
      const skillPoints = current.skillPoints ?? character.skillPoints;
      let didUpdate = false;
      const nextStates = states.map((state) => {
        if (state.skillId !== skillId) {
          return state;
        }

        const nextRank = direction === 'up' ? getNextRank(state.rank) : getPreviousRank(state.rank);
        if (!nextRank) {
          return state;
        }

        if (direction === 'up') {
          if (skillPoints <= 0 || !canUseRankAtLevel(nextRank, level)) {
            return state;
          }
        }

        didUpdate = true;
        return { ...state, rank: nextRank };
      });

      if (!didUpdate) {
        return current;
      }

      return {
        ...current,
        skillPoints: direction === 'up' ? skillPoints - 1 : skillPoints + 1,
        skillStates: nextStates,
      };
    });
  };

  const stepCompetencyRank = (competencyId: string, direction: 'up' | 'down') => {
    setForm((current) => {
      const states = current.competencyStates ?? [];
      const level = current.level ?? character.level;
      const skillPoints = current.skillPoints ?? character.skillPoints;
      let didUpdate = false;
      const nextStates = states.map((state) => {
        if (state.competencyId !== competencyId) {
          return state;
        }

        const nextRank = direction === 'up' ? getNextRank(state.rank) : getPreviousRank(state.rank);
        if (!nextRank) {
          return state;
        }

        if (direction === 'up') {
          if (skillPoints <= 0 || !canUseRankAtLevel(nextRank, level)) {
            return state;
          }
        }

        didUpdate = true;
        return { ...state, rank: nextRank };
      });

      if (!didUpdate) {
        return current;
      }

      return {
        ...current,
        skillPoints: direction === 'up' ? skillPoints - 1 : skillPoints + 1,
        competencyStates: nextStates,
      };
    });
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: tokens.spacing.md }}>
        <Typography as="h2">{t('character.sheet')}</Typography>
        <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
          <Button type="button" variant={mode === 'play' ? 'secondary' : 'ghost'} onClick={() => setMode('play')}>
            {t('character.playMode')}
          </Button>
          <Button type="button" variant={mode === 'build' ? 'secondary' : 'ghost'} onClick={() => setMode('build')}>
            {t('character.buildMode')}
          </Button>
        </div>
      </div>

      {mode === 'play' ? (
        <div style={{ display: 'grid', gap: tokens.spacing.lg, marginTop: tokens.spacing.lg }}>
          <Typography muted>{t('character.playModeHint')}</Typography>
          <div style={{ display: 'grid', gap: tokens.spacing.md }}>
            <ResourceTracker
              label={t('forms.hp')}
              currentValue={form.currentHp ?? 0}
              maxValue={form.maxHp ?? character.maxHp}
              activeColor={tokens.colors.error}
              onChange={(value) => setForm((current) => ({ ...current, currentHp: value }))}
            />
            <ResourceTracker
              label={t('forms.mana')}
              currentValue={form.currentMana ?? 0}
              maxValue={form.maxMana ?? character.maxMana}
              activeColor={tokens.colors.primary}
              onChange={(value) => setForm((current) => ({ ...current, currentMana: value }))}
            />
            <ResourceTracker
              label={t('forms.stamina')}
              currentValue={form.currentStamina ?? 0}
              maxValue={form.maxStamina ?? character.maxStamina}
              activeColor={tokens.colors.success}
              onChange={(value) => setForm((current) => ({ ...current, currentStamina: value }))}
            />
          </div>
          <Button type="button" onClick={() => void savePlayResources()} disabled={busy}>
            {busy ? t('character.saving') : t('character.savePlayResources')}
          </Button>
          <div style={{ display: 'grid', gap: tokens.spacing.md }}>
            <Typography as="h3">{t('forms.coreStats')}</Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: tokens.spacing.sm }}>
              {coreStatKeys.map((key) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: tokens.spacing.sm,
                    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                    background: tokens.colors.surfaceAlt,
                    borderRadius: tokens.radii.md,
                  }}
                >
                  <Typography>{formatStatLabel(key)}</Typography>
                  <RankBadge rank={mergedCoreStats[key]} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gap: tokens.spacing.md }}>
            <Typography as="h3">{t('skills.skills')}</Typography>
            <div style={{ display: 'grid', gap: tokens.spacing.sm }}>
              {(form.skillStates ?? []).map((state) => (
                <div
                  key={state.skillId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: tokens.spacing.sm,
                    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                    background: tokens.colors.surfaceAlt,
                    borderRadius: tokens.radii.md,
                  }}
                >
                  <Typography>{skillNameById.get(state.skillId) ?? state.skillId}</Typography>
                  <RankBadge rank={state.rank} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gap: tokens.spacing.md }}>
            <Typography as="h3">{t('skills.competencies')}</Typography>
            <div style={{ display: 'grid', gap: tokens.spacing.sm }}>
              {(form.competencyStates ?? []).map((state) => (
                <div
                  key={state.competencyId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: tokens.spacing.sm,
                    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                    background: tokens.colors.surfaceAlt,
                    borderRadius: tokens.radii.md,
                  }}
                >
                  <Typography>{competencyNameById.get(state.competencyId) ?? state.competencyId}</Typography>
                  <RankBadge rank={state.rank} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: tokens.spacing.md, marginTop: tokens.spacing.md }}>
            <Input label={t('forms.name')} value={form.name ?? ''} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <Input label={t('forms.playerName')} value={form.playerName ?? ''} onChange={(event) => setForm((current) => ({ ...current, playerName: event.target.value }))} />
            <Input label={t('forms.gender')} value={form.gender ?? ''} onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))} />
            <Input label={t('forms.race')} value={form.race ?? ''} onChange={(event) => setForm((current) => ({ ...current, race: event.target.value }))} />
            <Input label={t('forms.age')} type="number" value={String(form.age ?? '')} onChange={(event) => setForm((current) => ({ ...current, age: Number(event.target.value) || undefined }))} />
          </div>
          <TextArea
            label={t('forms.background')}
            value={form.background ?? ''}
            onChange={(event) => setForm((current) => ({ ...current, background: event.target.value }))}
            style={{ marginTop: tokens.spacing.md }}
          />
          <div style={{ display: 'grid', gap: tokens.spacing.sm, marginTop: tokens.spacing.lg }}>
            <Typography as="h3">{t('character.progression')}</Typography>
            <Typography muted>
              {t('character.statPoints')}: {currentStatPoints} • {t('character.skillPoints')}: {currentSkillPoints}
            </Typography>
          </div>
          <div
            style={{
              marginTop: tokens.spacing.md,
              padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
              background: tokens.colors.surfaceAlt,
              borderRadius: tokens.radii.md,
              display: 'grid',
              gap: tokens.spacing.sm,
            }}
          >
            <Typography as="h3">{t('character.rankUnlockTitle')}</Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: tokens.spacing.sm }}>
              {rankOptions.map((rank) => (
                <div key={rank} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: tokens.spacing.sm }}>
                  <RankBadge rank={rank} />
                  <Typography muted>{t('character.rankUnlockEntry', { rank, level: String(minLevelByRank[rank]) })}</Typography>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gap: tokens.spacing.xs, marginTop: tokens.spacing.md }}>
            <Typography>{t('common.level')}</Typography>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: tokens.spacing.sm }}>
              <button
                type="button"
                disabled={busy || !canDecreaseLevelByPoints || !canDecreaseLevelByRank}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    level: (current.level ?? character.level) - 1,
                    statPoints: (current.statPoints ?? character.statPoints) - 1,
                    skillPoints: (current.skillPoints ?? character.skillPoints) - 1,
                  }))
                }
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: tokens.radii.pill,
                  border: `1px solid ${tokens.colors.border}`,
                  background: tokens.colors.surface,
                  color: tokens.colors.text,
                  fontWeight: 700,
                  opacity: busy || !canDecreaseLevelByPoints || !canDecreaseLevelByRank ? 0.4 : 1,
                  cursor: busy || !canDecreaseLevelByPoints || !canDecreaseLevelByRank ? 'not-allowed' : 'pointer',
                }}
              >
                -
              </button>
              <Typography as="h3" style={{ minWidth: 36, textAlign: 'center', margin: 0 }}>
                {currentLevel}
              </Typography>
              <button
                type="button"
                disabled={busy || currentLevel >= 100}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    level: (current.level ?? character.level) + 1,
                    statPoints: (current.statPoints ?? character.statPoints) + 1,
                    skillPoints: (current.skillPoints ?? character.skillPoints) + 1,
                  }))
                }
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: tokens.radii.pill,
                  border: `1px solid ${tokens.colors.border}`,
                  background: tokens.colors.surface,
                  color: tokens.colors.text,
                  fontWeight: 700,
                  opacity: busy || currentLevel >= 100 ? 0.4 : 1,
                  cursor: busy || currentLevel >= 100 ? 'not-allowed' : 'pointer',
                }}
              >
                +
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: tokens.spacing.sm, marginTop: tokens.spacing.md }}>
            {coreStatKeys.map((key) => {
              const currentRank = mergedCoreStats[key];
              const nextRank = getNextRank(currentRank);
              return (
                <label key={key} style={{ display: 'grid', gap: tokens.spacing.xs }}>
                  <span>{formatStatLabel(key)}</span>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <RankStepper
                      rank={currentRank}
                      disableDecrease={busy || currentRank === 'F'}
                      disableIncrease={busy || currentStatPoints <= 0 || currentRank === 'S' || nextRank === null || !canUseRankAtLevel(nextRank, currentLevel)}
                      onDecrease={() => stepCoreStat(key, 'down')}
                      onIncrease={() => stepCoreStat(key, 'up')}
                    />
                  </div>
                </label>
              );
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: tokens.spacing.md, marginTop: tokens.spacing.lg }}>
            <Input
              label={t('forms.maxHp')}
              type="number"
              value={String(form.maxHp ?? 0)}
              onChange={(event) => setForm((current) => ({ ...current, maxHp: Number(event.target.value) }))}
            />
            <Input
              label={t('forms.maxMana')}
              type="number"
              value={String(form.maxMana ?? 0)}
              onChange={(event) => setForm((current) => ({ ...current, maxMana: Number(event.target.value) }))}
            />
            <Input
              label={t('forms.maxStamina')}
              type="number"
              value={String(form.maxStamina ?? 0)}
              onChange={(event) => setForm((current) => ({ ...current, maxStamina: Number(event.target.value) }))}
            />
            <Input
              label={t('forms.wounds')}
              type="number"
              value={String(form.wounds ?? 0)}
              onChange={(event) => setForm((current) => ({ ...current, wounds: Number(event.target.value) }))}
            />
          </div>
          <div style={{ display: 'grid', gap: tokens.spacing.md, marginTop: tokens.spacing.lg }}>
            <Typography as="h3">{t('skills.skills')}</Typography>
            {skills.map((skill) => {
              const state = (form.skillStates ?? []).find((entry) => entry.skillId === skill.id);
              const selected = Boolean(state);
              const currentRank = state?.rank ?? 'F';
              const nextRank = getNextRank(currentRank);
              return (
                <label key={skill.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: tokens.spacing.sm, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      setForm((current) => {
                        const currentStates = current.skillStates ?? [];
                        const currentPoints = current.skillPoints ?? character.skillPoints;
                        const selectedState = currentStates.find((entry) => entry.skillId === skill.id);
                        if (selectedState) {
                          return {
                            ...current,
                            skillPoints: currentPoints + rankToIndex(selectedState.rank),
                            skillStates: currentStates.filter((entry) => entry.skillId !== skill.id),
                          };
                        }

                        return {
                          ...current,
                          skillStates: [...currentStates, { skillId: skill.id, rank: 'F' }],
                        };
                      })
                    }
                  />
                  <span>
                    {skill.name} ({skill.maxRank})
                  </span>
                  {selected ? (
                    <RankStepper
                      rank={currentRank}
                      disableDecrease={busy || currentRank === 'F'}
                      disableIncrease={
                        busy ||
                        currentSkillPoints <= 0 ||
                        currentRank === 'S' ||
                        nextRank === null ||
                        !canUseRankAtLevel(nextRank, currentLevel)
                      }
                      onDecrease={() => stepSkillRank(skill.id, 'down')}
                      onIncrease={() => stepSkillRank(skill.id, 'up')}
                    />
                  ) : null}
                </label>
              );
            })}
          </div>
          <div style={{ display: 'grid', gap: tokens.spacing.md, marginTop: tokens.spacing.lg }}>
            <Typography as="h3">{t('skills.competencies')}</Typography>
            {competencies.map((competency) => {
              const state = (form.competencyStates ?? []).find((entry) => entry.competencyId === competency.id);
              const selected = Boolean(state);
              const currentRank = state?.rank ?? 'F';
              const nextRank = getNextRank(currentRank);
              return (
                <label key={competency.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: tokens.spacing.sm, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      setForm((current) => {
                        const currentStates = current.competencyStates ?? [];
                        const currentPoints = current.skillPoints ?? character.skillPoints;
                        const selectedState = currentStates.find((entry) => entry.competencyId === competency.id);
                        if (selectedState) {
                          return {
                            ...current,
                            skillPoints: currentPoints + rankToIndex(selectedState.rank),
                            competencyStates: currentStates.filter((entry) => entry.competencyId !== competency.id),
                          };
                        }

                        return {
                          ...current,
                          competencyStates: [...currentStates, { competencyId: competency.id, rank: 'F' }],
                        };
                      })
                    }
                  />
                  <span>{competency.name}</span>
                  {selected ? (
                    <RankStepper
                      rank={currentRank}
                      disableDecrease={busy || currentRank === 'F'}
                      disableIncrease={
                        busy ||
                        currentSkillPoints <= 0 ||
                        currentRank === 'S' ||
                        nextRank === null ||
                        !canUseRankAtLevel(nextRank, currentLevel)
                      }
                      onDecrease={() => stepCompetencyRank(competency.id, 'down')}
                      onIncrease={() => stepCompetencyRank(competency.id, 'up')}
                    />
                  ) : null}
                </label>
              );
            })}
          </div>
          <div style={{ display: 'grid', gap: tokens.spacing.md, marginTop: tokens.spacing.lg }}>
            <Typography as="h3">{t('skills.titles')}</Typography>
            {titles.map((title) => (
              <label key={title.id} style={{ display: 'flex', gap: tokens.spacing.sm, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedTitleIds.has(title.id)}
                  onChange={() =>
                    setForm((current) => {
                      const ids = new Set(current.titleIds ?? []);
                      if (ids.has(title.id)) {
                        ids.delete(title.id);
                      } else {
                        ids.add(title.id);
                      }

                      return { ...current, titleIds: [...ids] };
                    })
                  }
                />
                <span>{title.name}</span>
              </label>
            ))}
          </div>
          <div style={{ display: 'grid', gap: tokens.spacing.md, marginTop: tokens.spacing.lg }}>
            <Typography as="h3">{t('skills.items')}</Typography>
            {items.map((item) => (
              <label key={item.id} style={{ display: 'flex', gap: tokens.spacing.sm, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedItemIds.has(item.id)}
                  onChange={() =>
                    setForm((current) => {
                      const currentStates = current.itemStates ?? [];
                      if (selectedItemIds.has(item.id)) {
                        return { ...current, itemStates: currentStates.filter((entry) => entry.itemId !== item.id) };
                      }

                      return { ...current, itemStates: [...currentStates, { itemId: item.id, equipped: false }] };
                    })
                  }
                />
                <span>{item.name}</span>
                {selectedItemIds.has(item.id) ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setForm((current) => ({ ...current, itemStates: toggleItemState(current.itemStates ?? [], item.id) }))}
                  >
                    {(form.itemStates ?? []).find((entry) => entry.itemId === item.id)?.equipped ? t('character.equipped') : t('character.equip')}
                  </Button>
                ) : null}
              </label>
            ))}
          </div>
          <div style={{ marginTop: tokens.spacing.lg }}>
            <Button type="button" onClick={() => void save()} disabled={busy}>
              {busy ? t('character.saving') : t('character.save')}
            </Button>
          </div>
        </>
      )}
      {feedback ? <Typography style={{ color: tokens.colors.success, marginTop: tokens.spacing.md }}>{feedback}</Typography> : null}
      {error ? <Typography style={{ color: tokens.colors.error, marginTop: tokens.spacing.md }}>{error}</Typography> : null}
    </Card>
  );
}
