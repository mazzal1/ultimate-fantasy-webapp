import { useMemo, useState } from 'react';
import { Button, Input, TextArea, tokens } from '../../design-system';
import { useI18n } from '../../hooks/useI18n';
import type { CampaignInput } from '../../types/campaign';

export function CampaignForm({ initialValue, onSubmit }: { initialValue?: Partial<CampaignInput>; onSubmit: (input: CampaignInput) => Promise<void> | void }) {
  const { t } = useI18n();
  const [form, setForm] = useState<CampaignInput>(useMemo(() => ({ name: '', description: '', notes: '', ...initialValue }), [initialValue]));

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(form);
      }}
      style={{ display: 'grid', gap: tokens.spacing.md }}
    >
      <Input label={t('forms.name')} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
      <Input label={t('forms.description')} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
      <TextArea label={t('forms.notes')} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
      <Button type="submit">{t('forms.saveCampaign')}</Button>
    </form>
  );
}
