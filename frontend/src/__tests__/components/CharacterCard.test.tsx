import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CharacterCard } from '../../components/characters/CharacterCard';
import { I18nProvider } from '../../contexts/I18nContext';
import type { Character } from '../../types/character';

const character: Character = {
  id: 'char-1',
  userId: 'user-1',
  name: 'Aelar',
  background: 'Moonlit ranger',
  race: 'Elf',
  gender: 'Non-binary',
  level: 7,
  currentHp: 11,
  maxHp: 15,
  currentStamina: 14,
  maxStamina: 18,
  currentMana: 9,
  maxMana: 12,
  wounds: 1,
  statPoints: 2,
  skillPoints: 3,
  coreStats: {
    strength: 'E',
    agility: 'D',
    dexterity: 'C',
    resilience: 'D',
    magic: 'E',
    willpower: 'E',
    acumen: 'E',
    charisma: 'F',
    luck: 'F',
  },
  competencyStates: [],
  skillStates: [{ skillId: 'skill-1', rank: 'F' }, { skillId: 'skill-2', rank: 'E' }],
  titleIds: [],
  itemStates: [],
  competencies: [],
  skills: [],
  titles: [],
  items: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('CharacterCard', () => {
  it('renders key character details', () => {
    render(
      <I18nProvider>
        <BrowserRouter>
          <CharacterCard character={character} />
        </BrowserRouter>
      </I18nProvider>,
    );

    expect(screen.getByText('Aelar')).toBeInTheDocument();
    expect(screen.getByText(/Stamina: 14\/18/)).toBeInTheDocument();
    expect(screen.getByText(/2 skills/)).toBeInTheDocument();
  });
});
