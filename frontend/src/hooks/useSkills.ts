import { useCallback, useEffect, useState } from 'react';
import {
  createCompetency,
  createSkill,
  getSkill,
  listCompetencies,
  listItems,
  listSkills,
  listTitles,
  shareCompetency,
  shareSkill,
  updateSkill,
} from '../api/skills';
import { useApiContext } from '../contexts/ApiContext';
import type { Competency, CompetencyInput, Item, Skill, SkillInput, Title } from '../types/skill';
import { validateCompetencyInput, validateSkillInput } from '../utils/validation';

export function useSkills() {
  const { graphqlClient } = useApiContext();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [nextSkills, nextItems, nextCompetencies, nextTitles] = await Promise.all([
        listSkills(graphqlClient),
        listItems(graphqlClient),
        listCompetencies(graphqlClient),
        listTitles(graphqlClient),
      ]);
      setSkills(nextSkills);
      setItems(nextItems);
      setCompetencies(nextCompetencies);
      setTitles(nextTitles);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load compendium.');
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

  const createNewCompetency = useCallback(
    async (input: CompetencyInput) => {
      const validationError = validateCompetencyInput(input);
      if (validationError) {
        throw new Error(validationError);
      }

      const created = await createCompetency(graphqlClient, input);
      setCompetencies((current) => [...current, created]);
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

  const shareSkillWithCampaign = useCallback(
    async (skillId: string, campaignId: string) => {
      const updated = await shareSkill(graphqlClient, skillId, campaignId);
      setSkills((current) => current.map((skill) => (skill.id === skillId ? updated : skill)));
      return updated;
    },
    [graphqlClient],
  );

  const shareCompetencyWithCampaign = useCallback(
    async (competencyId: string, campaignId: string) => {
      const updated = await shareCompetency(graphqlClient, competencyId, campaignId);
      setCompetencies((current) => current.map((entry) => (entry.id === competencyId ? updated : entry)));
      return updated;
    },
    [graphqlClient],
  );

  return {
    skills,
    items,
    competencies,
    titles,
    loading,
    error,
    loadSkills,
    create,
    createCompetency: createNewCompetency,
    getById,
    update,
    shareSkill: shareSkillWithCampaign,
    shareCompetency: shareCompetencyWithCampaign,
  };
}
