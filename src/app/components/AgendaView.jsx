// ─── Importações ────────────────────────────────────────────────────────────
import { useState } from 'react';
import { format } from 'date-fns';
import {
  Stethoscope, Microscope, FileText,
  ChevronDown, ChevronUp, Pencil, Trash2, AlertTriangle,
  Check, X, Search, CalendarDays, History,
} from 'lucide-react';
import { MG, examPrep, examTypes, timeSlots, tipoLabel, statusLabel } from '../data/mockData';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

// ─── Constante: Data de Referência ───────────────────────────────────────────
const TODAY = '2026-04-09';

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Formata 'YYYY-MM-DD' para exibição em português
function fmtDate(dateStr) {
  const map = {
    '2026-04-09': 'Hoje — 09/04/2026',
    '2026-04-10': 'Amanhã — 10/04/2026',
    '2026-04-11': '11/04/2026',
    '2026-04-12': '12/04/2026',
  };
  if (map[dateStr]) return map[dateStr];
  try {
    const d = new Date(dateStr.replace(/-/g, '/'));
    return format(d, 'dd/MM/yyyy');
  } catch {
    return dateStr;
  }
}

// ─── Modal de Edição ──────────────────────────────────────────────────────────
function EditModal({ appt, onClose, onSave }) {
  const { patients, doctors } = useData();
  const { t } = useTheme();

  const [tipo,      setTipo]      = useState(appt.type);
  const [doctorId,  setDoctorId]  = useState(String(doctors.find(d => d.name === appt.doctor)?.id ?? ''));
  const [examType,  setExamType]  = useState(appt.examType ?? '');
  const [status,    setStatus]    = useState(appt.status);
  const [patId,     setPatId]     = useState(String(patients.find(p => p.name === appt.patient)?.id ?? ''));
  const [patSearch, setPatSearch] = useState(appt.patient);
  const [showList,  setShowList]  = useState(false);
  const [selTime,   setSelTime]   = useState(appt.time);

  const filteredPats = patients.filter(p => p.name.toLowerCase().includes(patSearch.toLowerCase()));
  const selPat = patients.find(p => p.id.toString() === patId);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      ...appt,
      patient:  selPat?.name ?? appt.patient,
      type:     tipo,
      doctor:   doctors.find(d => d.id.toString() === doctorId)?.name,
      examType: tipo === 'Exam' ? examType : undefined,
      status,
      time:     selTime,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: t.overlay }}>
      <div className="rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" style={{ backgroundColor: t.card }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div>
            <h2 className="text-sm" style={{ fontWeight: 600, color: t.text }}>Editar Agendamento</h2>
            <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
              {format(new Date(appt.date.replace(/-/g, '/')), 'dd/MM/yyyy')}
            </p>
          </div>
          <button onClick={onClose} className="transition-colors" style={{ color: t.textMuted }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSave}>
          <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
            {/* Horário */}
            <div>
              <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>Horário</label>
              <select value={selTime} onChange={e => setSelTime(e.target.value)}
                className="w-full py-2 text-sm border-0 border-b-2 bg-transparent outline-none appearance-none cursor-pointer"
                style={{ borderBottomColor: MG, color: t.inputText }}>
                {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {/* Paciente com busca */}
            <div className="relative">
              <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>Paciente</label>
              {selPat ? (
                <div className="flex items-center justify-between py-2 border-b-2 cursor-pointer"
                  style={{ borderBottomColor: MG }}
                  onClick={() => { setPatId(''); setPatSearch(''); }}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: MG }}>{selPat.name.charAt(0)}</div>
                    <span className="text-sm" style={{ color: t.inputText }}>{selPat.name}</span>
                  </div>
                  <X size={12} style={{ color: t.textMuted }} />
                </div>
              ) : (
                <div className="relative">
                  <input type="text" placeholder="Buscar paciente..." value={patSearch}
                    onChange={e => { setPatSearch(e.target.value); setShowList(true); }}
                    onFocus={() => setShowList(true)}
                    className="w-full py-2 text-sm border-0 border-b-2 bg-transparent outline-none"
                    style={{ borderBottomColor: MG, color: t.inputText }} />
                  {showList && filteredPats.length > 0 && (
                    <div className="absolute top-full left-0 right-0 rounded-lg shadow-lg mt-1 max-h-36 overflow-y-auto z-10"
                      style={{ backgroundColor: t.card, border: `1px solid ${t.borderMd}` }}>
                      {filteredPats.map(p => (
                        <button key={p.id} type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
                          style={{ color: t.text }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = t.cardHover}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          onClick={() => { setPatId(p.id.toString()); setPatSearch(p.name); setShowList(false); }}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0" style={{ backgroundColor: MG }}>{p.name.charAt(0)}</div>
                          {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Tipo */}
            <div>
              <label className="text-xs block mb-2.5" style={{ color: t.textMuted }}>Tipo</label>
              <div className="flex gap-6">
                {['Consultation', 'Exam'].map(tp => (
                  <label key={tp} className="flex items-center gap-2 cursor-pointer" onClick={() => setTipo(tp)}>
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                      style={{ borderColor: tipo === tp ? MG : t.borderMd, backgroundColor: tipo === tp ? MG : 'transparent' }}>
                      {tipo === tp && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm" style={{ color: tipo === tp ? MG : t.textMuted, fontWeight: tipo === tp ? 500 : 400 }}>{tipoLabel[tp]}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Médico ou Tipo de Exame */}
            {tipo === 'Consultation' ? (
              <div>
                <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>Médico</label>
                <select value={doctorId} onChange={e => setDoctorId(e.target.value)} required
                  className="w-full py-2 text-sm border-0 border-b-2 bg-transparent outline-none appearance-none"
                  style={{ borderBottomColor: MG, color: t.inputText }}>
                  <option value="">Selecione...</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>Tipo de Exame</label>
                <select value={examType} onChange={e => setExamType(e.target.value)} required
                  className="w-full py-2 text-sm border-0 border-b-2 bg-transparent outline-none appearance-none"
                  style={{ borderBottomColor: MG, color: t.inputText }}>
                  <option value="">Selecione...</option>
                  {examTypes.map(et => <option key={et} value={et}>{et}</option>)}
                </select>
              </div>
            )}
            {/* Status */}
            <div>
              <label className="text-xs block mb-2.5" style={{ color: t.textMuted }}>Status</label>
              <div className="flex gap-6">
                {['confirmed', 'pending'].map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer" onClick={() => setStatus(s)}>
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                      style={{ borderColor: status === s ? MG : t.borderMd, backgroundColor: status === s ? MG : 'transparent' }}>
                      {status === s && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm" style={{ color: status === s ? MG : t.textMuted, fontWeight: status === s ? 500 : 400 }}>{statusLabel[s]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 py-4" style={{ borderTop: `1px solid ${t.border}` }}>
            <button type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: MG, fontWeight: 500 }}>
              <Check size={16} />Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal de Exclusão ────────────────────────────────────────────────────────
function DeleteModal({ appt, onCancel, onConfirm }) {
  const { t, isDark } = useTheme();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: t.overlay }}>
      <div className="rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center" style={{ backgroundColor: t.card }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2' }}>
          <AlertTriangle size={22} className="text-red-400" />
        </div>
        <h2 className="mb-1" style={{ fontWeight: 600, color: t.text }}>Excluir agendamento?</h2>
        <p className="text-sm mb-1" style={{ color: t.textSub }}><strong>{appt.patient}</strong></p>
        <p className="text-xs mb-6" style={{ color: t.textMuted }}>
          {tipoLabel[appt.type]} · {appt.time} · {format(new Date(appt.date.replace(/-/g, '/')), 'dd/MM/yyyy')}
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border text-sm transition-colors"
            style={{ borderColor: t.borderMd, color: t.textMuted }}>
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm text-white bg-red-500 hover:bg-red-600 transition-colors">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card de Atendimento ──────────────────────────────────────────────────────
// Exibe um agendamento com ações de editar/excluir visíveis ao hover
function AppointmentCard({ appt, onEdit, onDelete, isPast }) {
  const [expanded, setExpanded] = useState(false);
  const { t, isDark } = useTheme();
  const hasPrep = appt.type === 'Exam' && appt.examType && examPrep[appt.examType];

  return (
    <div className="rounded-xl overflow-hidden group" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
      <div className="flex items-start gap-4 px-5 py-4">
        {/* Horário */}
        <div className="w-14 flex-shrink-0 pt-0.5">
          <span className="text-sm" style={{ color: isPast ? t.textFaint : MG, fontWeight: 600 }}>{appt.time}</span>
        </div>
        {/* Ícone do tipo */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: isPast ? t.bgSubtle : t.tint }}>
          {appt.type === 'Consultation'
            ? <Stethoscope size={15} style={{ color: isPast ? t.textMuted : MG }} />
            : <Microscope size={15} style={{ color: isPast ? t.textMuted : MG }} />}
        </div>
        {/* Informações e ações */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm truncate" style={{ fontWeight: 500, color: t.text }}>{appt.patient}</p>
              <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
                {appt.type === 'Consultation'
                  ? `Consulta · ${appt.doctor}`
                  : `Exame · ${appt.examType} · ${appt.doctor}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Badge de status */}
              <span className="text-xs px-2.5 py-1 rounded-full"
                style={isPast
                  ? { backgroundColor: t.bgSubtle, color: t.textMuted }
                  : appt.status === 'confirmed'
                    ? { backgroundColor: t.tint, color: MG }
                    : isDark ? { backgroundColor: 'rgba(234,179,8,0.15)', color: '#FCD34D' } : { backgroundColor: '#FEF9C3', color: '#854D0E' }}>
                {isPast ? 'Realizado' : statusLabel[appt.status]}
              </span>
              {/* Botões de ação visíveis ao hover */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {hasPrep && !isPast && (
                  <button onClick={() => setExpanded(!expanded)}
                    className="p-1.5 rounded-md transition-colors" title="Instruções de Preparo"
                    style={{ color: t.textMuted }}>
                    {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                )}
                <button onClick={onEdit} className="p-1.5 rounded-md transition-colors" title="Editar" style={{ color: t.textMuted }}>
                  <Pencil size={13} />
                </button>
                <button onClick={onDelete} className="p-1.5 rounded-md transition-colors text-red-400 hover:text-red-500" title="Excluir">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Instruções de preparo expandidas */}
      {hasPrep && expanded && !isPast && (
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

// ─── Grupo por Data ───────────────────────────────────────────────────────────
// Renderiza todos os atendimentos agrupados por uma mesma data
function DateGroup({ dateKey, appts, onEdit, onDelete }) {
  const { t } = useTheme();
  const isToday = dateKey === TODAY;
  const isPast  = dateKey < TODAY;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: isToday ? MG : isPast ? t.borderMd : t.textFaint }} />
        <span className="text-sm"
          style={{ color: isToday ? MG : isPast ? t.textFaint : t.textMuted, fontWeight: isToday ? 600 : 500 }}>
          {fmtDate(dateKey)}
        </span>
        <span className="text-xs" style={{ color: t.textFaint }}>{appts.length} atendimento{appts.length !== 1 ? 's' : ''}</span>
        <div className="flex-1 h-px" style={{ backgroundColor: t.border }} />
      </div>
      <div className="space-y-2 pl-5">
        {appts.slice().sort((a, b) => a.time.localeCompare(b.time)).map(appt => (
          <AppointmentCard key={appt.id} appt={appt}
            onEdit={() => onEdit(appt)} onDelete={() => onDelete(appt)}
            isPast={dateKey < TODAY} />
        ))}
      </div>
    </div>
  );
}

// ─── Componente Principal: AgendaView ────────────────────────────────────────
// Exibe todos os agendamentos com abas Próximos/Histórico, busca e filtros
export default function AgendaView() {
  const { appointments, updateAppointment, deleteAppointment } = useData();
  const { t } = useTheme();

  const [search,     setSearch]     = useState('');
  const [editAppt,   setEditAppt]   = useState(null);
  const [deleteAppt, setDeleteAppt] = useState(null);
  const [tab,        setTab]        = useState('upcoming');

  // Separa próximos agendamentos e histórico
  const upcoming = appointments.filter(a => a.date >= TODAY);
  const history  = appointments.filter(a => a.date < TODAY);
  const activeSet = tab === 'upcoming' ? upcoming : history;

  // Aplica filtro de busca por paciente ou médico
  const filtered = activeSet.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.patient.toLowerCase().includes(q) || (a.doctor ?? '').toLowerCase().includes(q);
  });

  // Agrupa agendamentos por data
  const grouped = {};
  filtered.forEach(a => {
    if (!grouped[a.date]) grouped[a.date] = [];
    grouped[a.date].push(a);
  });
  const sortedDates = Object.keys(grouped).sort(
    tab === 'history' ? (a, b) => b.localeCompare(a) : undefined
  );

  // Período exibido no subtítulo do cabeçalho
  const allDates = activeSet.map(a => a.date).sort();
  const minDate  = allDates[0];
  const maxDate  = allDates[allDates.length - 1];
  const periodStr = minDate && maxDate && minDate !== maxDate
    ? `Período: ${format(new Date(minDate.replace(/-/g, '/')), 'dd/MM/yyyy')} a ${format(new Date(maxDate.replace(/-/g, '/')), 'dd/MM/yyyy')}`
    : minDate
      ? format(new Date(minDate.replace(/-/g, '/')), 'dd/MM/yyyy')
      : '—';

  // Definição das abas de navegação
  const tabs = [
    { key: 'upcoming', label: 'Próximos Atendimentos', icon: CalendarDays, count: upcoming.length },
    { key: 'history',  label: 'Histórico',              icon: History,      count: history.length  },
  ];

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 style={{ fontWeight: 600, color: t.text }}>Agenda Geral</h1>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>
            {search ? `Busca: "${search}"` : periodStr}
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <Search size={15} className="flex-shrink-0" style={{ color: t.textMuted }} />
        <input type="text" placeholder="Buscar por paciente ou médico..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: t.text }}
        />
        {search && (
          <button onClick={() => setSearch('')} className="transition-colors" style={{ color: t.textFaint }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Cards de resumo numérico */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Exibindo',  value: filtered.length, color: t.textSub },
          { label: 'Consultas', value: filtered.filter(a => a.type === 'Consultation').length, color: MG },
          { label: 'Exames',    value: filtered.filter(a => a.type === 'Exam').length, color: '#6B7F6A' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl px-4 py-3 text-center" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <p className="text-xs" style={{ color: t.textMuted }}>{label}</p>
            <p className="text-xl mt-0.5" style={{ color, fontWeight: 600 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Abas de navegação: Próximos / Histórico */}
      <div className="flex gap-1 rounded-xl p-1 w-fit" style={{ backgroundColor: t.bgSubtle, border: `1px solid ${t.border}` }}>
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
            style={{
              backgroundColor: tab === key ? t.card   : 'transparent',
              color:           tab === key ? MG        : t.textMuted,
              fontWeight:      tab === key ? 600        : 400,
              boxShadow:       tab === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            <Icon size={14} />
            {label}
            <span className="text-xs px-1.5 py-0.5 rounded-full ml-0.5"
              style={{
                backgroundColor: tab === key ? t.tint : t.bgSubtle,
                color:           tab === key ? MG      : t.textMuted,
              }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Timeline de atendimentos agrupados por data */}
      <div className="space-y-8">
        {sortedDates.length === 0 ? (
          <div className="rounded-xl py-16 text-center" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <p className="text-sm" style={{ color: t.textMuted }}>
              {search ? 'Nenhum atendimento encontrado para essa busca.' : 'Nenhum atendimento neste período.'}
            </p>
          </div>
        ) : (
          sortedDates.map(date => (
            <DateGroup key={date} dateKey={date} appts={grouped[date]}
              onEdit={setEditAppt} onDelete={setDeleteAppt} />
          ))
        )}
      </div>

      {/* Legenda dos ícones */}
      <div className="flex items-center gap-5 py-3 px-4 rounded-xl flex-wrap" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <div className="flex items-center gap-2">
          <Stethoscope size={13} style={{ color: MG }} />
          <span className="text-xs" style={{ color: t.textMuted }}>Consulta</span>
        </div>
        <div className="flex items-center gap-2">
          <Microscope size={13} style={{ color: MG }} />
          <span className="text-xs" style={{ color: t.textMuted }}>Exame</span>
        </div>
        <div className="flex items-center gap-2">
          <Pencil size={12} style={{ color: t.textMuted }} />
          <span className="text-xs" style={{ color: t.textMuted }}>Passe o mouse no card para editar ou excluir</span>
        </div>
      </div>

      {/* Modais de edição e exclusão */}
      {editAppt && (
        <EditModal appt={editAppt} onClose={() => setEditAppt(null)}
          onSave={a => { updateAppointment(a); setEditAppt(null); }} />
      )}
      {deleteAppt && (
        <DeleteModal appt={deleteAppt} onCancel={() => setDeleteAppt(null)}
          onConfirm={() => { deleteAppointment(deleteAppt.id); setDeleteAppt(null); }} />
      )}
    </div>
  );
}
