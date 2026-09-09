import { useMemo, useState } from 'react';
import { Button, Input, TextArea, tokens } from '../../design-system';
import type { SkillInput } from '../../types/skill';

const defaults: SkillInput = {
  name: '',
  effect: '',
  rank: 1,
  minLevelRequirement: 1,
  requiredSkillId: '',
  requiredSkillRank: 1,
  tags: [],
};

export function SkillForm({ initialValue, onSubmit }: { initialValue?: Partial<SkillInput>; onSubmit: (input: SkillInput) => Promise<void> | void }) {
  const [form, setForm] = useState<SkillInput>(useMemo(() => ({ ...defaults, ...initialValue }), [initialValue]));

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(form);
      }}
      style={{ display: 'grid', gap: tokens.spacing.md }}
    >
      <Input label="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
      <TextArea label="Effect" value={form.effect} onChange={(event) => setForm((current) => ({ ...current, effect: event.target.value }))} />
      <Input label="Rank" type="number" value={String(form.rank)} onChange={(event) => setForm((current) => ({ ...current, rank: Number(event.target.value) }))} />
      <Input
        label="Minimum level"
        type="number"
        value={String(form.minLevelRequirement ?? '')}
        onChange={(event) => setForm((current) => ({ ...current, minLevelRequirement: Number(event.target.value) || undefined }))}
      />
      <Input
        label="Required skill id"
        value={form.requiredSkillId ?? ''}
        onChange={(event) => setForm((current) => ({ ...current, requiredSkillId: event.target.value || undefined }))}
      />
      <Input
        label="Required skill rank"
        type="number"
        value={String(form.requiredSkillRank ?? '')}
        onChange={(event) => setForm((current) => ({ ...current, requiredSkillRank: Number(event.target.value) || undefined }))}
      />
      <Input
        label="Tags"
        helperText="Comma-separated values like Passive, Action, Source of Power"
        value={form.tags.join(', ')}
        onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) }))}
      />
      <Button type="submit">Save skill</Button>
    </form>
  );
}
