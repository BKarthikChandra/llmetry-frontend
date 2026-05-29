interface ProviderIconProps {
  displayName: string;
  size?: number;
}

const PROVIDER_COLORS: Record<string, { bg: string; color: string }> = {
  openai: { bg: '#10a37f', color: '#fff' },
  claude: { bg: '#d97706', color: '#fff' },
  anthropic: { bg: '#d97706', color: '#fff' },
  gemini: { bg: '#4285f4', color: '#fff' },
  google: { bg: '#4285f4', color: '#fff' },
  deepseek: { bg: '#ef4444', color: '#fff' },
};

function getProviderStyle(displayName: string) {
  const key = displayName.toLowerCase().split(/[\s(]/)[0];
  return PROVIDER_COLORS[key] ?? { bg: '#7c3aed', color: '#fff' };
}

function getInitials(displayName: string): string {
  const words = displayName.replace(/[()]/g, '').trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function ProviderIcon({ displayName, size = 36 }: ProviderIconProps) {
  const { bg, color } = getProviderStyle(displayName);
  const initials = getInitials(displayName);

  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: bg,
        color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.36,
        fontWeight: 700,
        fontFamily: 'var(--sans)',
        flexShrink: 0,
        letterSpacing: '-0.5px',
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
