import { useCallback, useEffect, useState } from 'react';
import { assignCharacterToCampaign, createCampaign, getCampaign, joinCampaign, listCampaigns, updateCampaign } from '../api/campaigns';
import { useApiContext } from '../contexts/ApiContext';
import type { Campaign, CampaignInput } from '../types/campaign';
import { validateCampaignInput } from '../utils/validation';

export function useCampaigns() {
  const { graphqlClient } = useApiContext();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setCampaigns(await listCampaigns(graphqlClient));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load campaigns.');
    } finally {
      setLoading(false);
    }
  }, [graphqlClient]);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  const create = useCallback(
    async (input: CampaignInput) => {
      const validationError = validateCampaignInput(input);
      if (validationError) {
        throw new Error(validationError);
      }

      const created = await createCampaign(graphqlClient, input);
      setCampaigns((current) => [...current, created]);
      return created;
    },
    [graphqlClient],
  );

  const getById = useCallback((id: string) => getCampaign(graphqlClient, id), [graphqlClient]);

  const update = useCallback(
    async (id: string, input: CampaignInput) => {
      const updated = await updateCampaign(graphqlClient, id, input);
      setCampaigns((current) => current.map((campaign) => (campaign.id === id ? updated : campaign)));
      return updated;
    },
    [graphqlClient],
  );

  const join = useCallback(
    async (campaignId: string) => {
      const updated = await joinCampaign(graphqlClient, campaignId);
      setCampaigns((current) => current.map((campaign) => (campaign.id === campaignId ? { ...campaign, ...updated } : campaign)));
      return updated;
    },
    [graphqlClient],
  );

  const assignCharacter = useCallback(
    async (campaignId: string, characterId: string) => {
      const updated = await assignCharacterToCampaign(graphqlClient, campaignId, characterId);
      setCampaigns((current) => current.map((campaign) => (campaign.id === campaignId ? { ...campaign, ...updated } : campaign)));
      return updated;
    },
    [graphqlClient],
  );

  return { campaigns, loading, error, loadCampaigns, create, getById, update, join, assignCharacter };
}
