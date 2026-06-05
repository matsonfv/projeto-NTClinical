// ─── Importações ────────────────────────────────────────────────────────────
import { useState } from 'react';
import { MG, chavesAcessoPaciente, patients } from '../data/mockData';
import { useNavigate } from 'react-router';
import { ArrowLeft, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogoPlaceholder } from './ui/LogoPlaceholder';
import { DarkModeToggle } from './ui/DarkModeToggle';


// ─── Componente Principal: PacienteAcesso ────────────────────────────────────
// Tela de login do paciente via chave de acesso (ex: PAC-ANA-001)
export default function PacienteAcesso() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, isDark } = useTheme();

  const [chave, setChave] = useState('');
  const [showChave, setShowChave] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    setTimeout(() => {
      const patientId = chavesAcessoPaciente[chave.trim().toUpperCase()];
      if (!patientId) {
        setErro('Chave de acesso inválida. Verifique e tente novamente.');
        setLoading(false);
        return;
      }
      const patient = patients.find((p) => p.id === patientId);
      if (!patient) {
        setErro('Paciente não encontrado.');
        setLoading(false);
        return;
      }
      login({ type: 'patient', patientId: patient.id, patientName: patient.name });
      navigate('/paciente/portal');
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ fontFamily: "'Inter', sans-serif", backgroundColor: t.bgSubtle }}
    >
      <div className="w-full max-w-sm">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm transition-colors mb-8"
          style={{ color: t.textMuted }}
        >
          <ArrowLeft size={15} />
          Voltar
        </button>

        {/* Card */}
        <div
          className="rounded-2xl px-8 py-10 shadow-sm"
          style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}
        >
          {/* Logo */}
          <div className="mb-8">
            <LogoPlaceholder size="md" />
          </div>

          <h1 className="mb-1" style={{ fontWeight: 600, color: t.text }}>
            Portal do Paciente
          </h1>
          <p className="text-sm mb-8" style={{ color: t.textMuted }}>
            Informe sua chave de acesso para visualizar seus dados.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Chave de Acesso */}
            <div>
              <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>
                Chave de Acesso
              </label>
              <div className="relative">
                <input
                  type={showChave ? 'text' : 'password'}
                  placeholder="ex: PAC-ANA-001"
                  value={chave}
                  onChange={(e) => { setChave(e.target.value); setErro(''); }}
                  required
                  className="w-full py-2.5 pr-10 text-sm border-0 border-b-2 bg-transparent outline-none tracking-wider transition-colors"
                  style={{
                    borderBottomColor: erro ? '#EF4444' : MG,
                    color: t.inputText,
                  }}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowChave(!showChave)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: t.textFaint }}
                >
                  {showChave ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {erro && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-500">{erro}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !chave.trim()}
              className="w-full py-3 rounded-xl text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: MG, fontWeight: 500 }}
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>

          {/* Demo keys */}
          <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: isDark ? 'rgba(60,90,62,0.18)' : '#EFF5EF' }}>
            <p className="text-xs mb-2" style={{ color: MG, fontWeight: 500 }}>
              Chaves de demonstração:
            </p>
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {Object.entries(chavesAcessoPaciente).slice(0, 4).map(([chave, id]) => {
                const pac = patients.find((p) => p.id === id);
                return (
                  <button
                    key={chave}
                    type="button"
                    onClick={() => setChave(chave)}
                    className="text-xs text-left block w-full hover:underline"
                    style={{ color: MG, fontFamily: 'monospace' }}
                  >
                    {chave} — {pac?.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Acesso Administrativo */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex-1 h-px" style={{ backgroundColor: t.border }} />
          <button
            onClick={() => navigate('/admin/login')}
            className="flex items-center gap-2 mx-4 text-xs transition-colors"
            style={{ color: t.textMuted }}
          >
            <Lock size={12} />
            Acesso Administrativo
          </button>
          <div className="flex-1 h-px" style={{ backgroundColor: t.border }} />
        </div>
      </div>

      {/* Floating dark mode toggle */}
      <DarkModeToggle variant="floating" />
    </div>
  );
}