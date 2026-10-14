import { Badge, Card, Typography, tokens } from '../../design-system';
import { useI18n } from '../../hooks/useI18n';
import type { Skill } from '../../types/skill';

export function SkillCard({ skill }: { skill: Skill }) {
  const { t } = useI18n();

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: tokens.spacing.md }}>
        <div>
          <Typography as="h3">{skill.name}</Typography>
          <Typography>{skill.description}</Typography>
        </div>
        <Badge>{t('skills.maxRankLabel', { rank: skill.maxRank })}</Badge>
      </div>
      <Typography muted style={{ marginTop: tokens.spacing.sm }}>
        {skill.activationType} • {t('forms.mana')} {skill.manaCost} • {t('forms.stamina')} {skill.staminaCost} • {t('skills.minLevel')} {skill.minLevelRequirement}
      </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacing.sm, marginTop: tokens.spacing.md }}>
        {skill.tags.map((tag) => (
          <Badge key={tag} tone="warning">
            {tag}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
