import { Link } from 'react-router-dom';
import { Badge, Card, Typography, tokens } from '../../design-system';
import type { Campaign } from '../../types/campaign';

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: tokens.spacing.md }}>
        <div>
          <Typography as="h3">{campaign.name}</Typography>
          <Typography>{campaign.description || 'No description yet.'}</Typography>
        </div>
        <Badge tone="warning">{campaign.playerIds.length} players</Badge>
      </div>
      <Link to={`/campaigns/${campaign.id}`} style={{ color: tokens.colors.secondary, marginTop: tokens.spacing.md, display: 'inline-block' }}>
        Open campaign
      </Link>
    </Card>
  );
}
