import { useCallback, useEffect, useState } from 'react';
import { createCharacter, deleteCharacter, getCharacter, listCharacters, updateCharacter } from '../api/characters';
import { useApiContext } from '../contexts/ApiContext';
import type { Character, CharacterInput, CharacterUpdateInput } from '../types/character';
import { validateCharacterInput } from '../utils/validation';

const MAX_CHARACTERS_PER_USER = 20;

export function useCharacters() {
  const { graphqlClient } = useApiContext();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextCharacters = await listCharacters(graphqlClient);
      setCharacters(nextCharacters);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load characters.');
    } finally {
      setLoading(false);
    }
  }, [graphqlClient]);

  useEffect(() => {
    void loadCharacters();
  }, [loadCharacters]);

  const create = useCallback(
    async (input: CharacterInput) => {
      if (characters.length >= MAX_CHARACTERS_PER_USER) {
        throw new Error('Character limit reached. You can only create up to 20 characters.');
      }

      const validationError = validateCharacterInput(input);
      if (validationError) {
        throw new Error(validationError);
      }

      const created = await createCharacter(graphqlClient, input);
      setCharacters((current) => [...current, created]);
      return created;
    },
    [characters.length, graphqlClient],
  );

  const getById = useCallback((id: string) => getCharacter(graphqlClient, id), [graphqlClient]);

  const update = useCallback(
    async (id: string, input: CharacterUpdateInput) => {
      const validationError = validateCharacterInput(input);
      if (validationError) {
        throw new Error(validationError);
      }

      const updated = await updateCharacter(graphqlClient, id, input);
      setCharacters((current) => current.map((character) => (character.id === id ? updated : character)));
      return updated;
    },
    [graphqlClient],
  );

  const remove = useCallback(
    async (id: string) => {
      const removed = await deleteCharacter(graphqlClient, id);
      if (removed) {
        setCharacters((current) => current.filter((character) => character.id !== id));
      }
      return removed;
    },
    [graphqlClient],
  );

  return {
    characters,
    loading,
    error,
    canCreateMore: characters.length < MAX_CHARACTERS_PER_USER,
    loadCharacters,
    create,
    getById,
    update,
    remove,
  };
}
