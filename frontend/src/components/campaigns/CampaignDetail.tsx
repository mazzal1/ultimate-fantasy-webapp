import { Card, Typography, tokens } from '../../design-system';
import type { Campaign } from '../../types/campaign';

export function CampaignDetail({ campaign }: { campaign: Campaign }) {
  return (
    <Card>
      <Typography as="h2">{campaign.name}</Typography>
      <Typography>{campaign.description || 'No description available.'}</Typography>
      <Typography muted style={{ marginTop: tokens.spacing.md }}>
        Game master: {campaign.gameMasterId}
      </Typography>
      <Typography style={{ marginTop: tokens.spacing.md }}>{campaign.notes || 'No notes recorded yet.'}</Typography>
      <div style={{ display: 'grid', gap: tokens.spacing.xs, marginTop: tokens.spacing.lg }}>
        <Typography>Players: {campaign.playerIds.length}</Typography>
        <Typography>Assigned characters: {campaign.characterIds.length}</Typography>
      </div>
    </Card>
  );
}
