import { Button, Card, Typography } from '../../design-system';
import { useI18n } from '../../hooks/useI18n';

export function InvitePlayer({ onInvite }: { onInvite: () => void }) {
  const { t } = useI18n();

  return (
    <Card>
      <Typography as="h3">{t('campaigns.invitePlayers')}</Typography>
      <Typography muted>{t('campaigns.inviteHelp')}</Typography>
      <Button onClick={onInvite} style={{ marginTop: 16 }}>
        {t('campaigns.copyInvite')}
      </Button>
    </Card>
  );
}
