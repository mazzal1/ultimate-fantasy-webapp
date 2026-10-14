import { useMemo, useState } from 'react';
import { Button, Input, TextArea, tokens } from '../../design-system';
import { useI18n } from '../../hooks/useI18n';
import type { CharacterInput, CoreStats, Rank } from '../../types/character';

type CharacterFormProps = {
  initialValue?: Partial<CharacterInput>;
  onSubmit: (input: CharacterInput) => Promise<void> | void;
};

const defaultCoreStats: CoreStats = {
  strength: 'F',
  agility: 'F',
  dexterity: 'F',
  resilience: 'F',
  magic: 'F',
  willpower: 'F',
  acumen: 'F',
  charisma: 'F',
  luck: 'F',
};

const defaultValues: CharacterInput = {
  name: '',
  playerName: '',
  gender: '',
  race: '',
  age: undefined,
  background: '',
  level: 1,
  statPoints: 1,
  skillPoints: 1,
  coreStats: defaultCoreStats,
};

const rankOptions: Rank[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
const statLabels = Object.keys(defaultCoreStats) as Array<keyof CoreStats>;

export function CharacterForm({ initialValue, onSubmit }: CharacterFormProps) {
  const { t } = useI18n();
  const initialForm = useMemo(
    () => ({
      ...defaultValues,
      ...initialValue,
      coreStats: { ...defaultCoreStats, ...(initialValue?.coreStats ?? {}) },
    }),
    [initialValue],
  );
  const [form, setForm] = useState<CharacterInput>(initialForm);

  const setField = <K extends keyof CharacterInput>(field: K, value: CharacterInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const setCoreStat = (key: keyof CoreStats, rank: Rank) => {
    setForm((current) => ({ ...current, coreStats: { ...defaultCoreStats, ...(current.coreStats ?? {}), [key]: rank } }));
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(form);
      }}
      style={{ display: 'grid', gap: tokens.spacing.md }}
    >
      <Input label={t('forms.name')} value={form.name} onChange={(event) => setField('name', event.target.value)} />
      <Input label={t('forms.playerName')} value={form.playerName ?? ''} onChange={(event) => setField('playerName', event.target.value)} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: tokens.spacing.md }}>
        <Input label={t('forms.gender')} value={form.gender ?? ''} onChange={(event) => setField('gender', event.target.value)} />
        <Input label={t('forms.race')} value={form.race ?? ''} onChange={(event) => setField('race', event.target.value)} />
        <Input label={t('forms.age')} type="number" value={form.age ? String(form.age) : ''} onChange={(event) => setField('age', Number(event.target.value) || undefined)} />
      </div>
      <TextArea label={t('forms.background')} value={form.background} onChange={(event) => setField('background', event.target.value)} />
      <div style={{ display: 'grid', gap: tokens.spacing.sm }}>
        <strong>{t('forms.coreStats')}</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: tokens.spacing.sm }}>
          {statLabels.map((key) => (
            <label key={key} style={{ display: 'grid', gap: tokens.spacing.xs }}>
              <span>{key}</span>
              <select
                value={(form.coreStats ?? defaultCoreStats)[key]}
                onChange={(event) => setCoreStat(key, event.target.value as Rank)}
                style={{ padding: tokens.spacing.sm, borderRadius: tokens.radii.md }}
              >
                {rankOptions.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>
      <Button type="submit">{t('forms.saveCharacter')}</Button>
    </form>
  );
}
