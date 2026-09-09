import { Link } from 'react-router-dom';
import { Badge, Card, Typography, tokens } from '../../design-system';
import type { Character } from '../../types/character';
import { formatResource } from '../../utils/formatting';

export function CharacterCard({ character }: { character: Character }) {
  return (
    <Card data-testid="character-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: tokens.spacing.md }}>
        <div style={{ display: 'grid', gap: tokens.spacing.xs }}>
          <Typography as="h3">{character.name}</Typography>
          <Typography muted>Level {character.level}</Typography>
          <Typography>{character.background || 'No background recorded yet.'}</Typography>
        </div>
        <Badge>{character.skills.length} skills</Badge>
      </div>
      <div style={{ display: 'grid', gap: tokens.spacing.xs, marginTop: tokens.spacing.md }}>
        <Typography>HP: {formatResource(character.currentHp, character.maxHp)}</Typography>
        <Typography>Stamina: {formatResource(character.currentStamina, character.maxStamina)}</Typography>
        <Typography>Mana: {formatResource(character.currentMana, character.maxMana)}</Typography>
      </div>
      <Link to={`/characters/${character.id}`} style={{ color: tokens.colors.secondary, marginTop: tokens.spacing.md, display: 'inline-block' }}>
        View sheet
      </Link>
    </Card>
  );
}
