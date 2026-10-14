import { Link } from 'react-router-dom';
import { Badge, Card, Typography, tokens } from '../../design-system';
import { useI18n } from '../../hooks/useI18n';
import type { Character } from '../../types/character';
import { formatResource } from '../../utils/formatting';

export function CharacterCard({ character }: { character: Character }) {
  const { t } = useI18n();

  return (
    <Card data-testid="character-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: tokens.spacing.md }}>
        <div style={{ display: 'grid', gap: tokens.spacing.xs }}>
          <Typography as="h3">{character.name}</Typography>
          <Typography muted>{t('common.level')} {character.level}</Typography>
          <Typography muted>
            {character.race || t('campaigns.unknownRace')} • {character.gender || t('character.unknownGender')}
          </Typography>
          <Typography>{character.background || t('forms.background')}</Typography>
        </div>
        <Badge>{character.skillStates.length} {t('skills.skills').toLowerCase()}</Badge>
      </div>
      <div style={{ display: 'grid', gap: tokens.spacing.xs, marginTop: tokens.spacing.md }}>
        <Typography>{t('forms.stamina')}: {formatResource(character.currentStamina, character.maxStamina)}</Typography>
        <Typography>{t('forms.mana')}: {formatResource(character.currentMana, character.maxMana)}</Typography>
        <Typography>{t('forms.wounds')}: {character.wounds}/8</Typography>
      </div>
      <Link to={`/characters/${character.id}`} style={{ color: tokens.colors.secondary, marginTop: tokens.spacing.md, display: 'inline-block' }}>
        {t('character.viewSheet')}
      </Link>
    </Card>
  );
}
