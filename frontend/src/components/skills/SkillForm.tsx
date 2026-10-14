import { useMemo, useState } from 'react';
import { Button, Input, TextArea, tokens } from '../../design-system';
import { useI18n } from '../../hooks/useI18n';
import type { Rank } from '../../types/character';
import type { SkillInput } from '../../types/skill';

const defaults: SkillInput = {
  name: '',
  description: '',
  maxRank: 'F',
  activationType: 'ACTION',
  manaCost: 0,
  staminaCost: 0,
  minLevelRequirement: 1,
  requiredAbilityIds: [],
  requiredTitleIds: [],
  tags: [],
};

const rankOptions: Rank[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];

export function SkillForm({ initialValue, onSubmit }: { initialValue?: Partial<SkillInput>; onSubmit: (input: SkillInput) => Promise<void> | void }) {
  const { t } = useI18n();
  const [form, setForm] = useState<SkillInput>(useMemo(() => ({ ...defaults, ...initialValue }), [initialValue]));

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(form);
      }}
      style={{ display: 'grid', gap: tokens.spacing.md }}
    >
      <Input label={t('forms.name')} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
      <TextArea label={t('forms.description')} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
      <label style={{ display: 'grid', gap: tokens.spacing.xs }}>
        <span>{t('forms.maxRank')}</span>
        <select
          value={form.maxRank}
          onChange={(event) => setForm((current) => ({ ...current, maxRank: event.target.value as Rank }))}
          style={{ padding: tokens.spacing.sm, borderRadius: tokens.radii.md }}
        >
          {rankOptions.map((rank) => (
            <option key={rank} value={rank}>
              {rank}
            </option>
          ))}
        </select>
      </label>
      <Input
        label={t('forms.activationType')}
        helperText={t('forms.activationTypeHelp')}
        value={form.activationType ?? 'ACTION'}
        onChange={(event) => setForm((current) => ({ ...current, activationType: event.target.value }))}
      />
      <Input label={t('forms.manaCost')} type="number" value={String(form.manaCost ?? 0)} onChange={(event) => setForm((current) => ({ ...current, manaCost: Number(event.target.value) }))} />
      <Input
        label={t('forms.staminaCost')}
        type="number"
        value={String(form.staminaCost ?? 0)}
        onChange={(event) => setForm((current) => ({ ...current, staminaCost: Number(event.target.value) }))}
      />
      <Input
        label={t('forms.minLevelRequirement')}
        type="number"
        value={String(form.minLevelRequirement ?? 1)}
        onChange={(event) => setForm((current) => ({ ...current, minLevelRequirement: Number(event.target.value) || 1 }))}
      />
      <Input
        label={t('forms.requiredSkillIds')}
        helperText={t('forms.csvIdsHelp')}
        value={(form.requiredAbilityIds ?? []).join(', ')}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            requiredAbilityIds: event.target.value.split(',').map((id) => id.trim()).filter(Boolean),
          }))
        }
      />
      <Input
        label={t('forms.requiredTitleIds')}
        helperText={t('forms.csvIdsHelp')}
        value={(form.requiredTitleIds ?? []).join(', ')}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            requiredTitleIds: event.target.value.split(',').map((id) => id.trim()).filter(Boolean),
          }))
        }
      />
      <Input
        label={t('forms.tags')}
        helperText={t('forms.tagsHelp')}
        value={form.tags.join(', ')}
        onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) }))}
      />
      <Button type="submit">{t('forms.saveSkill')}</Button>
    </form>
  );
}
