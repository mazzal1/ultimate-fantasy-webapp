import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { SkillForm } from '../components/skills/SkillForm';
import { Button, Card, Modal, Typography, tokens } from '../design-system';
import { useI18n } from '../hooks/useI18n';
import { useSkills } from '../hooks/useSkills';

export function AdminPage() {
  const { t } = useI18n();
  const { skills, create } = useSkills();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <AppLayout>
      <div style={{ display: 'grid', gap: tokens.spacing.lg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography as="h1">{t('admin.title')}</Typography>
            <Typography muted>{t('admin.subtitle')}</Typography>
          </div>
          <Button onClick={() => setShowModal(true)}>{t('admin.addSkill')}</Button>
        </div>
        <Card>
          <Typography as="h3">{t('admin.catalog')}</Typography>
          <Typography>{t('admin.skillsPublished', { count: skills.length })}</Typography>
          {message ? <Typography style={{ color: tokens.colors.success }}>{message}</Typography> : null}
          {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
        </Card>
      </div>
      <Modal isOpen={showModal} title={t('admin.createSkillTitle')} onClose={() => setShowModal(false)}>
        <SkillForm
          onSubmit={async (input) => {
            try {
              setError(null);
              await create(input);
              setMessage(t('admin.createSkillSuccess', { name: input.name }));
              setShowModal(false);
            } catch (submitError) {
              setError(submitError instanceof Error ? submitError.message : t('admin.createSkillError'));
            }
          }}
        />
      </Modal>
    </AppLayout>
  );
}
