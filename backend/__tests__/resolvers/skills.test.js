import { beforeEach, describe, expect, it, vi } from 'vitest';

const { skillModel } = vi.hoisted(() => ({
  skillModel: {
    create: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock('../../src/db/connection.js', () => ({ connectToDatabase: vi.fn().mockResolvedValue({}) }));
vi.mock('../../src/db/models/Skill.js', () => ({ Skill: skillModel }));

import { handler as createSkill } from '../../src/resolvers/skills/createSkill.js';
import { handler as listSkills } from '../../src/resolvers/skills/listSkills.js';

const adminEvent = {
  identity: {
    username: 'admin',
    claims: {
      sub: 'user-1',
      email: 'admin@example.com',
      'cognito:groups': ['Admins'],
    },
  },
};

describe('skill resolvers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a skill for admins', async () => {
    skillModel.create.mockResolvedValue({ toJSON: () => ({ id: 'skill-1', name: 'Arc Burst' }) });

    const result = await createSkill({
      ...adminEvent,
      arguments: { input: { name: 'Arc Burst', effect: 'Deal arcane damage', rank: 2, tags: ['Action'] } },
    });

    expect(skillModel.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Arc Burst', tags: ['Action'] }));
    expect(result).toEqual({ id: 'skill-1', name: 'Arc Burst' });
  });

  it('lists skills ordered query results', async () => {
    skillModel.find.mockReturnValue({ sort: vi.fn().mockResolvedValue([{ toJSON: () => ({ id: 'skill-2' }) }]) });

    const result = await listSkills({});

    expect(result).toEqual([{ id: 'skill-2' }]);
  });
});
