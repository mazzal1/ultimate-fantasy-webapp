import { useState } from 'react';
import { CharacterCard } from '../components/characters/CharacterCard';
import { CharacterForm } from '../components/characters/CharacterForm';
import { AppLayout } from '../components/layout/AppLayout';
import { Button, Card, Modal, Spinner, Typography, tokens } from '../design-system';
import { useCharacters } from '../hooks/useCharacters';

export function CharactersPage() {
  const { characters, loading, error, canCreateMore, create } = useCharacters();
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <AppLayout>
      <div style={{ display: 'grid', gap: tokens.spacing.lg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: tokens.spacing.md }}>
          <div>
            <Typography as="h1">Characters</Typography>
            <Typography muted>Build and track your heroes. Limit: 20 characters per user.</Typography>
          </div>
          <Button onClick={() => setShowModal(true)} disabled={!canCreateMore}>
            New character
          </Button>
        </div>
        {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
        {loading ? <Spinner /> : null}
        {!loading && characters.length === 0 ? <Card><Typography muted>No characters created yet.</Typography></Card> : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: tokens.spacing.md }}>
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </div>
      <Modal isOpen={showModal} title="Create character" onClose={() => setShowModal(false)}>
        {formError ? <Typography style={{ color: tokens.colors.error, marginBottom: tokens.spacing.md }}>{formError}</Typography> : null}
        <CharacterForm
          onSubmit={async (input) => {
            try {
              setFormError(null);
              await create(input);
              setShowModal(false);
            } catch (submitError) {
              setFormError(submitError instanceof Error ? submitError.message : 'Unable to create character.');
            }
          }}
        />
      </Modal>
    </AppLayout>
  );
}
