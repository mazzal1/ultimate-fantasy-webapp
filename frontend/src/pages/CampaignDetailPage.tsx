import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CampaignDetail } from '../components/campaigns/CampaignDetail';
import { InvitePlayer } from '../components/campaigns/InvitePlayer';
import { AppLayout } from '../components/layout/AppLayout';
import { Card, Spinner, Typography, tokens } from '../design-system';
import { useCampaigns } from '../hooks/useCampaigns';
import { useI18n } from '../hooks/useI18n';
import type { Campaign } from '../types/campaign';
import type { CampaignCharacterSummary } from '../api/campaigns';

export function CampaignDetailPage() {
  const { t } = useI18n();
  const { id = '' } = useParams();
  const { getById, listCharacters } = useCampaigns();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [characters, setCharacters] = useState<CampaignCharacterSummary[]>([]);
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
          setError(loadError instanceof Error ? loadError.message : t('campaigns.loadError'));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    listCharacters(id)
      .then((value) => {
        if (active) {
          setCharacters(value);
        }
      })
      .catch(() => {
        if (active) {
          setCharacters([]);
        }
      });

    return () => {
      active = false;
    };
  }, [getById, id, listCharacters, t]);

  return (
    <AppLayout>
      <div style={{ display: 'grid', gap: tokens.spacing.lg }}>
        {loading ? <Spinner /> : null}
        {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
        {campaign ? <CampaignDetail campaign={campaign} /> : null}
        {!loading ? (
          <Card>
            <Typography as="h3">{t('campaigns.roster')}</Typography>
            {characters.length === 0 ? <Typography muted>{t('campaigns.rosterEmpty')}</Typography> : null}
            <div style={{ display: 'grid', gap: tokens.spacing.xs }}>
              {characters.map((character) => (
                <Typography key={character.id}>
                  {character.name} — {t('common.level')} {character.level} ({character.race || t('campaigns.unknownRace')})
                </Typography>
              ))}
            </div>
          </Card>
        ) : null}
        {message ? (
          <Card>
            <Typography style={{ color: tokens.colors.success }}>{message}</Typography>
          </Card>
        ) : null}
        <InvitePlayer onInvite={() => setMessage(t('campaigns.inviteHint'))} />
      </div>
    </AppLayout>
  );
}
