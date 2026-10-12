import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CharacterSheet } from '../components/characters/CharacterSheet';
import { AppLayout } from '../components/layout/AppLayout';
import { Spinner, Typography, tokens } from '../design-system';
import { useCharacters } from '../hooks/useCharacters';
import type { Character } from '../types/character';

export function CharacterDetailPage() {
  const { id = '' } = useParams();
  const { getById } = useCharacters();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getById(id)
      .then((value) => {
        if (active) {
          setCharacter(value);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load character.');
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
      {loading ? <Spinner /> : null}
      {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
      {character ? <CharacterSheet character={character} /> : null}
    </AppLayout>
  );
}
