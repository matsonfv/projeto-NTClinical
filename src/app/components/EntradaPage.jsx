// ─── Importações ────────────────────────────────────────────────────────────
import { useNavigate } from 'react-router';
import { Stethoscope, UserRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { MG } from '../data/mockData';
import { LogoPlaceholder } from './ui/LogoPlaceholder';
import { DarkModeToggle } from './ui/DarkModeToggle';
import { useTheme } from '../context/ThemeContext';


// ─── Componente: PortalCard ──────────────────────────────────────────────────
// Card clicável de acesso ao portal (Médico ou Paciente)
function PortalCard({ icon: Icon, titulo, descricao, destino }) {
  const navigate = useNavigate();
  const { isDark, t } = useTheme();

  return (
    <button
      onClick={() => navigate(destino)}
      className="group flex flex-col items-start gap-6 w-full text-left transition-all duration-200 rounded-2xl p-10"
      style={{
        backgroundColor: t.card,
        border: `1px solid ${t.border}`,
      }}
      onMouseEnter={e => {
        (e.currentTarget).style.borderColor = MG;
      }}
      onMouseLeave={e => {
        (e.currentTarget).style.borderColor = t.border;
      }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#3C5A3E]"
        style={{ backgroundColor: isDark ? 'rgba(60,90,62,0.25)' : t.tint }}
      >
        <Icon
          size={24}
          className="transition-colors group-hover:text-white"
          style={{ color: MG }}
        />
      </div>

      <div className="flex-1">
        <h2 style={{ fontWeight: 600, color: t.text }}>{titulo}</h2>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: t.textMuted }}>{descricao}</p>
      </div>

      <div className="flex items-center gap-2 text-sm transition-colors" style={{ color: MG }}>
        <span style={{ fontWeight: 500 }}>Acessar</span>
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}


// ─── Componente Principal: EntradaPage ───────────────────────────────────────
// Página de entrada com os dois portais e acesso administrativo
export default function EntradaPage() {
  const navigate = useNavigate();
  const { t, isDark } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ fontFamily: "'Inter', sans-serif", backgroundColor: t.bg }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-14">
        <LogoPlaceholder size="lg" />
        <p className="text-sm tracking-wide mt-3" style={{ color: t.textFaint }}>
          Sistema de Gestão Clínica
        </p>
      </div>

      {/* Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
        <PortalCard
          icon={Stethoscope}
          titulo="Portal do Médico"
          descricao="Acesse sua agenda de atendimentos, consultas programadas e anexe resultados de exames."
          destino="/medico"
        />
        <PortalCard
          icon={UserRound}
          titulo="Portal do Paciente"
          descricao="Consulte seus agendamentos, dados cadastrais e faça download dos seus resultados de exames."
          destino="/paciente"
        />
      </div>

      {/* Admin access */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/admin/login')}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-200"
          style={{
            borderColor: t.borderMd,
            backgroundColor: 'transparent',
            color: t.textFaint,
          }}
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.borderColor = MG;
            el.style.backgroundColor = 'rgba(60,90,62,0.08)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.borderColor = t.borderMd;
            el.style.backgroundColor = 'transparent';
          }}
        >
          <ShieldCheck size={15} style={{ color: t.textFaint }} />
          <span className="text-sm" style={{ fontWeight: 500, color: t.textFaint }}>
            Área Administrativa
          </span>
          <ArrowRight size={13} style={{ color: t.textFaint }} />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-xs" style={{ color: t.textFaint }}>
          © NTClinical 2026 · Sistema de Gestão Clínica
        </p>
      </div>

      {/* Floating dark mode toggle */}
      <DarkModeToggle variant="floating" />
    </div>
  );
}