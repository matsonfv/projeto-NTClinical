// ─── Importações ────────────────────────────────────────────────────────────
import { useState } from 'react';
import { MG, ADMIN_EMAIL, ADMIN_PASSWORD } from '../data/mockData';
import { useNavigate } from 'react-router';
import { ArrowLeft, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogoPlaceholder } from './ui/LogoPlaceholder';
import { DarkModeToggle } from './ui/DarkModeToggle';


// ─── Componente Principal: AdminLogin ────────────────────────────────────────
// Tela de login do administrador com validação de e-mail e senha
export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

      // Verifica as credenciais simuladas (email/senha do mock)
    const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    setTimeout(() => {
      if (email.trim() === ADMIN_EMAIL && senha === ADMIN_PASSWORD) {
        login({ type: 'admin' });
        navigate('/admin');
      } else {
        setErro('Credenciais inválidas. Verifique e-mail e senha.');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ fontFamily: "'Inter', sans-serif", backgroundColor: t.bgSubtle }}
    >
      <div className="w-full max-w-sm">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm transition-colors mb-8"
          style={{ color: t.textMuted }}
        >
          <ArrowLeft size={15} />
          Voltar
        </button>

        {/* Card */}
        <div
          className="rounded-2xl px-8 py-10 shadow-sm"
          style={{
            backgroundColor: t.card,
            border: `1px solid ${t.border}`,
          }}
        >
          {/* Logo + badge */}
          <div className="flex items-center justify-between mb-8">
            <LogoPlaceholder size="md" />
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
              style={{ backgroundColor: isDark ? 'rgba(60,90,62,0.25)' : '#EFF5EF', color: MG }}
            >
              <ShieldCheck size={12} />
              Admin
            </div>
          </div>

          <h1 className="mb-1" style={{ fontWeight: 600, color: t.text }}>
            Acesso Administrativo
          </h1>
          <p className="text-sm mb-8" style={{ color: t.textMuted }}>
            Restrito a administradores autorizados.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* E-mail */}
            <div>
              <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErro(''); }}
                required
                className="w-full py-2.5 text-sm border-0 border-b-2 bg-transparent outline-none transition-colors"
                style={{
                  borderBottomColor: erro ? '#EF4444' : MG,
                  color: t.inputText,
                }}
              />
            </div>

            {/* Senha */}
            <div>
              <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>
                Senha
              </label>
              <div className="relative">
                <input
                  type={showSenha ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => { setSenha(e.target.value); setErro(''); }}
                  required
                  className="w-full py-2.5 pr-10 text-sm border-0 border-b-2 bg-transparent outline-none transition-colors"
                  style={{
                    borderBottomColor: erro ? '#EF4444' : MG,
                    color: t.inputText,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: t.textFaint }}
                >
                  {showSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="flex items-center gap-1.5">
                <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-500">{erro}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !senha}
              className="w-full py-3 rounded-xl text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: MG, fontWeight: 500 }}
            >
              {loading ? 'Autenticando...' : 'Entrar'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: isDark ? 'rgba(60,90,62,0.18)' : '#EFF5EF' }}>
            <p className="text-xs mb-1.5" style={{ color: MG, fontWeight: 500 }}>
              Credenciais de demonstração:
            </p>
            <button
              type="button"
              onClick={() => { setEmail(ADMIN_EMAIL); setSenha(ADMIN_PASSWORD); }}
              className="text-xs block hover:underline"
              style={{ color: MG, fontFamily: 'monospace' }}
            >
              {ADMIN_EMAIL} / {ADMIN_PASSWORD}
            </button>
          </div>
        </div>
      </div>

      {/* Floating dark mode toggle */}
      <DarkModeToggle variant="floating" />
    </div>
  );
}