// ─── Importações ────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState } from 'react';


// ─── Paleta de Cores: Modo Claro ─────────────────────────────────────────────
// Todas as cores usadas no tema claro
const light = {
  bg:               '#ffffff',
  bgSubtle:         'rgba(249,250,251,0.6)',
  card:             '#ffffff',
  cardHover:        '#F9FAFB',
  border:           '#F0F0F0',
  borderMd:         '#E5E7EB',
  text:             '#111827',
  textSub:          '#374151',
  textMuted:        '#6B7280',
  textFaint:        '#9CA3AF',
  inputBg:          '#ffffff',
  inputBorder:      '#E5E7EB',
  inputText:        '#111827',
  inputPlaceholder: '#C4C4C4',
  divider:          '#F3F4F6',
  overlay:          'rgba(0,0,0,0.22)',
  headerBg:         '#ffffff',
  tint:             '#EFF5EF',
};


// ─── Paleta de Cores: Modo Escuro ────────────────────────────────────────────
// Todas as cores usadas no tema escuro
const dark = {
  bg:               '#111111',       // deep page base
  bgSubtle:         '#181818',       // slightly elevated surface
  card:             '#1E1E1E',       // card fill – distinct from base
  cardHover:        '#252525',
  border:           '#2A3F2A',       // subtle accent-green outline → cards pop
  borderMd:         '#333333',       // general divider / medium border
  text:             '#FFFFFF',       // pure white – headings & primary text
  textSub:          '#E0E0E0',       // crisp light gray – body copy
  textMuted:        '#A0AEC0',       // muted labels / secondary info
  textFaint:        '#718096',       // timestamps, footnotes
  inputBg:          '#121212',       // deep dark field background
  inputBorder:      '#3D3D3D',       // visible field outline
  inputText:        '#F5F5F5',       // high-contrast typed text
  inputPlaceholder: '#555555',       // placeholder – visible but not dominant
  divider:          '#1A1A1A',
  overlay:          'rgba(0,0,0,0.72)',
  headerBg:         '#0D0D0D',       // header slightly darker than page
  tint:             'rgba(60,90,62,0.25)',
};


// ─── Criação do Contexto de Tema ─────────────────────────────────────────────
const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  t: light,
});


// ─── Provider: ThemeProvider ─────────────────────────────────────────────────
// Aplica a classe 'dark' no <html> e persiste a preferência no localStorage
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('ntclinical-theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('ntclinical-theme', isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, t: isDark ? dark : light }}>
      {children}
    </ThemeContext.Provider>
  );
}


// ─── Hook: useTheme ──────────────────────────────────────────────────────────
// Retorna { isDark, toggleTheme, t } — use em qualquer componente
export function useTheme() {
  return useContext(ThemeContext);
}