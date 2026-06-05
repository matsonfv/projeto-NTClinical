// ─── Importações ────────────────────────────────────────────────────────────
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';


// ─── Componente: DarkModeToggle ──────────────────────────────────────────────
// Toggle de tema claro/escuro. Variante 'floating' aparece fixo no canto;
// variante 'inline' encaixa no header
export function DarkModeToggle({ variant = 'inline' } = {}) {
  const { isDark, toggleTheme, t } = useTheme();

  const button = (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: variant === 'floating' ? '10px 16px' : '6px 12px',
        borderRadius: '999px',
        border: `1.5px solid ${t.borderMd}`,
        backgroundColor: t.card,
        color: t.textMuted,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: variant === 'floating'
          ? isDark
            ? '0 4px 24px rgba(0,0,0,0.55), 0 0 0 1px rgba(60,90,62,0.3)'
            : '0 4px 20px rgba(0,0,0,0.12)'
          : 'none',
        fontSize: '0.78rem',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {/* Track */}
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          width: '34px',
          height: '20px',
          borderRadius: '999px',
          backgroundColor: isDark ? '#3C5A3E' : '#E5E7EB',
          transition: 'background-color 0.25s ease',
          flexShrink: 0,
        }}
      >
        {/* Thumb */}
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: isDark ? '17px' : '3px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transition: 'left 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </span>

      {isDark ? (
        <Moon size={13} style={{ color: '#94A3B8' }} />
      ) : (
        <Sun size={13} style={{ color: '#F59E0B' }} />
      )}

      <span style={{ color: t.textMuted }}>
        {isDark ? 'Escuro' : 'Claro'}
      </span>
    </button>
  );

      // Modo flutuante: posição fixa no canto inferior direito
    if (variant === 'floating') {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
        }}
      >
        {button}
      </div>
    );
  }

      // Modo inline: renderiza o botão diretamente
    return button;
}