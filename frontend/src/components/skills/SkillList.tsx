import type { Skill } from '../../types/skill';
import { tokens, Typography } from '../../design-system';
import { SkillCard } from './SkillCard';

export function SkillList({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) {
    return <Typography muted>No skills have been registered yet.</Typography>;
  }

  return (
    <div style={{ display: 'grid', gap: tokens.spacing.md }}>
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}
