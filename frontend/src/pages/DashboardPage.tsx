import { AppLayout } from '../components/layout/AppLayout';
import { Card, Typography, tokens } from '../design-system';
import { useAuth } from '../hooks/useAuth';
import { useCampaigns } from '../hooks/useCampaigns';
import { useCharacters } from '../hooks/useCharacters';
import { useSkills } from '../hooks/useSkills';

export function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { characters } = useCharacters();
  const { campaigns } = useCampaigns();
  const { skills } = useSkills();

  return (
    <AppLayout>
      <div style={{ display: 'grid', gap: tokens.spacing.lg }}>
        <div>
          <Typography as="h1">Welcome back, {user?.username ?? 'Adventurer'}</Typography>
          <Typography muted>{isAdmin ? 'You wield admin powers over the compendium.' : 'Manage your roster, campaigns, and growth path.'}</Typography>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: tokens.spacing.md }}>
          <Card>
            <Typography as="h3">Characters</Typography>
            <Typography>{characters.length} on your roster</Typography>
          </Card>
          <Card>
            <Typography as="h3">Campaigns</Typography>
            <Typography>{campaigns.length} active adventures</Typography>
          </Card>
          <Card>
            <Typography as="h3">Skills</Typography>
            <Typography>{skills.length} known abilities</Typography>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
