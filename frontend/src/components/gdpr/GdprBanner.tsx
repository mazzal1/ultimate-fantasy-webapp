import { useEffect, useState } from 'react';
import { Button, Card, Typography, tokens } from '../../design-system';
import { useI18n } from '../../hooks/useI18n';

const STORAGE_KEY = 'uf-gdpr-consent';

export function GdprBanner() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasConsent = window.localStorage.getItem(STORAGE_KEY);
    setVisible(!hasConsent);
  }, []);

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: tokens.spacing.lg, right: tokens.spacing.lg, left: tokens.spacing.lg, zIndex: 1000 }}>
      <Card style={{ display: 'flex', gap: tokens.spacing.md, justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography as="h3">{t('gdpr.title')}</Typography>
          <Typography muted>{t('gdpr.body')}</Typography>
        </div>
        <Button onClick={accept}>{t('gdpr.accept')}</Button>
      </Card>
    </div>
  );
}
