import { Card, Typography, tokens } from '../../design-system';
import type { Character } from '../../types/character';

const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;

export function CharacterSheet({ character }: { character: Character }) {
  return (
    <Card>
      <Typography as="h2">{character.name}</Typography>
      <Typography muted>{character.background || 'No background written yet.'}</Typography>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: tokens.spacing.md, marginTop: tokens.spacing.lg }}>
        <Card elevated={false} style={{ background: tokens.colors.surfaceAlt }}>
          <Typography>HP</Typography>
          <Typography as="h3">
            {character.currentHp}/{character.maxHp}
          </Typography>
        </Card>
        <Card elevated={false} style={{ background: tokens.colors.surfaceAlt }}>
          <Typography>Stamina</Typography>
          <Typography as="h3">
            {character.currentStamina}/{character.maxStamina}
          </Typography>
        </Card>
        <Card elevated={false} style={{ background: tokens.colors.surfaceAlt }}>
          <Typography>Mana</Typography>
          <Typography as="h3">
            {character.currentMana}/{character.maxMana}
          </Typography>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: tokens.spacing.md, marginTop: tokens.spacing.lg }}>
        {stats.map((stat) => (
          <Card key={stat} elevated={false} style={{ background: tokens.colors.surfaceAlt }}>
            <Typography>{stat}</Typography>
            <Typography as="h3">{character[stat]}</Typography>
          </Card>
        ))}
      </div>
    </Card>
  );
}
