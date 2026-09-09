import { Button, Card, Typography } from '../../design-system';

export function InvitePlayer({ onInvite }: { onInvite: () => void }) {
  return (
    <Card>
      <Typography as="h3">Invite players</Typography>
      <Typography muted>Use your campaign share process to add more adventurers to the table.</Typography>
      <Button onClick={onInvite} style={{ marginTop: 16 }}>
        Copy invite workflow
      </Button>
    </Card>
  );
}
