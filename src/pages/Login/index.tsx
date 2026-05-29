import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import './Login.css';

type Tab = 'login' | 'signup';

interface Toast {
  type: 'success' | 'error';
  message: string;
  id: number;
}

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message, id: Date.now() });
  }

  if (isLoading) {
    return (
      <div className="auth-fullscreen-loader">
        <span className="auth-spinner" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/providers" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <h1 className="login-brand-name">LLMetry</h1>
          <p className="login-brand-tagline">AI observability platform</p>
        </div>

        <div className="login-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'login'}
            className={`login-tab${activeTab === 'login' ? ' active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Log in
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'signup'}
            className={`login-tab${activeTab === 'signup' ? ' active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign up
          </button>
        </div>

        <div className="login-form-body">
          {toast && (
            <div key={toast.id} className={`login-toast ${toast.type}`} role="alert">
              <span className="login-toast-icon">
                {toast.type === 'success' ? <CheckIcon /> : <AlertIcon />}
              </span>
              {toast.message}
            </div>
          )}

          {activeTab === 'login' ? (
            <LoginForm
              onSwitchToSignup={() => setActiveTab('signup')}
              onToast={showToast}
            />
          ) : (
            <SignupForm
              onSwitchToLogin={() => setActiveTab('login')}
              onToast={showToast}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={10} />
      <line x1={12} y1={8} x2={12} y2={12} />
      <line x1={12} y1={16} x2={12.01} y2={16} />
    </svg>
  );
}
