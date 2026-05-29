import { useState, type FormEvent } from 'react';
import { useProviders } from '../../context/ProviderContext';
import { getApiErrorMessage } from '../../utils/errorMessage';

interface Props {
  providerId: number;
  displayName: string;
}

export function RegisterForm({ providerId, displayName }: Props) {
  const { registerProvider } = useProviders();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('API key is required.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await registerProvider(providerId, apiKey.trim());
      setSuccess(true);
      setApiKey('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to register provider. Please check your API key.'));
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="register-success">
        <span className="register-success-icon"><CheckCircleIcon /></span>
        <div>
          <p className="register-success-title">{displayName} connected successfully</p>
          <p className="register-success-desc">You can now add models below.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <p className="register-form-desc">
        Provide your {displayName} API key to connect this provider.
      </p>

      {error && (
        <div className="register-error" role="alert">
          <AlertIcon />
          {error}
        </div>
      )}

      <div className="register-field">
        <label className="detail-label" htmlFor={`apikey-${providerId}`}>API Key</label>
        <div className="register-input-wrap">
          <input
            id={`apikey-${providerId}`}
            type={showKey ? 'text' : 'password'}
            className="detail-input"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="button"
            className="detail-icon-btn"
            onClick={() => setShowKey((v) => !v)}
            aria-label={showKey ? 'Hide key' : 'Show key'}
            tabIndex={-1}
          >
            {showKey ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <button type="submit" className="detail-btn-primary" disabled={isLoading}>
        {isLoading && <span className="detail-spinner" />}
        {isLoading ? 'Connecting…' : 'Connect provider'}
      </button>
    </form>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={10} />
      <line x1={12} y1={8} x2={12} y2={12} />
      <line x1={12} y1={16} x2={12.01} y2={16} />
    </svg>
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
