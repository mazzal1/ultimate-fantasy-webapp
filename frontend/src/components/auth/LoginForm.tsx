import { useState } from 'react';
import { Button, Card, Input, Typography, tokens } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';

export function LoginForm() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await signIn({ username, password });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in.');
    }
  };

  return (
    <Card style={{ width: '100%', maxWidth: 420 }}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: tokens.spacing.md }}>
        <Typography as="h1">Return to the realm</Typography>
        <Input label="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        {error ? <Typography style={{ color: tokens.colors.error }}>{error}</Typography> : null}
        <Button type="submit" fullWidth>
          Sign in
        </Button>
      </form>
    </Card>
  );
}
