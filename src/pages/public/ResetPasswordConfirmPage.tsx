import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { updatePassword } from '../../lib/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ResetPasswordConfirmPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check if we have an access token in the URL (Supabase magic link format)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      setHasToken(true);
    } else {
      setError('Invalid or expired reset link. Please request a new one.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(newPassword);
      // Success! Redirect to login with success message
      navigate('/login', { state: { message: 'Password updated successfully. Please sign in.' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-lg shadow-sm p-8">
          <h1 className="font-display text-3xl text-text-high mb-2 text-center">
            Set New Password
          </h1>
          <p className="text-text-muted text-center mb-8">
            Enter your new password below
          </p>

          {!hasToken ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/reset-password')}
              >
                Request New Reset Link
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
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
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export { ResetPasswordConfirmPage as Component };
