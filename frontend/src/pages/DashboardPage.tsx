import { AppLayout } from '../components/layout/AppLayout';
import { Card, Typography, tokens } from '../design-system';
import { useAuth } from '../hooks/useAuth';
import { useCampaigns } from '../hooks/useCampaigns';
import { useCharacters } from '../hooks/useCharacters';
import { useI18n } from '../hooks/useI18n';
import { useSkills } from '../hooks/useSkills';

export function DashboardPage() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  const { characters } = useCharacters();
  const { campaigns } = useCampaigns();
  const { skills } = useSkills();

  return (
    <AppLayout>
      <div style={{ display: 'grid', gap: tokens.spacing.lg }}>
        <div>
          <Typography as="h1">{t('dashboard.welcome', { username: user?.username ?? t('dashboard.defaultName') })}</Typography>
          <Typography muted>{isAdmin ? t('dashboard.adminHint') : t('dashboard.userHint')}</Typography>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: tokens.spacing.md }}>
          <Card>
            <Typography as="h3">{t('dashboard.characters')}</Typography>
            <Typography>{t('dashboard.charactersCount', { count: characters.length })}</Typography>
          </Card>
          <Card>
            <Typography as="h3">{t('dashboard.campaigns')}</Typography>
            <Typography>{t('dashboard.campaignsCount', { count: campaigns.length })}</Typography>
          </Card>
          <Card>
            <Typography as="h3">{t('dashboard.skills')}</Typography>
            <Typography>{t('dashboard.skillsCount', { count: skills.length })}</Typography>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
