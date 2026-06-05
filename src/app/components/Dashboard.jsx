// ─── Importações ────────────────────────────────────────────────────────────
import { Link } from 'react-router';
import { CalendarCheck, FlaskConical, UserRound, Clock, Stethoscope, Microscope } from 'lucide-react';
import { MG, statusLabel } from '../data/mockData';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';


// ─── Componente: StatCard ────────────────────────────────────────────────────
// Exibe um card de resumo (ícone, rótulo, valor e subtexto)
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}) {
  const { t, isDark } = useTheme();
  return (
    <div className="rounded-xl p-6 flex flex-col gap-3" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: t.textMuted }}>{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.tint }}>
          <Icon size={16} style={{ color: MG }} />
        </div>
      </div>
      <div>
        <span className="text-3xl" style={{ color: MG, fontWeight: 600 }}>{value}</span>
        {sub && <p className="text-xs mt-1" style={{ color: t.textMuted }}>{sub}</p>}
      </div>
    </div>
  );
}


// ─── Componente: AppointmentRow ──────────────────────────────────────────────
// Linha de agendamento na agenda rápida do dia
function AppointmentRow({ appt }) {
  const { t, isDark } = useTheme();
  return (
    <div className="flex items-center gap-4 py-3.5" style={{ borderBottom: `1px solid ${t.divider}` }}>
      <div className="w-14 flex-shrink-0">
        <span className="text-sm" style={{ color: MG, fontWeight: 500 }}>{appt.time}</span>
      </div>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: t.tint }}
      >
        {appt.type === 'Consultation'
          ? <Stethoscope size={14} style={{ color: MG }} />
          : <Microscope size={14} style={{ color: MG }} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate" style={{ fontWeight: 500, color: t.text }}>{appt.patient}</p>
        <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
          {appt.type === 'Consultation' ? appt.doctor : appt.examType}
        </p>
      </div>
      <div className="flex-shrink-0">
        <span
          className="text-xs px-2.5 py-1 rounded-full"
          style={
            appt.status === 'confirmed'
              ? { backgroundColor: t.tint, color: MG }
              : isDark ? { backgroundColor: 'rgba(234,179,8,0.15)', color: '#FCD34D' } : { backgroundColor: '#FEF9C3', color: '#854D0E' }
          }
        >
          {statusLabel[appt.status]}
        </span>
      </div>
    </div>
  );
}


// ─── Componente Principal: Dashboard ─────────────────────────────────────────
// Exibe painel com cards de resumo, agenda do dia, pacientes recentes e
// breakdown de atendimentos
export default function Dashboard() {
  const { patients, appointments } = useData();
  const { t, isDark } = useTheme();
      // Filtra agendamentos do dia atual
    const todayAppointments = appointments.filter(a => a.date === '2026-04-09');
  const consultasHoje = todayAppointments.filter((a) => a.type === 'Consultation').length;
  const examesPendentes = todayAppointments.filter((a) => a.type === 'Exam' && a.status === 'pending').length + 2;
  const totalPacientes = patients.length;

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontWeight: 600, color: t.text }}>Painel</h1>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>Quinta-feira, 9 de abril de 2026</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: t.textMuted }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Sistema operacional
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={CalendarCheck} label="Consultas de Hoje" value={consultasHoje} sub="3 confirmadas · 1 pendente" />
        <StatCard icon={FlaskConical} label="Exames Pendentes" value={examesPendentes} sub="Aguardando resultado ou agendamento" />
        <StatCard icon={UserRound} label="Total de Pacientes" value={totalPacientes} sub="Cadastrados no sistema" />
      </div>

      {/* Agenda rápida do dia */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div className="flex items-center gap-2">
            <Clock size={15} style={{ color: MG }} />
            <h2 className="text-sm" style={{ fontWeight: 600, color: t.textSub }}>Agenda de Hoje</h2>
          </div>
          <span className="text-xs" style={{ color: t.textMuted }}>9 de abril de 2026</span>
        </div>
        <div className="px-6">
          {todayAppointments.length === 0 ? (
            <div className="py-12 text-center text-sm" style={{ color: t.textMuted }}>Nenhum atendimento agendado para hoje.</div>
          ) : (
            todayAppointments.map((appt) => (
              <AppointmentRow key={appt.id} appt={appt} />
            ))
          )}
        </div>
        <div className="px-6 py-3" style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.bgSubtle }}>
          <Link to="/admin/agenda" className="text-xs transition-colors" style={{ color: MG }}>
            Ver agendamento completo →
          </Link>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pacientes Recentes */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${t.border}` }}>
            <UserRound size={15} style={{ color: MG }} />
            <h2 className="text-sm" style={{ fontWeight: 600, color: t.textSub }}>Pacientes Recentes</h2>
          </div>
          <div>
            {patients.slice(0, 4).map((p) => (
              <div key={p.id} className="px-6 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${t.divider}` }}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white"
                  style={{ backgroundColor: MG, fontWeight: 500 }}
                >
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ fontWeight: 500, color: t.text }}>{p.name}</p>
                  <p className="text-xs" style={{ color: t.textMuted }}>{p.cpf}</p>
                </div>
                <span className="text-xs" style={{ color: t.textMuted }}>{p.lastVisit}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-3" style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.bgSubtle }}>
            <Link to="/admin/pacientes" className="text-xs" style={{ color: MG }}>Ver todos os pacientes →</Link>
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <div className="px-6 py-4" style={{ borderBottom: `1px solid ${t.border}` }}>
            <h2 className="text-sm" style={{ fontWeight: 600, color: t.textSub }}>Resumo de Atendimentos</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            {[
              { label: 'Consultas',   value: consultasHoje, color: MG },
              { label: 'Exames',      value: todayAppointments.filter((a) => a.type === 'Exam').length, color: '#6B7F6A' },
              { label: 'Confirmados', value: todayAppointments.filter((a) => a.status === 'confirmed').length, color: '#4ade80' },
              { label: 'Pendentes',   value: todayAppointments.filter((a) => a.status === 'pending').length, color: '#EAB308' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5" style={{ color: t.textMuted }}>
                  <span>{label}</span>
                  <span style={{ color, fontWeight: 500 }}>{value}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: t.border }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${todayAppointments.length ? (value / todayAppointments.length) * 100 : 0}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}