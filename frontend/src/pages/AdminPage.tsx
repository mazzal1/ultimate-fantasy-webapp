import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { SkillForm } from '../components/skills/SkillForm';
import { Button, Card, Modal, Typography, tokens } from '../design-system';
import { useSkills } from '../hooks/useSkills';

export function AdminPage() {
  const { skills, create } = useSkills();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <AppLayout>
      <div style={{ display: 'grid', gap: tokens.spacing.lg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography as="h1">Admin console</Typography>
            <Typography muted>Manage the shared skill compendium and governance flows.</Typography>
          </div>
          <Button onClick={() => setShowModal(true)}>Add skill</Button>
        </div>
        <Card>
          <Typography as="h3">Catalog summary</Typography>
          <Typography>{skills.length} skills published.</Typography>
          {message ? <Typography style={{ color: tokens.colors.success }}>{message}</Typography> : null}
          {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
        </Card>
      </div>
      <Modal isOpen={showModal} title="Create skill" onClose={() => setShowModal(false)}>
        <SkillForm
          onSubmit={async (input) => {
            try {
              setError(null);
              await create(input);
              setMessage(`Skill ${input.name} created successfully.`);
              setShowModal(false);
            } catch (submitError) {
              setError(submitError instanceof Error ? submitError.message : 'Unable to create skill.');
            }
          }}
        />
      </Modal>
    </AppLayout>
  );
}
