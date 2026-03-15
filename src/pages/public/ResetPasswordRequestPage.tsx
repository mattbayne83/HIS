import { useState } from 'react';
import { Link } from 'react-router';
import { resetPasswordForEmail } from '../../lib/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/HIS/reset-password/confirm`;
      await resetPasswordForEmail(email, redirectTo);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-lg shadow-sm p-8">
          <h1 className="font-display text-3xl text-text-high mb-2 text-center">
            Reset Password
          </h1>
          <p className="text-text-muted text-center mb-8">
            Enter your email address and we'll send you a link to reset your password
          </p>

          {success ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-success text-success px-4 py-3 rounded-lg text-sm">
                Check your email for a password reset link. The link will expire in 1 hour.
              </div>
              <Link
                to="/login"
                className="block text-center text-sm text-primary hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
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
                Send Reset Link
              </Button>

              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="text-sm text-primary hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export { ResetPasswordRequestPage as Component };
