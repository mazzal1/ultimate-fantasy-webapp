import { beforeEach, describe, expect, it, vi } from 'vitest';

const { characterModel, userModel } = vi.hoisted(() => ({
  characterModel: {
    countDocuments: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    find: vi.fn(),
  },
  userModel: {
    findByIdAndUpdate: vi.fn(),
  },
}));

vi.mock('../../src/db/connection.js', () => ({ connectToDatabase: vi.fn().mockResolvedValue({}) }));
vi.mock('../../src/db/models/Character.js', () => ({ Character: characterModel }));
vi.mock('../../src/db/models/User.js', () => ({ User: userModel }));

import { handler as createCharacter } from '../../src/resolvers/characters/createCharacter.js';
import { handler as listCharacters } from '../../src/resolvers/characters/listCharacters.js';

const event = {
  identity: {
    username: 'ranger',
    claims: {
      sub: 'user-1',
      email: 'ranger@example.com',
      'cognito:groups': ['Players'],
    },
  },
};

describe('character resolvers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a character with derived resource values', async () => {
    characterModel.countDocuments.mockResolvedValue(2);
    characterModel.create.mockResolvedValue({ toJSON: () => ({ id: 'char-1', name: 'Aela', currentHp: 12, maxHp: 12 }) });

    const result = await createCharacter({
      ...event,
      arguments: { input: { name: 'Aela', maxHp: 12, maxStamina: 8, maxMana: 5 } },
    });

    expect(characterModel.create).toHaveBeenCalledWith(expect.objectContaining({ currentHp: 12, currentStamina: 8, currentMana: 5 }));
    expect(userModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(result).toEqual({ id: 'char-1', name: 'Aela', currentHp: 12, maxHp: 12 });
  });

  it('lists characters for the authenticated user', async () => {
    characterModel.find.mockReturnValue({
      sort: vi.fn().mockResolvedValue([{ toJSON: () => ({ id: 'char-1', userId: 'user-1' }) }]),
    });

    const result = await listCharacters({ ...event, arguments: {} });

    expect(characterModel.find).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(result).toEqual([{ id: 'char-1', userId: 'user-1' }]);
  });
});
