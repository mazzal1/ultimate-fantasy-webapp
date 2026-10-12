import { useMemo, useState } from 'react';
import { Button, Input, TextArea, tokens } from '../../design-system';
import type { CharacterInput } from '../../types/character';

type CharacterFormProps = {
  initialValue?: Partial<CharacterInput>;
  onSubmit: (input: CharacterInput) => Promise<void> | void;
};

const defaultValues: CharacterInput = {
  name: '',
  background: '',
  level: 1,
  maxHp: 10,
  maxStamina: 10,
  maxMana: 10,
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
};

export function CharacterForm({ initialValue, onSubmit }: CharacterFormProps) {
  const initialForm = useMemo(() => ({ ...defaultValues, ...initialValue }), [initialValue]);
  const [form, setForm] = useState<CharacterInput>(initialForm);

  const setField = <K extends keyof CharacterInput>(field: K, value: CharacterInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const numberField = (field: keyof CharacterInput, label: string) => (
    <Input
      label={label}
      type="number"
      value={String(form[field] ?? '')}
      onChange={(event) => setField(field, Number(event.target.value) as CharacterInput[keyof CharacterInput])}
    />
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(form);
      }}
      style={{ display: 'grid', gap: tokens.spacing.md }}
    >
      <Input label="Name" value={form.name} onChange={(event) => setField('name', event.target.value)} />
      <TextArea label="Background" value={form.background} onChange={(event) => setField('background', event.target.value)} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: tokens.spacing.md }}>
        {numberField('level', 'Level')}
        {numberField('maxHp', 'Max HP')}
        {numberField('maxStamina', 'Max Stamina')}
        {numberField('maxMana', 'Max Mana')}
        {numberField('strength', 'Strength')}
        {numberField('dexterity', 'Dexterity')}
        {numberField('constitution', 'Constitution')}
        {numberField('intelligence', 'Intelligence')}
        {numberField('wisdom', 'Wisdom')}
        {numberField('charisma', 'Charisma')}
      </div>
      <Button type="submit">Save character</Button>
    </form>
  );
}
