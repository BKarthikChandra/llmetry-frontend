import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAuthErrorMessage } from '../../utils/errorMessage';

interface Props {
  onSwitchToSignup: () => void;
  onToast: (type: 'success' | 'error', message: string) => void;
}

export function LoginForm({ onSwitchToSignup, onToast }: Props) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const next: typeof errors = {};
    if (!email) {
      next.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid email address.';
    }
    if (!password) {
      next.password = 'Password is required.';
    } else if (password.length < 6) {
      next.password = 'Password must be at least 6 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/providers', { replace: true });
    } catch (err) {
      onToast('error', getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label className="form-label" htmlFor="login-email">Email</label>
        <div className="form-input-wrap">
          <input
            id="login-email"
            type="email"
            className={`form-input${errors.email ? ' error' : ''}`}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={isLoading}
          />
        </div>
        {errors.email && <p className="field-error">{errors.email}</p>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="login-password">Password</label>
        <div className="form-input-wrap">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            className={`form-input form-input-pw${errors.password ? ' error' : ''}`}
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={isLoading}
          />
          <button
            type="button"
            className="pw-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && <p className="field-error">{errors.password}</p>}
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading && <span className="btn-spinner" />}
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="login-switch">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup}>Create one</button>
      </p>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx={12} cy={12} r={3} />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1={1} y1={1} x2={23} y2={23} />
    </svg>
  );
}
