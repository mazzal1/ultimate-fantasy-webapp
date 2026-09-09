import { Badge, Card, Typography, tokens } from '../../design-system';
import type { Skill } from '../../types/skill';

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: tokens.spacing.md }}>
        <div>
          <Typography as="h3">{skill.name}</Typography>
          <Typography>{skill.effect}</Typography>
        </div>
        <Badge>Rank {skill.rank}</Badge>
      </div>
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
