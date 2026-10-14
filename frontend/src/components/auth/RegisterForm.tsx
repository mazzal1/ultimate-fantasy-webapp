import { useState } from 'react';
import { Button, Card, Input, Typography, tokens } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';
import { validateEmail } from '../../utils/validation';

export function RegisterForm() {
  const { signUp, confirmSignUp } = useAuth();
  const { t } = useI18n();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmationCode: '' });
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!validateEmail(form.email)) {
      setError(t('auth.invalidEmail'));
      return;
    }

    try {
      await signUp({ username: form.username, email: form.email, password: form.password });
      setNeedsConfirmation(true);
      setMessage(t('auth.register.success'));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('auth.register.error'));
    }
  };

  const handleConfirm = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await confirmSignUp({ username: form.username, confirmationCode: form.confirmationCode });
      setMessage(t('auth.confirm.success'));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('auth.confirm.error'));
    }
  };

  return (
    <Card style={{ width: '100%', maxWidth: 520 }}>
      <form onSubmit={needsConfirmation ? handleConfirm : handleRegister} style={{ display: 'grid', gap: tokens.spacing.md }}>
        <Typography as="h1">{t('auth.register.title')}</Typography>
        <Input label={t('auth.username')} value={form.username} onChange={(event) => updateField('username', event.target.value)} />
        {!needsConfirmation ? (
          <>
            <Input label={t('auth.email')} type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
            <Input label={t('auth.password')} type="password" value={form.password} onChange={(event) => updateField('password', event.target.value)} />
          </>
        ) : (
          <Input label={t('auth.confirmationCode')} value={form.confirmationCode} onChange={(event) => updateField('confirmationCode', event.target.value)} />
        )}
        {message ? <Typography style={{ color: tokens.colors.success }}>{message}</Typography> : null}
        {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
        <Button type="submit" fullWidth>
          {needsConfirmation ? t('auth.confirmAccount') : t('auth.register')}
        </Button>
      </form>
    </Card>
  );
}
