import type { Skill } from '../../types/skill';
import { tokens } from '../../design-system';

type SkillSelectorProps = {
  skills: Skill[];
  selectedSkillIds: string[];
  onChange: (nextSkillIds: string[]) => void;
};

export function SkillSelector({ skills, selectedSkillIds, onChange }: SkillSelectorProps) {
  const toggleSkill = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) {
      onChange(selectedSkillIds.filter((id) => id !== skillId));
      return;
    }

    onChange([...selectedSkillIds, skillId]);
  };

  return (
    <div style={{ display: 'grid', gap: tokens.spacing.sm }}>
      {skills.map((skill) => (
        <label key={skill.id} style={{ display: 'flex', gap: tokens.spacing.sm, alignItems: 'center' }}>
          <input type="checkbox" checked={selectedSkillIds.includes(skill.id)} onChange={() => toggleSkill(skill.id)} />
          <span>
            {skill.name} (Rank {skill.rank})
          </span>
        </label>
      ))}
    </div>
  );
}
