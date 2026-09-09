import { AppLayout } from '../components/layout/AppLayout';
import { SkillList } from '../components/skills/SkillList';
import { Spinner, Typography, tokens } from '../design-system';
import { useSkills } from '../hooks/useSkills';

export function SkillsPage() {
  const { skills, loading, error } = useSkills();

  return (
    <AppLayout>
      <div style={{ display: 'grid', gap: tokens.spacing.lg }}>
        <div>
          <Typography as="h1">Skill compendium</Typography>
          <Typography muted>Browse passive, action, reaction, and power source abilities.</Typography>
        </div>
        {loading ? <Spinner /> : null}
        {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
        {!loading ? <SkillList skills={skills} /> : null}
      </div>
    </AppLayout>
  );
}
