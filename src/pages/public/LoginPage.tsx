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
        <div className="glass-heavy rounded-3xl shadow-2xl p-8 border border-white/30">
          <h1 className="font-display text-4xl font-bold text-primary mb-2 text-center">
            Admin Login
          </h1>
          <p className="text-neutral-600 text-center mb-8 font-medium">
            Sign in to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="glass-light"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="glass-light"
            />

            {error && (
              <div className="bg-red-50/50 backdrop-blur-sm border border-danger/30 text-danger px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="glass-primary"
              fullWidth
              loading={loading}
              size="lg"
              className="shadow-xl shadow-primary/20"
            >
              Sign In
            </Button>

            <div className="text-center mt-6">
              <Link
                to="/reset-password"
                className="text-sm font-medium text-neutral-500 hover:text-primary transition-colors duration-200 underline-offset-4 hover:underline"
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
