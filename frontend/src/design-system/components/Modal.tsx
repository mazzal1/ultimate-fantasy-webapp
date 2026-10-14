import type { ReactNode } from 'react';
import { tokens } from '../tokens';
import { Card } from './Card';
import { Button } from './Button';
import { useI18n } from '../../hooks/useI18n';

type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const { t } = useI18n();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: 'fixed',
        inset: 0,
        background: tokens.colors.overlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.spacing.lg,
        zIndex: 1000,
      }}
    >
      <Card style={{ width: 'min(640px, 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacing.md }}>
          <h2 style={{ margin: 0, fontFamily: tokens.fonts.heading }}>{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label={t('modal.close')}>
            {t('modal.close')}
          </Button>
        </div>
        {children}
      </Card>
    </div>
  );
}
