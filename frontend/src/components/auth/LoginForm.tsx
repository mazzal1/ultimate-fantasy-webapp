import { useState } from 'react';
import { Button, Card, Input, Typography, tokens } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';

export function LoginForm() {
  const { signIn } = useAuth();
  const { t } = useI18n();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await signIn({ username, password });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('auth.login.error'));
    }
  };

  return (
    <Card style={{ width: '100%', maxWidth: 420 }}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: tokens.spacing.md }}>
        <Typography as="h1">{t('auth.login.title')}</Typography>
        <Input label={t('auth.username')} value={username} onChange={(event) => setUsername(event.target.value)} />
        <Input label={t('auth.password')} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
        <Button type="submit" fullWidth>
          {t('auth.signIn')}
        </Button>
      </form>
    </Card>
  );
}
