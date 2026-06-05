// ─── Importações ────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  LogOut, Stethoscope, Microscope, Paperclip, CheckCircle2,
  ChevronDown, ChevronUp, FileText, Users, CalendarDays, History,
  ClipboardList, X, ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { MG, examPrep, tipoLabel, statusLabel, Appointment, Patient } from '../data/mockData';
import { LogoPlaceholder } from './ui/LogoPlaceholder';
import { DarkModeToggle } from './ui/DarkModeToggle';


// ─── Constante: Data de Referência ──────────────────────────────────────────
const TODAY = '2026-04-09';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function groupByDate(appts) {
  return appts.reduce((acc, a) => {
    if (!acc[a.date]) acc[a.date] = [];
    acc[a.date].push(a);
    return acc;
  }, {});
}

function formatDate(dateStr) {
  const map = {
    '2026-04-09': 'Hoje, 09/04/2026',
    '2026-04-10': 'Amanhã, 10/04/2026',
    '2026-04-11': '11/04/2026',
    '2026-04-12': '12/04/2026',
  };
  if (map[dateStr]) return map[dateStr];
  try {
    const d = new Date(dateStr.replace(/-/g, '/'));
    const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    return `${d.getDate()} de ${months[d.getMonth()]}. de ${d.getFullYear()}`;
  } catch { return dateStr; }
}

