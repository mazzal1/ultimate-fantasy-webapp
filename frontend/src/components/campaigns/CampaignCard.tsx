import { Link } from 'react-router-dom';
import { Badge, Card, Typography, tokens } from '../../design-system';
import { useI18n } from '../../hooks/useI18n';
import type { Campaign } from '../../types/campaign';

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { t } = useI18n();

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: tokens.spacing.md }}>
        <div>
          <Typography as="h3">{campaign.name}</Typography>
          <Typography>{campaign.description || t('campaigns.noDescription')}</Typography>
        </div>
        <Badge tone="warning">{campaign.playerIds.length} {t('campaigns.playersLabel')}</Badge>
      </div>
      <Link to={`/campaigns/${campaign.id}`} style={{ color: tokens.colors.secondary, marginTop: tokens.spacing.md, display: 'inline-block' }}>
        {t('campaigns.open')}
      </Link>
    </Card>
  );
}
