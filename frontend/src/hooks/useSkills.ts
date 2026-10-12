import { useCallback, useEffect, useState } from 'react';
import { createSkill, getSkill, listSkills, updateSkill } from '../api/skills';
import { useApiContext } from '../contexts/ApiContext';
import type { Skill, SkillInput } from '../types/skill';
import { validateSkillInput } from '../utils/validation';

export function useSkills() {
  const { graphqlClient } = useApiContext();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setSkills(await listSkills(graphqlClient));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load skills.');
    } finally {
      setLoading(false);
    }
  }, [graphqlClient]);

  useEffect(() => {
    void loadSkills();
  }, [loadSkills]);

  const create = useCallback(
    async (input: SkillInput) => {
      const validationError = validateSkillInput(input);
      if (validationError) {
        throw new Error(validationError);
      }

      const created = await createSkill(graphqlClient, input);
      setSkills((current) => [...current, created]);
      return created;
    },
    [graphqlClient],
  );

  const getById = useCallback((id: string) => getSkill(graphqlClient, id), [graphqlClient]);

  const update = useCallback(
    async (id: string, input: Partial<SkillInput>) => {
      const updated = await updateSkill(graphqlClient, id, input);
      setSkills((current) => current.map((skill) => (skill.id === id ? updated : skill)));
      return updated;
    },
    [graphqlClient],
  );

  return { skills, loading, error, loadSkills, create, getById, update };
}
