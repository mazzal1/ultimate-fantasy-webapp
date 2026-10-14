import { useMemo, useState } from 'react';
import { SkillForm } from '../components/skills/SkillForm';
import { SkillList } from '../components/skills/SkillList';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../hooks/useAuth';
import { useCampaigns } from '../hooks/useCampaigns';
import { useI18n } from '../hooks/useI18n';
import { useSkills } from '../hooks/useSkills';
import { Button, Card, Input, Modal, Spinner, TextArea, Typography, tokens } from '../design-system';
import type { CompetencyInput, SkillInput } from '../types/skill';

const defaultCompetencyInput: CompetencyInput = {
  name: '',
  description: '',
  tags: [],
};

const defaultSkillInput: Partial<SkillInput> = {
  name: '',
  description: '',
  maxRank: 'F',
  activationType: 'ACTION',
  manaCost: 0,
  staminaCost: 0,
  minLevelRequirement: 1,
  requiredAbilityIds: [],
  requiredTitleIds: [],
  tags: [],
};

export function SkillsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { campaigns } = useCampaigns();
  const { skills, items, competencies, loading, error, create, createCompetency, shareSkill, shareCompetency } = useSkills();
  const [skillTag, setSkillTag] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [sharingError, setSharingError] = useState<string | null>(null);
  const [sharingMessage, setSharingMessage] = useState<string | null>(null);
  const [competencyModalOpen, setCompetencyModalOpen] = useState(false);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [competencyInput, setCompetencyInput] = useState<CompetencyInput>(defaultCompetencyInput);
  const [competencyError, setCompetencyError] = useState<string | null>(null);
  const [competencyMessage, setCompetencyMessage] = useState<string | null>(null);
  const [skillError, setSkillError] = useState<string | null>(null);
  const [skillMessage, setSkillMessage] = useState<string | null>(null);

  const filteredSkills = useMemo(
    () => (skillTag ? skills.filter((skill) => skill.tags.map((tag) => tag.toLowerCase()).includes(skillTag.toLowerCase())) : skills),
    [skills, skillTag],
  );

  const filteredItems = useMemo(() => {
    if (!itemSearch.trim()) {
      return items;
    }

    const query = itemSearch.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query));
  }, [items, itemSearch]);

  const shareableCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaign.playerIds.includes(user?.id ?? '') || campaign.gameMasterId === user?.id),
    [campaigns, user?.id],
  );

  const ownedSkills = useMemo(() => skills.filter((skill) => skill.ownerUserId === user?.id), [skills, user?.id]);
  const ownedCompetencies = useMemo(
    () => competencies.filter((competency) => competency.ownerUserId === user?.id),
    [competencies, user?.id],
  );

  const canShare = selectedCampaignId.length > 0;

  return (
    <AppLayout>
      <div style={{ display: 'grid', gap: tokens.spacing.lg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: tokens.spacing.md, alignItems: 'center' }}>
          <div>
            <Typography as="h1">{t('skills.title')}</Typography>
            <Typography muted>{t('skills.subtitle')}</Typography>
          </div>
          <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
            <Button type="button" onClick={() => setSkillModalOpen(true)}>
              {t('skills.newSkill')}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setCompetencyModalOpen(true)}>
              {t('skills.newCompetency')}
            </Button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: tokens.spacing.md }}>
          <Input
            label={t('skills.filterTag')}
            helperText={t('skills.filterTagHelp')}
            value={skillTag}
            onChange={(event) => setSkillTag(event.target.value)}
          />
          <Input
            label={t('skills.searchItems')}
            helperText={t('skills.searchItemsHelp')}
            value={itemSearch}
            onChange={(event) => setItemSearch(event.target.value)}
          />
        </div>

        <Card>
          <Typography as="h3">{t('skills.shareTitle')}</Typography>
          <label style={{ display: 'grid', gap: tokens.spacing.xs, marginTop: tokens.spacing.sm }}>
            <span>{t('skills.targetCampaign')}</span>
            <select
              value={selectedCampaignId}
              onChange={(event) => setSelectedCampaignId(event.target.value)}
              style={{ padding: tokens.spacing.sm, borderRadius: tokens.radii.md }}
            >
              <option value="">{t('skills.selectCampaign')}</option>
              {shareableCampaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </label>
          {sharingError ? <Typography style={{ color: tokens.colors.error, marginTop: tokens.spacing.sm }}>{sharingError}</Typography> : null}
          {sharingMessage ? <Typography style={{ color: tokens.colors.success, marginTop: tokens.spacing.sm }}>{sharingMessage}</Typography> : null}
          <div style={{ display: 'grid', gap: tokens.spacing.md, marginTop: tokens.spacing.md }}>
            <Typography as="h3">{t('skills.yourSkills')}</Typography>
            {ownedSkills.length === 0 ? <Typography muted>{t('skills.noOwnedSkills')}</Typography> : null}
            {ownedSkills.map((skill) => (
              <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', gap: tokens.spacing.md, alignItems: 'center' }}>
                <Typography>{skill.name}</Typography>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!canShare}
                  onClick={async () => {
                    try {
                      setSharingError(null);
                      await shareSkill(skill.id, selectedCampaignId);
                      setSharingMessage(t('skills.shareSkillSuccess', { name: skill.name }));
                    } catch (shareError) {
                      setSharingMessage(null);
                      setSharingError(shareError instanceof Error ? shareError.message : t('skills.shareSkillError'));
                    }
                  }}
                >
                  {t('skills.share')}
                </Button>
              </div>
            ))}
            <Typography as="h3">{t('skills.yourCompetencies')}</Typography>
            {ownedCompetencies.length === 0 ? <Typography muted>{t('skills.noOwnedCompetencies')}</Typography> : null}
            {ownedCompetencies.map((competency) => (
              <div key={competency.id} style={{ display: 'flex', justifyContent: 'space-between', gap: tokens.spacing.md, alignItems: 'center' }}>
                <Typography>{competency.name}</Typography>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!canShare}
                  onClick={async () => {
                    try {
                      setSharingError(null);
                      await shareCompetency(competency.id, selectedCampaignId);
                      setSharingMessage(t('skills.shareCompetencySuccess', { name: competency.name }));
                    } catch (shareError) {
                      setSharingMessage(null);
                      setSharingError(shareError instanceof Error ? shareError.message : t('skills.shareCompetencyError'));
                    }
                  }}
                >
                  {t('skills.share')}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Typography as="h3">{t('skills.competencies')}</Typography>
          <div style={{ display: 'grid', gap: tokens.spacing.sm, marginTop: tokens.spacing.sm }}>
            {competencies.map((competency) => (
              <div key={competency.id}>
                <Typography>
                  {competency.name} {competency.isSystem ? t('skills.systemTag') : ''}
                </Typography>
                <Typography muted>{competency.description}</Typography>
              </div>
            ))}
          </div>
        </Card>

        {loading ? <Spinner /> : null}
        {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
        {!loading ? (
          <>
            <Typography as="h2">{t('skills.skills')}</Typography>
            <SkillList skills={filteredSkills} />
            <Typography as="h2">{t('skills.items')}</Typography>
            <SkillList skills={filteredItems} />
          </>
        ) : null}
      </div>

      <Modal isOpen={skillModalOpen} title={t('skills.createSkillTitle')} onClose={() => setSkillModalOpen(false)}>
        {skillError ? <Typography style={{ color: tokens.colors.error, marginBottom: tokens.spacing.md }}>{skillError}</Typography> : null}
        <SkillForm
          initialValue={defaultSkillInput}
          onSubmit={async (input) => {
            try {
              setSkillError(null);
              const created = await create(input);
              setSkillMessage(t('skills.skillCreated', { name: created.name }));
              setSkillModalOpen(false);
            } catch (submitError) {
              setSkillMessage(null);
              setSkillError(submitError instanceof Error ? submitError.message : t('skills.createSkillError'));
            }
          }}
        />
      </Modal>

      <Modal isOpen={competencyModalOpen} title={t('skills.createCompetencyTitle')} onClose={() => setCompetencyModalOpen(false)}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void (async () => {
              try {
                setCompetencyError(null);
                const created = await createCompetency(competencyInput);
                setCompetencyMessage(t('skills.competencyCreated', { name: created.name }));
                setCompetencyInput(defaultCompetencyInput);
                setCompetencyModalOpen(false);
              } catch (submitError) {
                setCompetencyMessage(null);
                setCompetencyError(submitError instanceof Error ? submitError.message : t('skills.createCompetencyError'));
              }
            })();
          }}
          style={{ display: 'grid', gap: tokens.spacing.md }}
        >
          <Input
            label={t('forms.name')}
            value={competencyInput.name}
            onChange={(event) => setCompetencyInput((current) => ({ ...current, name: event.target.value }))}
          />
          <TextArea
            label={t('forms.description')}
            value={competencyInput.description}
            onChange={(event) => setCompetencyInput((current) => ({ ...current, description: event.target.value }))}
          />
          <Input
            label={t('forms.tags')}
            helperText={t('forms.tagsHelp')}
            value={competencyInput.tags.join(', ')}
            onChange={(event) =>
              setCompetencyInput((current) => ({
                ...current,
                tags: event.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              }))
            }
          />
          {competencyError ? <Typography style={{ color: tokens.colors.error }}>{competencyError}</Typography> : null}
          <Button type="submit">{t('skills.createCompetencyTitle')}</Button>
        </form>
      </Modal>
      {skillMessage ? <Typography style={{ color: tokens.colors.success }}>{skillMessage}</Typography> : null}
      {competencyMessage ? <Typography style={{ color: tokens.colors.success }}>{competencyMessage}</Typography> : null}
    </AppLayout>
  );
}
