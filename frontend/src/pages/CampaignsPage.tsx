import { useState } from 'react';
import { CampaignCard } from '../components/campaigns/CampaignCard';
import { CampaignForm } from '../components/campaigns/CampaignForm';
import { AppLayout } from '../components/layout/AppLayout';
import { Button, Card, Modal, Spinner, Typography, tokens } from '../design-system';
import { useCampaigns } from '../hooks/useCampaigns';

export function CampaignsPage() {
  const { campaigns, loading, error, create } = useCampaigns();
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <AppLayout>
      <div style={{ display: 'grid', gap: tokens.spacing.lg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: tokens.spacing.md }}>
          <div>
            <Typography as="h1">Campaigns</Typography>
            <Typography muted>Track parties, notes, and assigned adventurers.</Typography>
          </div>
          <Button onClick={() => setShowModal(true)}>New campaign</Button>
        </div>
        {loading ? <Spinner /> : null}
        {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
        {!loading && campaigns.length === 0 ? <Card><Typography muted>No campaigns created yet.</Typography></Card> : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: tokens.spacing.md }}>
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
      <Modal isOpen={showModal} title="Create campaign" onClose={() => setShowModal(false)}>
        {formError ? <Typography style={{ color: tokens.colors.error, marginBottom: tokens.spacing.md }}>{formError}</Typography> : null}
        <CampaignForm
          onSubmit={async (input) => {
            try {
              setFormError(null);
              await create(input);
              setShowModal(false);
            } catch (submitError) {
              setFormError(submitError instanceof Error ? submitError.message : 'Unable to create campaign.');
            }
          }}
        />
      </Modal>
    </AppLayout>
  );
}
