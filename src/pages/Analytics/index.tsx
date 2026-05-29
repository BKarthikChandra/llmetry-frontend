import '../Chat/Chat.css';

export function AnalyticsPage() {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-icon">
        <BarChartIcon />
      </div>
      <h1 className="coming-soon-title">Analytics</h1>
      <p className="coming-soon-desc">Usage metrics, latency trends, and error analytics — coming soon.</p>
    </div>
  );
}

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1={18} y1={20} x2={18} y2={10} />
      <line x1={12} y1={20} x2={12} y2={4} />
      <line x1={6} y1={20} x2={6} y2={14} />
    </svg>
  );
}
