// ─── Importações ────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  LogOut, Stethoscope, Microscope, Download, FileText,
  CalendarDays, User, History, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { MG, tipoLabel, statusLabel, examPrep, Appointment } from '../data/mockData';
import { LogoPlaceholder } from './ui/LogoPlaceholder';
import { DarkModeToggle } from './ui/DarkModeToggle';

const TODAY = '2026-04-09';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatApptDate(dateStr) {
  const map = {
    '2026-04-09': '9 de abril de 2026 (hoje)',
    '2026-04-10': '10 de abril de 2026',
    '2026-04-11': '11 de abril de 2026',
    '2026-04-12': '12 de abril de 2026',
  };
  if (map[dateStr]) return map[dateStr];
  const [y, m, d] = dateStr.split('-');
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${parseInt(d)} de ${months[parseInt(m) - 1]}. de ${y}`;
}

// ─── Card de Agendamento (próximos) ──────────────────────────────────────────
function AgendamentoCard({ appt }) {
  const [prepExpanded, setPrepExpanded] = useState(false);
  const { t, isDark } = useTheme();
  const isExam  = appt.type === 'Exam';
  const hasPrep = isExam && appt.examType && examPrep[appt.examType];

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
      <div className="px-5 py-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: t.tint }}>
          {isExam
            ? <Microscope size={14} style={{ color: MG }} />
            : <Stethoscope size={14} style={{ color: MG }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm" style={{ fontWeight: 500, color: t.text }}>
              {tipoLabel[appt.type]}
              {isExam && appt.examType ? ` · ${appt.examType}` : ''}
              {!isExam && appt.doctor ? ` com ${appt.doctor}` : ''}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0"
                style={appt.status === 'confirmed'
                  ? { backgroundColor: t.tint, color: MG }
                  : isDark ? { backgroundColor: 'rgba(234,179,8,0.15)', color: '#FCD34D' } : { backgroundColor: '#FEF9C3', color: '#854D0E' }}>
                {statusLabel[appt.status]}
              </span>
              {hasPrep && (
                <button onClick={() => setPrepExpanded(!prepExpanded)}
                  className="p-1 rounded transition-colors"
                  style={{ color: t.textMuted }}>
                  {prepExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              )}
            </div>
          </div>
          <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
            {appt.time} · {formatApptDate(appt.date)}
          </p>
        </div>
      </div>
      {hasPrep && prepExpanded && (
        <div className="mx-5 mb-4 rounded-lg px-4 py-3 flex gap-2"
          style={{ backgroundColor: t.tint, borderLeft: `3px solid ${MG}` }}>
          <FileText size={12} style={{ color: MG, flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs leading-relaxed" style={{ color: t.textSub }}>
            <span style={{ color: MG, fontWeight: 500 }}>Preparo: </span>
            {examPrep[appt.examType]}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Item de Histórico ────────────────────────────────────────────────────────
function HistoricoItem({ appt }) {
  const { t, isDark } = useTheme();
  const isExam = appt.type === 'Exam';
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${t.border}` }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: t.bgSubtle }}>
        {isExam
          ? <Microscope size={13} style={{ color: t.textMuted }} />
          : <Stethoscope size={13} style={{ color: t.textMuted }} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm" style={{ fontWeight: 500, color: t.textSub }}>
          {tipoLabel[appt.type]}
          {isExam && appt.examType ? ` · ${appt.examType}` : ''}
          {!isExam && appt.doctor ? ` com ${appt.doctor}` : ''}
        </p>
        <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
          {appt.time} · {formatApptDate(appt.date)}
        </p>
      </div>
      <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0"
        style={{ backgroundColor: t.bgSubtle, color: t.textMuted }}>
        Realizado
      </span>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function PacientePortal() {
  const { user, logout }                    = useAuth();
  const { patients, appointments, resultados } = useData();
  const { t, isDark } = useTheme();
  const navigate                            = useNavigate();
  const [downloadedIds, setDownloadedIds]   = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    if (!user || user.type !== 'patient') navigate('/paciente');
  }, [user, navigate]);

  if (!user || user.type !== 'patient') return null;

  const patient = patients.find(p => p.id === user.patientId);
  if (!patient) return null;

  const allAppts = appointments
    .filter(a => a.patient === patient.name)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const upcoming = allAppts.filter(a => a.date >= TODAY);
  const past = allAppts
    .filter(a => a.date < TODAY)
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  const myResultados = resultados.filter(r => r.pacienteId === patient.id);
  const HISTORY_PREVIEW = 3;
  const historyToShow   = showAllHistory ? past : past.slice(0, HISTORY_PREVIEW);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleDownload = (resultado) => {
    const content = `NTClinical — Resultado de Exame\n\nPaciente: ${patient.name}\nCPF: ${patient.cpf}\nExame: ${resultado.tipo}\nData: ${resultado.data}\n\n${resultado.descricao}\n\nArquivo: ${resultado.arquivoNome}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url; a.download = resultado.arquivoNome; a.click();
    URL.revokeObjectURL(url);
    setDownloadedIds(prev => [...prev, resultado.id]);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: t.bgSubtle }}>
      {/* Top Bar */}
      <header className="sticky top-0 z-40" style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.border}` }}>
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between h-14">
          <LogoPlaceholder size="sm" />
          <div className="flex items-center gap-3">
            <DarkModeToggle variant="inline" />
            <div className="text-right hidden sm:block">
              <p className="text-sm truncate max-w-[180px]" style={{ fontWeight: 500, color: t.text }}>{patient.name}</p>
              <p className="text-xs" style={{ color: t.textMuted }}>Paciente</p>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs transition-colors px-3 py-1.5 rounded-lg"
              style={{ color: t.textMuted }}>
              <LogOut size={13} />Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-6">

        {/* Profile header */}
        <div className="rounded-2xl p-6 flex items-start gap-5" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0"
            style={{ backgroundColor: MG, fontWeight: 600 }}>
            {patient.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 style={{ fontWeight: 600, color: t.text }}>{patient.name}</h1>
            <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>CPF {patient.cpf} · Última consulta em {patient.lastVisit}</p>
          </div>
          {/* Resumo rápido */}
          <div className="hidden sm:flex gap-4 text-center flex-shrink-0">
            <div>
              <p className="text-xs" style={{ color: t.textMuted }}>Próximos</p>
              <p className="text-lg" style={{ color: MG, fontWeight: 600 }}>{upcoming.length}</p>
            </div>
            <div className="w-px" style={{ backgroundColor: t.border }} />
            <div>
              <p className="text-xs" style={{ color: t.textMuted }}>Realizados</p>
              <p className="text-lg" style={{ color: t.textMuted, fontWeight: 600 }}>{past.length}</p>
            </div>
          </div>
        </div>

        {/* Dados Cadastrais */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${t.border}` }}>
            <User size={14} style={{ color: MG }} />
            <h2 className="text-sm" style={{ fontWeight: 600, color: t.textSub }}>Dados Cadastrais</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div>
              <p className="text-xs mb-1" style={{ color: t.textMuted }}>Data de Nascimento</p>
              <p className="text-sm" style={{ color: t.text }}>{patient.dob}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: t.textMuted }}>Telefone</p>
              <p className="text-sm" style={{ color: t.text }}>{patient.phone}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: t.textMuted }}>E-mail</p>
              <p className="text-sm" style={{ color: t.text }}>{patient.email}</p>
            </div>
          </div>
        </div>

        {/* Próximos Agendamentos */}
        {upcoming.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${t.border}` }}>
              <CalendarDays size={14} style={{ color: MG }} />
              <h2 className="text-sm" style={{ fontWeight: 600, color: t.textSub }}>Próximos Agendamentos</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              {upcoming.map(appt => <AgendamentoCard key={`${appt.date}-${appt.time}`} appt={appt} />)}
            </div>
          </div>
        )}

        {/* Histórico */}
        {past.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${t.border}` }}>
              <History size={14} style={{ color: MG }} />
              <h2 className="text-sm" style={{ fontWeight: 600, color: t.textSub }}>Histórico de Agendamentos</h2>
            </div>
            <div className="px-6 py-4 space-y-0">
              {historyToShow.map(appt => <HistoricoItem key={`${appt.date}-${appt.time}`} appt={appt} />)}
              {showAllHistory === false && past.length > HISTORY_PREVIEW && (
                <button onClick={() => setShowAllHistory(true)}
                  className="w-full py-2 text-xs text-center transition-colors"
                  style={{ color: MG }}>
                  Ver mais ({past.length - HISTORY_PREVIEW} ocultos)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Resultados de Exames */}
        {myResultados.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${t.border}` }}>
              <Microscope size={14} style={{ color: MG }} />
              <h2 className="text-sm" style={{ fontWeight: 600, color: t.textSub }}>Resultados de Exames</h2>
            </div>
            <div className="px-6 py-4 space-y-0">
              {myResultados.map(res => {
                const downloaded = downloadedIds.includes(res.id);
                return (
                  <div key={res.id}
                    className="px-6 py-4 flex items-start gap-4" style={{ borderBottom: `1px solid ${t.border}` }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: t.tint }}>
                      <FileText size={16} style={{ color: MG }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ fontWeight: 500, color: t.text }}>{res.tipo}</p>
                      <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>{res.data} · {res.descricao}</p>
                      <p className="text-xs mt-0.5" style={{ color: t.textFaint, fontFamily: 'monospace' }}>{res.arquivoNome}</p>
                    </div>
                    <button onClick={() => handleDownload(res)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-all"
                      style={downloaded
                        ? { backgroundColor: t.tint, color: MG, border: `1px solid ${MG}` }
                        : { backgroundColor: MG, color: 'white' }}>
                      <Download size={13} />
                      {downloaded ? 'Baixado' : 'Baixar PDF'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-xs text-center pb-4" style={{ color: t.textFaint }}>
          Portal do Paciente · Somente visualização — NTClinical 2026
        </p>
      </main>
    </div>
  );
}