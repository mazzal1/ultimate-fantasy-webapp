import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CharacterSheet } from '../components/characters/CharacterSheet';
import { AppLayout } from '../components/layout/AppLayout';
import { Spinner, Typography, tokens } from '../design-system';
import { useCharacters } from '../hooks/useCharacters';
import { useI18n } from '../hooks/useI18n';
import { useSkills } from '../hooks/useSkills';
import type { Character } from '../types/character';

export function CharacterDetailPage() {
  const { t } = useI18n();
  const { id = '' } = useParams();
  const { getById, update } = useCharacters();
  const { skills, items, competencies, titles } = useSkills();
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
          setError(loadError instanceof Error ? loadError.message : t('characters.loadError'));
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
  }, [getById, id, t]);

  return (
    <AppLayout>
      {loading ? <Spinner /> : null}
      {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
      {character ? (
        <CharacterSheet
          character={character}
          skills={skills}
          items={items}
          competencies={competencies}
          titles={titles}
          onSave={async (input) => {
            const updated = await update(character.id, input);
            setCharacter(updated);
            return updated;
          }}
        />
      ) : null}
    </AppLayout>
  );
}
