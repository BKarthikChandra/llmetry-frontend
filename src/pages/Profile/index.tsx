import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { resetPassword } from '../../services/authService';
import { getApiErrorMessage } from '../../utils/errorMessage';
import './Profile.css';

export function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwStatus, setPwStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    setPwLoading(true);
    setPwStatus(null);
    try {
      await resetPassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwStatus({ type: 'success', message: 'Password updated successfully.' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwStatus({ type: 'error', message: getApiErrorMessage(err) });
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">Profile & Settings</h1>
        <p className="profile-subtitle">Manage your account and preferences.</p>
      </div>

      <div className="profile-sections">
        {/* Account */}
        <section className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">Account</h2>
          </div>
          <div className="profile-card-body">
            <div className="profile-field">
              <label className="profile-label">Email</label>
              <div className="profile-value">{user?.email}</div>
            </div>
          </div>
        </section>

        {/* Password */}
        <section className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">Password</h2>
          </div>
          <form className="profile-card-body" onSubmit={handlePasswordSubmit}>
            <div className="profile-field">
              <label className="profile-label" htmlFor="current-password">Current password</label>
              <input
                id="current-password"
                type="password"
                className="profile-input"
                placeholder="••••••••"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                disabled={pwLoading}
                required
              />
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                className="profile-input"
                placeholder="Min. 6 characters"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                disabled={pwLoading}
                required
              />
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="confirm-password">Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                className="profile-input"
                placeholder="Re-enter new password"
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                disabled={pwLoading}
                required
              />
            </div>
            {pwStatus && (
              <p className={`profile-status profile-status--${pwStatus.type}`}>{pwStatus.message}</p>
            )}
            <button
              type="submit"
              className="profile-btn"
              disabled={pwLoading || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword}
            >
              {pwLoading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </section>

        {/* Theme */}
        <section className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">Appearance</h2>
          </div>
          <div className="profile-card-body">
            <p className="profile-field-desc">Choose your preferred interface theme.</p>
            <div className="theme-options">
              <button
                className={`theme-option${theme === 'dark' ? ' active' : ''}`}
                onClick={() => setTheme('dark')}
                aria-pressed={theme === 'dark'}
              >
                <span className="theme-option-icon">
                  <MoonIcon />
                </span>
                <span>Dark</span>
                {theme === 'dark' && <span className="theme-check"><CheckIcon /></span>}
              </button>
              <button
                className={`theme-option${theme === 'light' ? ' active' : ''}`}
                onClick={() => setTheme('light')}
                aria-pressed={theme === 'light'}
              >
                <span className="theme-option-icon">
                  <SunIcon />
                </span>
                <span>Light</span>
                {theme === 'light' && <span className="theme-check"><CheckIcon /></span>}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={5} />
      <line x1={12} y1={1} x2={12} y2={3} />
      <line x1={12} y1={21} x2={12} y2={23} />
      <line x1={4.22} y1={4.22} x2={5.64} y2={5.64} />
      <line x1={18.36} y1={18.36} x2={19.78} y2={19.78} />
      <line x1={1} y1={12} x2={3} y2={12} />
      <line x1={21} y1={12} x2={23} y2={12} />
      <line x1={4.22} y1={19.78} x2={5.64} y2={18.36} />
      <line x1={18.36} y1={5.64} x2={19.78} y2={4.22} />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
