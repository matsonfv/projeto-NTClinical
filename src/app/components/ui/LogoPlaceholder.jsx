// ─── Importações ────────────────────────────────────────────────────────────
import { MG } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';


// ─── Componente: LogoPlaceholder ─────────────────────────────────────────────
// Renderiza o logotipo NT + Clinical em três tamanhos (sm, md, lg)
export function LogoPlaceholder({ size = 'md' } = {}) {
  const { isDark } = useTheme();

  const cfg = {
    sm: {
      badge:    { fontSize: '0.62rem', padding: '4px 9px',   borderRadius: '6px' },
      clinical: '0.82rem',
      gap:      '7px',
      tracking: '0.18em',
    },
    md: {
      badge:    { fontSize: '0.72rem', padding: '5px 11px',  borderRadius: '7px' },
      clinical: '0.98rem',
      gap:      '8px',
      tracking: '0.18em',
    },
    lg: {
      badge:    { fontSize: '0.92rem', padding: '6px 14px',  borderRadius: '8px' },
      clinical: '1.22rem',
      gap:      '10px',
      tracking: '0.20em',
    },
  }[size];

  const clinicalColor = isDark ? '#FFFFFF' : '#1A1A1A';

  return (
    <div className="flex items-center select-none" style={{ gap: cfg.gap }}>

      {/* ── NT badge ── */}
      <span
        style={{
          ...cfg.badge,
          backgroundColor: MG,
          color: '#FFFFFF',
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          boxShadow: isDark
            ? '0 0 0 1px rgba(60,90,62,0.5), 0 2px 8px rgba(60,90,62,0.30)'
            : '0 1px 4px rgba(60,90,62,0.22)',
        }}
      >
        NT
      </span>

      {/* ── Clinical wordmark ── */}
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
          fontSize: cfg.clinical,
          fontWeight: 700,
          letterSpacing: cfg.tracking,
          textTransform: 'uppercase',
          color: clinicalColor,
          lineHeight: 1,
          transition: 'color 0.25s ease',
        }}
      >
        Clinical
      </span>
    </div>
  );
}
