import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--text-h)' }}>Dashboard</h1>
      <p style={{ margin: 0, color: 'var(--text)' }}>
        Signed in as <strong style={{ color: 'var(--text-h)' }}>{user?.email}</strong>
      </p>
      <button
        onClick={handleLogout}
        style={{
          padding: '9px 20px',
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontFamily: 'var(--sans)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Sign out
      </button>
    </div>
  );
}
