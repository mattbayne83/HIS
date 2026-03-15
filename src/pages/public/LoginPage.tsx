import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signInWithEmail } from '../../lib/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-lg shadow-sm p-8">
          <h1 className="font-display text-3xl text-text-high mb-2 text-center">
            Admin Login
          </h1>
          <p className="text-text-muted text-center mb-8">
            Sign in to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-50 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>

            <div className="text-center mt-4">
              <Link
                to="/reset-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
