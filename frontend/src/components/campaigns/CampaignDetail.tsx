import { Card, Typography, tokens } from '../../design-system';
import { useI18n } from '../../hooks/useI18n';
import type { Campaign } from '../../types/campaign';

export function CampaignDetail({ campaign }: { campaign: Campaign }) {
  const { t } = useI18n();

  return (
    <Card>
      <Typography as="h2">{campaign.name}</Typography>
      <Typography>{campaign.description || t('campaigns.noDescriptionFull')}</Typography>
      <Typography muted style={{ marginTop: tokens.spacing.md }}>
        {t('campaigns.gameMaster')}: {campaign.gameMasterId}
      </Typography>
      <Typography style={{ marginTop: tokens.spacing.md }}>{campaign.notes || t('campaigns.noNotes')}</Typography>
      <div style={{ display: 'grid', gap: tokens.spacing.xs, marginTop: tokens.spacing.lg }}>
        <Typography>{t('campaigns.players')}: {campaign.playerIds.length}</Typography>
        <Typography>{t('campaigns.assignedCharacters')}: {campaign.characterIds.length}</Typography>
      </div>
    </Card>
  );
}