// ─── Modal Ficha do Paciente (somente leitura) ────────────────────────────────
function FichaModal({ patient, onClose }) {
  const { t, isDark } = useTheme();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: t.overlay }}>
      <div className="rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" style={{ backgroundColor: t.card }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${t.border}` }}>
          <h2 className="text-sm" style={{ fontWeight: 600, color: t.text }}>Ficha do Paciente</h2>
          <button onClick={onClose} className="transition-colors" style={{ color: t.textMuted }}><X size={18} /></button>
        </div>
        <div className="px-6 py-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Avatar + nome */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
              style={{ backgroundColor: MG, fontWeight: 500 }}>
              {patient.name.charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 600, color: t.text }}>{patient.name}</p>
              <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>Última consulta: {patient.lastVisit}</p>
            </div>
          </div>

          {/* ── Atenção Médica — destaque ── */}
          {patient.atencaoMedica ? (
            <div className="rounded-xl p-4 flex gap-3" style={{ backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#FFFBEB', border: `2px solid ${isDark ? '#92400E' : '#F59E0B'}` }}>
              <ShieldAlert size={18} className="flex-shrink-0 mt-0.5" style={{ color: isDark ? '#FCD34D' : '#B45309' }} />
              <div>
                <p className="text-xs mb-1.5" style={{ color: isDark ? '#FCD34D' : '#B45309', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ⚠ Atenção Médica
                </p>
                <p className="text-sm leading-relaxed" style={{ color: t.textSub }}>{patient.atencaoMedica}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl px-4 py-3 flex items-center gap-2" style={{ backgroundColor: isDark ? 'rgba(22,163,74,0.1)' : '#F0FDF4' }}>
              <ShieldAlert size={14} style={{ color: '#16A34A' }} />
              <p className="text-xs" style={{ color: '#16A34A' }}>Sem alertas médicos registrados.</p>
            </div>
          )}

          {/* Dados */}
          <div className="space-y-0">
            {[
              ['CPF',                patient.cpf],
              ['Data de Nascimento', patient.dob],
              ['Telefone',           patient.phone],
              ['E-mail',             patient.email],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5" style={{ borderBottom: `1px solid ${t.border}` }}>
                <span className="text-xs" style={{ color: t.textMuted }}>{label}</span>
                <span className="text-xs" style={{ fontWeight: 500, color: t.textSub }}>{value}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-center pt-1" style={{ color: t.textFaint }}>Somente visualização · Portal do Médico</p>
        </div>
        <div className="px-6 py-4" style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.bgSubtle }}>
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm transition-colors"
            style={{ border: `1px solid ${t.borderMd}`, color: t.textSub, backgroundColor: 'transparent' }}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card de Agendamento ──────────────────────────────────────────────────────
function AppointmentCard({
  appt, onAnexar, anexo, onVerFicha,
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prepExpanded, setPrepExpanded] = useState(false);
  const { t, isDark } = useTheme();
  const isExam  = appt.type === 'Exam';
  const hasPrep = isExam && appt.examType && examPrep[appt.examType];
  const isPast  = appt.date < TODAY;

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
      <div className="flex items-start gap-4 px-5 py-4">
        <div className="w-14 pt-0.5 flex-shrink-0">
          <span className="text-sm" style={{ color: isPast ? t.textFaint : MG, fontWeight: 600 }}>{appt.time}</span>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: isPast ? t.bgSubtle : t.tint }}>
          {isExam
            ? <Microscope size={15} style={{ color: isPast ? t.textMuted : MG }} />
            : <Stethoscope size={15} style={{ color: isPast ? t.textMuted : MG }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm" style={{ fontWeight: 500, color: t.text }}>{appt.patient}</p>
              <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
                {tipoLabel[appt.type]}{isExam && appt.examType ? ` · ${appt.examType}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-full"
                style={isPast
                  ? { backgroundColor: t.bgSubtle, color: t.textMuted }
                  : appt.status === 'confirmed'
                    ? { backgroundColor: t.tint, color: MG }
                    : isDark ? { backgroundColor: 'rgba(234,179,8,0.15)', color: '#FCD34D' } : { backgroundColor: '#FEF9C3', color: '#854D0E' }}>
                {isPast ? 'Realizado' : statusLabel[appt.status]}
              </span>
              {/* Ver Ficha */}
              <button onClick={onVerFicha}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors"
                style={{ borderColor: t.borderMd, color: t.textMuted }}
                title="Ver Ficha do Paciente">
                <ClipboardList size={12} />
                <span className="hidden sm:inline">Ver Ficha</span>
              </button>
              {/* Prep toggle */}
              {hasPrep && !isPast && (
                <button onClick={() => setPrepExpanded(!prepExpanded)}
                  className="p-1 rounded transition-colors"
                  style={{ color: t.textMuted }}>
                  {prepExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}
            </div>
          </div>

          {/* Anexar resultado */}
          {isExam && !isPast && (
            <div className="mt-3">
              {anexo ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} style={{ color: MG }} />
                  <span className="text-xs" style={{ color: MG }}>Resultado anexado:&nbsp;</span>
                  <span className="text-xs truncate max-w-[180px]" style={{ color: t.textMuted }}>{anexo.nome}</span>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="text-xs ml-1 hover:underline" style={{ color: MG }}>
                    Substituir
                  </button>
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-colors"
                  style={{ borderColor: MG, color: MG }}>
                  <Paperclip size={13} />Anexar Resultado (PDF)
                </button>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) onAnexar(appt.id, f.name);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }} />
            </div>
          )}
        </div>
      </div>

      {/* Preparo */}
      {hasPrep && prepExpanded && !isPast && (
        <div className="mx-5 mb-4 rounded-lg px-4 py-3 flex gap-3"
          style={{ backgroundColor: t.tint, borderLeft: `3px solid ${MG}` }}>
          <FileText size={14} style={{ color: MG, flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-xs mb-1" style={{ color: MG, fontWeight: 500 }}>Instruções de Preparo</p>
            <p className="text-xs leading-relaxed" style={{ color: t.textSub }}>{examPrep[appt.examType]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Card de Histórico de Paciente ────────────────────────────────────────────
function PatientHistoryCard({
  patient, appts, onVerFicha,
}) {
  const [expanded, setExpanded] = useState(false);
  const { t, isDark } = useTheme();
  const name      = patient?.name ?? appts[0]?.patient ?? '—';
  const consultas = appts.filter(a => a.type === 'Consultation').length;
  const exames    = appts.filter(a => a.type === 'Exam').length;
  const lastAppt  = appts.slice().sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
      <div className="w-full flex items-center gap-4 px-5 py-4 text-left">
        <button className="flex items-center gap-4 flex-1 min-w-0" onClick={() => setExpanded(!expanded)}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0"
            style={{ backgroundColor: MG, fontWeight: 500 }}>
            {name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate" style={{ fontWeight: 500, color: t.text }}>{name}</p>
            <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
              {consultas} consulta{consultas !== 1 ? 's' : ''} · {exames} exame{exames !== 1 ? 's' : ''}
              {lastAppt && ` · Último: ${formatDate(lastAppt.date)}`}
            </p>
          </div>
          {expanded ? <ChevronUp size={15} className="flex-shrink-0" style={{ color: t.textMuted }} /> : <ChevronDown size={15} className="flex-shrink-0" style={{ color: t.textMuted }} />}
        </button>
        {/* Ver Ficha */}
        <button onClick={onVerFicha}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors flex-shrink-0"
          style={{ borderColor: t.borderMd, color: t.textMuted }}>
          <ClipboardList size={13} />
          <span className="hidden sm:inline">Ver Ficha</span>
        </button>
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid ${t.border}` }}>
          {patient && (
            <div className="px-5 py-3 space-y-1" style={{ backgroundColor: t.bgSubtle }}>
              {appts.map(appt => {
                const isPast = appt.date < TODAY;
                const isExam = appt.type === 'Exam';
                return (
                  <div key={`${appt.date}-${appt.time}`}
                    className="flex items-center gap-3 py-2.5" style={{ borderBottom: `1px solid ${t.border}` }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isPast ? t.bgSubtle : t.tint }}>
                      {isExam
                        ? <Microscope size={13} style={{ color: isPast ? t.textMuted : MG }} />
                        : <Stethoscope size={13} style={{ color: isPast ? t.textMuted : MG }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs" style={{ fontWeight: 500, color: t.textSub }}>
                        {tipoLabel[appt.type]}{isExam && appt.examType ? ` · ${appt.examType}` : ''}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>{formatDate(appt.date)} · {appt.time}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={isPast
                        ? { backgroundColor: t.bgSubtle, color: t.textMuted }
                        : appt.status === 'confirmed'
                          ? { backgroundColor: t.tint, color: MG }
                          : isDark ? { backgroundColor: 'rgba(234,179,8,0.15)', color: '#FCD34D' } : { backgroundColor: '#FEF9C3', color: '#854D0E' }}>
                      {isPast ? 'Realizado' : statusLabel[appt.status]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function MedicoPortal() {
  const { user, logout } = useAuth();
  const { appointments, patients } = useData();
  const { t, isDark } = useTheme();
  const navigate = useNavigate();

  const [anexados,       setAnexados]       = useState({});
  const [tab,            setTab]            = useState('agenda');
  const [fichaPatient,   setFichaPatient]   = useState(null);

  useEffect(() => {
    if (!user || user.type !== 'doctor') navigate('/medico');
  }, [user, navigate]);

  if (!user || user.type !== 'doctor') return null;

  const doctorName    = user.doctorName;
  const myAppointments = appointments.filter(a => a.doctor === doctorName);

  // Agenda: today and future
  const upcomingAppts = myAppointments
    .filter(a => a.date >= TODAY)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const grouped     = groupByDate(upcomingAppts);
  const sortedDates = Object.keys(grouped).sort();

  // Histórico: by patient
  const patientMap = {};
  myAppointments.forEach(a => {
    if (!patientMap[a.patient]) patientMap[a.patient] = [];
    patientMap[a.patient].push(a);
  });
  const uniquePatients = Object.entries(patientMap).sort((a, b) => {
    const lastA = a[1].slice().sort((x, y) => y.date.localeCompare(x.date))[0]?.date ?? '';
    const lastB = b[1].slice().sort((x, y) => y.date.localeCompare(x.date))[0]?.date ?? '';
    return lastB.localeCompare(lastA);
  });

  const handleAnexar = (apptId, fileName) =>
    setAnexados(prev => ({ ...prev, [apptId]: { nome: fileName, dataAnexo: '09/04/2026' } }));

  const handleLogout = () => { logout(); navigate('/'); };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const findPatient = (name) => patients.find(p => p.name === name) ?? null;

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: t.bgSubtle }}>
      {/* Top Bar */}
      <header className="sticky top-0 z-40" style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.border}` }}>
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-14">
          <LogoPlaceholder size="sm" />
          <div className="flex items-center gap-3">
            <DarkModeToggle variant="inline" />
            <div className="text-right hidden sm:block">
              <p className="text-sm" style={{ fontWeight: 500, color: t.text }}>{doctorName}</p>
              <p className="text-xs" style={{ color: t.textMuted }}>{user.specialty}</p>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs transition-colors px-3 py-1.5 rounded-lg"
              style={{ color: t.textMuted }}>
              <LogOut size={13} />Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 style={{ fontWeight: 600, color: t.text }}>
            {greeting()}, {doctorName}.
          </h1>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>{user.specialty} · Quinta-feira, 09/04/2026</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg px-4 py-3" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <p className="text-xs" style={{ color: t.textMuted }}>Próximas Consultas</p>
            <p className="text-2xl mt-1" style={{ fontWeight: 600, color: t.text }}>
              {upcomingAppts.filter(a => a.type === 'Consultation').length}
            </p>
          </div>
          <div className="rounded-lg px-4 py-3" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <p className="text-xs" style={{ color: t.textMuted }}>Próximos Exames</p>
            <p className="text-2xl mt-1" style={{ fontWeight: 600, color: t.text }}>
              {upcomingAppts.filter(a => a.type === 'Exam').length}
            </p>
          </div>
          <div className="rounded-lg px-4 py-3" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <p className="text-xs" style={{ color: t.textMuted }}>Pacientes Atendidos</p>
            <p className="text-2xl mt-1" style={{ fontWeight: 600, color: t.text }}>{uniquePatients.length}</p>
          </div>
          <div className="rounded-lg px-4 py-3" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <p className="text-xs" style={{ color: t.textMuted }}>Total de Agendamentos</p>
            <p className="text-2xl mt-1" style={{ fontWeight: 600, color: t.text }}>{myAppointments.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b" style={{ borderColor: t.border }}>
          <button onClick={() => setTab('agenda')}
            className="text-sm py-3 px-4 border-b-2 transition-colors"
            style={tab === 'agenda'
              ? { borderColor: MG, color: t.text, fontWeight: 600 }
              : { borderColor: 'transparent', color: t.textMuted }}>
            <CalendarDays size={14} className="inline mr-2" />
            Agenda
          </button>
          <button onClick={() => setTab('historico')}
            className="text-sm py-3 px-4 border-b-2 transition-colors"
            style={tab === 'historico'
              ? { borderColor: MG, color: t.text, fontWeight: 600 }
              : { borderColor: 'transparent', color: t.textMuted }}>
            <History size={14} className="inline mr-2" />
            Histórico de Pacientes
          </button>
        </div>

        {/* Content: Agenda */}
        {tab === 'agenda' && (
          <div className="space-y-6">
            {sortedDates.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: t.textMuted }}>Nenhum agendamento futuro.</p>
            ) : (
              sortedDates.map(date => (
                <div key={date}>
                  <h3 className="text-sm mb-3" style={{ fontWeight: 600, color: t.textMuted }}>
                    {formatDate(date)}
                  </h3>
                  <div className="space-y-3">
                    {grouped[date].map(appt => (
                      <AppointmentCard
                        key={`${appt.date}-${appt.time}`}
                        appt={appt}
                        anexo={anexados[appt.id]}
                        onAnexar={handleAnexar}
                        onVerFicha={() => setFichaPatient(findPatient(appt.patient))}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Content: Histórico */}
        {tab === 'historico' && (
          <div className="space-y-3">
            {uniquePatients.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: t.textMuted }}>Nenhum paciente.</p>
            ) : (
              uniquePatients.map(([patientName, appts]) => (
                <PatientHistoryCard
                  key={patientName}
                  patient={findPatient(patientName)}
                  appts={appts}
                  onVerFicha={() => setFichaPatient(findPatient(patientName))}
                />
              ))
            )}
          </div>
        )}

        <p className="text-xs text-center pb-4" style={{ color: t.textFaint }}>
          Portal do Médico · Somente visualização — NTClinical 2026
        </p>
      </main>

      {/* Modal Ficha do Paciente */}
      {fichaPatient && (
        <FichaModal patient={fichaPatient} onClose={() => setFichaPatient(null)} />
      )}
    </div>
  );
}