import { beforeEach, describe, expect, it, vi } from 'vitest';

const { campaignDocument, campaignModel, characterModel } = vi.hoisted(() => ({
  campaignDocument: {
    id: 'camp-1',
    gameMasterId: 'user-1',
    playerIds: ['user-1'],
    characterIds: [],
    save: vi.fn().mockResolvedValue(undefined),
    toJSON: () => ({ id: 'camp-1', gameMasterId: 'user-1', playerIds: ['user-1', 'user-2'], characterIds: [] }),
  },
  campaignModel: {
    create: vi.fn(),
    findById: vi.fn(),
  },
  characterModel: {
    findById: vi.fn(),
  },
}));

vi.mock('../../src/db/connection.js', () => ({ connectToDatabase: vi.fn().mockResolvedValue({}) }));
vi.mock('../../src/db/models/Campaign.js', () => ({ Campaign: campaignModel }));
vi.mock('../../src/db/models/Character.js', () => ({ Character: characterModel }));

import { handler as createCampaign } from '../../src/resolvers/campaigns/createCampaign.js';
import { handler as joinCampaign } from '../../src/resolvers/campaigns/joinCampaign.js';
import { handler as assignCharacter } from '../../src/resolvers/campaigns/assignCharacter.js';

const gmEvent = {
  identity: {
    username: 'gm',
    claims: { sub: 'user-1', email: 'gm@example.com', 'cognito:groups': ['Admins'] },
  },
};

const playerEvent = {
  identity: {
    username: 'player',
    claims: { sub: 'user-2', email: 'player@example.com', 'cognito:groups': ['Players'] },
  },
};

describe('campaign resolvers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    campaignDocument.playerIds = ['user-1'];
    campaignDocument.characterIds = [];
  });

  it('creates a campaign with the gm seeded as a player', async () => {
    campaignModel.create.mockResolvedValue({ toJSON: () => ({ id: 'camp-1', playerIds: ['user-1'] }) });

    const result = await createCampaign({ ...gmEvent, arguments: { input: { name: 'Dragonfall' } } });

    expect(campaignModel.create).toHaveBeenCalledWith(expect.objectContaining({ gameMasterId: 'user-1', playerIds: ['user-1'] }));
    expect(result).toEqual({ id: 'camp-1', playerIds: ['user-1'] });
  });

  it('adds a new player when joining a campaign', async () => {
    campaignModel.findById.mockResolvedValue(campaignDocument);

    const result = await joinCampaign({ ...playerEvent, arguments: { campaignId: 'camp-1' } });

    expect(campaignDocument.playerIds).toContain('user-2');
    expect(campaignDocument.save).toHaveBeenCalled();
    expect(result.id).toBe('camp-1');
  });

  it('assigns a character when the owner belongs to the campaign', async () => {
    campaignDocument.playerIds = ['user-1', 'user-2'];
    campaignModel.findById.mockResolvedValue(campaignDocument);
    characterModel.findById.mockResolvedValue({ id: 'char-9', userId: 'user-2' });

    const result = await assignCharacter({ ...playerEvent, arguments: { campaignId: 'camp-1', characterId: 'char-9' } });

    expect(campaignDocument.characterIds).toContain('char-9');
    expect(result.id).toBe('camp-1');
  });
});
