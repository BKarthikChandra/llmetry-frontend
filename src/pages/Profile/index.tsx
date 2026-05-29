import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import './Profile.css';

export function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

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
            <span className="profile-badge">API coming soon</span>
          </div>
          <div className="profile-card-body">
            <div className="profile-field">
              <label className="profile-label" htmlFor="current-password">Current password</label>
              <input
                id="current-password"
                type="password"
                className="profile-input"
                placeholder="••••••••"
                disabled
              />
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                className="profile-input"
                placeholder="Min. 6 characters"
                disabled
              />
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="confirm-password">Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                className="profile-input"
                placeholder="Re-enter new password"
                disabled
              />
            </div>
            <button className="profile-btn" disabled>Update password</button>
          </div>
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
