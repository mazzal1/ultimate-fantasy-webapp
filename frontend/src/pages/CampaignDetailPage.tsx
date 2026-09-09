import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CampaignDetail } from '../components/campaigns/CampaignDetail';
import { InvitePlayer } from '../components/campaigns/InvitePlayer';
import { AppLayout } from '../components/layout/AppLayout';
import { Card, Spinner, Typography, tokens } from '../design-system';
import { useCampaigns } from '../hooks/useCampaigns';
import type { Campaign } from '../types/campaign';

export function CampaignDetailPage() {
  const { id = '' } = useParams();
  const { getById } = useCampaigns();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getById(id)
      .then((value) => {
        if (active) {
          setCampaign(value);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load campaign.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [getById, id]);

  return (
    <AppLayout>
      <div style={{ display: 'grid', gap: tokens.spacing.lg }}>
        {loading ? <Spinner /> : null}
        {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
        {campaign ? <CampaignDetail campaign={campaign} /> : null}
        {message ? (
          <Card>
            <Typography style={{ color: tokens.colors.success }}>{message}</Typography>
          </Card>
        ) : null}
        <InvitePlayer onInvite={() => setMessage('Share your secure invite workflow from Cognito/AppSync-integrated onboarding.')} />
      </div>
    </AppLayout>
  );
}
