import type { Skill } from '../../types/skill';
import { tokens, Typography } from '../../design-system';
import { useI18n } from '../../hooks/useI18n';
import { SkillCard } from './SkillCard';

export function SkillList({ skills }: { skills: Skill[] }) {
  const { t } = useI18n();

  if (skills.length === 0) {
    return <Typography muted>{t('skills.noOwnedSkills')}</Typography>;
  }

  return (
    <div style={{ display: 'grid', gap: tokens.spacing.md }}>
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}
