import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CharacterCard } from '../../components/characters/CharacterCard';

const character = {
  id: 'char-1',
  userId: 'user-1',
  name: 'Aelar',
  background: 'Moonlit ranger',
  level: 7,
  currentHp: 28,
  maxHp: 32,
  currentStamina: 14,
  maxStamina: 18,
  currentMana: 9,
  maxMana: 12,
  strength: 10,
  dexterity: 18,
  constitution: 14,
  intelligence: 13,
  wisdom: 16,
  charisma: 11,
  skills: ['skill-1', 'skill-2'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('CharacterCard', () => {
  it('renders key character details', () => {
    render(
      <BrowserRouter>
        <CharacterCard character={character} />
      </BrowserRouter>,
    );

    expect(screen.getByText('Aelar')).toBeInTheDocument();
    expect(screen.getByText(/HP: 28\/32/)).toBeInTheDocument();
    expect(screen.getByText(/2 skills/)).toBeInTheDocument();
  });
});
