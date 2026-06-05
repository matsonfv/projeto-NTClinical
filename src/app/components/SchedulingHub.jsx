// ─── Importações ────────────────────────────────────────────────────────────
import { useState, useMemo } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isSameDay,
  addMonths, subMonths, isToday,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ChevronLeft, ChevronRight, X, Check, Clock,
  Pencil, Trash2, AlertTriangle, Search, Stethoscope,
} from 'lucide-react';
import { MG, examTypes, timeSlots, tipoLabel, statusLabel } from '../data/mockData';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

// ─── Mini Calendário ──────────────────────────────────────────────────────────
function MiniCalendar({ selected, onSelect }) {
  const [month, setMonth] = useState(new Date(2026, 3, 1));
  const { t, isDark } = useTheme();
  const days = useMemo(() =>
    eachDayOfInterval({
      start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
      end:   endOfWeek(endOfMonth(month),     { weekStartsOn: 0 }),
    }), [month]);
  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setMonth(subMonths(month, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-md transition-colors"
          style={{ color: t.textMuted }}>
          <ChevronLeft size={15} />
        </button>
        <span className="text-sm capitalize" style={{ fontWeight: 600, color: t.textSub }}>
          {format(month, 'MMMM yyyy', { locale: ptBR })}
        </span>
        <button onClick={() => setMonth(addMonths(month, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-md transition-colors"
          style={{ color: t.textMuted }}>
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {['Do','Se','Te','Qu','Qu','Se','Sá'].map((d, i) => (
          <div key={i} className="text-center text-xs pb-2" style={{ color: t.textFaint }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {days.map(day => {
          const isSel = isSameDay(day, selected);
          const isCur = isSameMonth(day, month);
          const isTod = isToday(day);
          return (
            <button key={day.toISOString()} onClick={() => onSelect(day)}
              className="w-full aspect-square flex items-center justify-center rounded-full text-xs transition-colors"
              style={{
                backgroundColor: isSel ? MG : isTod && !isSel ? t.tint : 'transparent',
                color: isSel ? 'white' : !isCur ? t.borderMd : isTod ? MG : t.textSub,
                fontWeight: isSel || isTod ? 600 : 400,
              }}>
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Modal de Agendamento / Edição ────────────────────────────────────────────
function ModalAgendamento({
  date, time, initial, onClose, onConfirm,
}) {
  const { patients, doctors } = useData();
  const { t, isDark } = useTheme();
  const isEdit = !!initial;

  const [patientSearch, setPatientSearch] = useState(initial?.patient ?? '');
  const [patientId,     setPatientId]     = useState(
    initial ? String(patients.find(p => p.name === initial.patient)?.id ?? '') : ''
  );
  const [showList,    setShowList]    = useState(false);
  const [tipo,        setTipo]        = useState(initial?.type ?? 'Consultation');
  const [doctorId,    setDoctorId]    = useState(
    initial ? String(doctors.find(d => d.name === initial.doctor)?.id ?? '') : ''
  );
  const [examType,    setExamType]    = useState(initial?.examType ?? '');
  const [status,      setStatus]      = useState(initial?.status ?? 'confirmed');
  const [selTime,     setSelTime]     = useState(initial?.time ?? time);
  const [observacoes, setObservacoes] = useState(initial?.observacoes ?? '');

  const filteredPats = patients.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );
  const selPatient = patients.find(p => p.id.toString() === patientId);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!patientId) return;
    if (tipo === 'Consultation' && !doctorId) return;
    if (tipo === 'Exam' && !examType) return;
    onConfirm({
      ...(initial ?? {}),
      patient:     selPatient?.name ?? '',
      type:        tipo,
      doctor:      doctors.find(d => d.id.toString() === doctorId)?.name,
      examType:    tipo === 'Exam' ? examType : undefined,
      time:        selTime,
      date:        format(date, 'yyyy-MM-dd'),
      status,
      observacoes: observacoes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: t.overlay }}>
      <div className="rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" style={{ backgroundColor: t.card }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div>
            <h2 className="text-sm" style={{ fontWeight: 600, color: t.text }}>
              {isEdit ? 'Editar Agendamento' : 'Agendar Atendimento'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>{format(date, 'dd/MM/yyyy')}</p>
          </div>
          <button onClick={onClose} className="transition-colors" style={{ color: t.textMuted }}><X size={18} /></button>
        </div>

        <form onSubmit={handleConfirm}>
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

            {/* Paciente */}
            <div className="relative">
              <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>Paciente</label>
              {selPatient ? (
                <div className="flex items-center justify-between py-2 border-b-2 cursor-pointer"
                  style={{ borderBottomColor: MG }}
                  onClick={() => { setPatientId(''); setPatientSearch(''); }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0" style={{ backgroundColor: MG }}>
                      {selPatient.name.charAt(0)}
                    </div>
                    <span className="text-sm" style={{ color: t.inputText }}>{selPatient.name}</span>
                  </div>
                  <X size={13} style={{ color: t.textMuted }} />
                </div>
              ) : (
                <div className="relative">
                  <input type="text" placeholder="Buscar paciente..."
                    value={patientSearch}
                    onChange={e => { setPatientSearch(e.target.value); setShowList(true); }}
                    onFocus={() => setShowList(true)}
                    className="w-full py-2 text-sm border-0 border-b-2 bg-transparent outline-none"
                    style={{ borderBottomColor: MG, color: t.inputText }}
                  />
                  {showList && filteredPats.length > 0 && (
                    <div className="absolute top-full left-0 right-0 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto z-10"
                      style={{ backgroundColor: t.card, border: `1px solid ${t.borderMd}` }}>
                      {filteredPats.map(p => (
                        <button key={p.id} type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
                          style={{ color: t.text }}
                          onMouseEnter={e => (e.currentTarget).style.backgroundColor = t.cardHover}
                          onMouseLeave={e => (e.currentTarget).style.backgroundColor = 'transparent'}
                          onClick={() => { setPatientId(p.id.toString()); setPatientSearch(p.name); setShowList(false); }}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0" style={{ backgroundColor: MG }}>
                            {p.name.charAt(0)}
                          </div>
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
              <label className="text-xs block mb-2.5" style={{ color: t.textMuted }}>Tipo de Atendimento</label>
              <div className="flex gap-6">
                {(['Consultation', 'Exam']).map(tp => (
                  <label key={tp} className="flex items-center gap-2 cursor-pointer" onClick={() => setTipo(tp)}>
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{ borderColor: tipo === tp ? MG : t.borderMd, backgroundColor: tipo === tp ? MG : 'transparent' }}>
                      {tipo === tp && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm" style={{ color: tipo === tp ? MG : t.textMuted, fontWeight: tipo === tp ? 500 : 400 }}>
                      {tipoLabel[tp]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Médico ou Exame */}
            {tipo === 'Consultation' ? (
              <div>
                <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>Médico</label>
                <select value={doctorId} onChange={e => setDoctorId(e.target.value)} required
                  className="w-full py-2 text-sm border-0 border-b-2 bg-transparent outline-none appearance-none cursor-pointer"
                  style={{ borderBottomColor: MG, color: t.inputText }}>
                  <option value="">Selecione o médico...</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>Tipo de Exame</label>
                <select value={examType} onChange={e => setExamType(e.target.value)} required
                  className="w-full py-2 text-sm border-0 border-b-2 bg-transparent outline-none appearance-none cursor-pointer"
                  style={{ borderBottomColor: MG, color: t.inputText }}>
                  <option value="">Selecione o exame...</option>
                  {examTypes.map(et => <option key={et} value={et}>{et}</option>)}
                </select>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="text-xs block mb-2.5" style={{ color: t.textMuted }}>Status</label>
              <div className="flex gap-6">
                {(['confirmed', 'pending']).map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer" onClick={() => setStatus(s)}>
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: status === s ? MG : t.borderMd, backgroundColor: status === s ? MG : 'transparent' }}>
                      {status === s && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm" style={{ color: status === s ? MG : t.textMuted, fontWeight: status === s ? 500 : 400 }}>
                      {statusLabel[s]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>Observações do Agendamento</label>
              <textarea
                placeholder="Alertas específicos, instruções especiais para este atendimento..."
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                rows={2}
                className="w-full py-2.5 px-3 text-sm rounded-lg resize-none outline-none transition-colors"
                style={{
                  backgroundColor: t.inputBg,
                  border: `1.5px solid ${t.inputBorder}`,
                  color: t.inputText,
                }}
              />
            </div>
          </div>

          <div className="px-6 py-4" style={{ borderTop: `1px solid ${t.border}` }}>
            <button type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: MG, fontWeight: 500 }}>
              <Check size={16} />
              {isEdit ? 'Salvar Alterações' : 'Confirmar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal de Exclusão ────────────────────────────────────────────────────────
function DeleteApptModal({ appt, onCancel, onConfirm }) {
  const { t, isDark } = useTheme();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: t.overlay }}>
      <div className="rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center" style={{ backgroundColor: t.card }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2' }}>
          <AlertTriangle size={22} className="text-red-400" />
        </div>
        <h2 className="mb-1" style={{ fontWeight: 600, color: t.text }}>Excluir agendamento?</h2>
        <p className="text-sm mb-1" style={{ color: t.textMuted }}><strong style={{ color: t.textSub }}>{appt.patient}</strong></p>
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

// ─── Linha de Agendamento ─────────────────────────────────────────────────────
function ApptRow({ appt, onEdit, onDelete }) {
  const { t, isDark } = useTheme();
  return (
    <div className="px-6 py-4 flex items-center gap-4 group" style={{ borderBottom: `1px solid ${t.border}` }}>
      <span className="text-sm w-14 flex-shrink-0" style={{ color: MG, fontWeight: 500 }}>{appt.time}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate" style={{ fontWeight: 500, color: t.text }}>{appt.patient}</p>
        <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
          {appt.type === 'Consultation' ? `Consulta · ${appt.doctor}` : `Exame · ${appt.examType}`}
        </p>
        {appt.observacoes && (
          <p className="text-xs mt-1 px-2 py-0.5 rounded inline-block" style={{ backgroundColor: t.tint, color: MG }}>
            Obs: {appt.observacoes}
          </p>
        )}
      </div>
      <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0"
        style={appt.status === 'confirmed'
          ? { backgroundColor: t.tint, color: MG }
          : isDark ? { backgroundColor: 'rgba(234,179,8,0.15)', color: '#FCD34D' } : { backgroundColor: '#FEF9C3', color: '#854D0E' }}>
        {statusLabel[appt.status]}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded-md transition-colors" title="Editar" style={{ color: t.textMuted }}>
          <Pencil size={13} />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-md transition-colors text-red-400 hover:text-red-500" title="Excluir">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function SchedulingHub() {
  const { appointments, doctors, addAppointment, updateAppointment, deleteAppointment } = useData();
  const { t, isDark } = useTheme();

  const [selectedDate,   setSelectedDate]  = useState(new Date(2026, 3, 9));
  const [bookingSlot,    setBookingSlot]   = useState(null);
  const [editAppt,       setEditAppt]      = useState(null);
  const [deleteAppt,     setDeleteAppt]    = useState(null);
  const [search,         setSearch]        = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const dateKey      = format(selectedDate, 'yyyy-MM-dd');
  const allDateAppts = appointments.filter(a => a.date === dateKey);

  const dateAppointments = allDateAppts
    .filter(a => !selectedDoctor || a.doctor === selectedDoctor)
    .filter(a => {
      if (!search) return true;
      const q = search.toLowerCase();
      return a.patient.toLowerCase().includes(q) || (a.doctor ?? '').toLowerCase().includes(q);
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const bookedTimes = allDateAppts
    .filter(a => !selectedDoctor || a.doctor === selectedDoctor)
    .map(a => a.time);

  const handleConfirm = (data) => {
    if (data.id) {
      updateAppointment(data);
      setEditAppt(null);
    } else {
      addAppointment({ ...data, id: undefined });
      setBookingSlot(null);
    }
  };

  const modalDate = editAppt ? new Date(editAppt.date.replace(/-/g, '/')) : selectedDate;

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontWeight: 600, color: t.text }}>Central de Agendamento</h1>
        <p className="text-sm mt-1" style={{ color: t.textMuted }}>Selecione uma data e horário para agendar ou editar um atendimento.</p>
      </div>

      {/* Barra de Busca + Filtro de Médico */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-3 flex-1 rounded-xl px-4 py-2.5" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <Search size={15} className="flex-shrink-0" style={{ color: t.textMuted }} />
          <input type="text" placeholder="Buscar por paciente ou médico..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm  outline-none bg-transparent"
            style={{ color: t.text }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="transition-colors" style={{ color: t.textFaint }}>
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 sm:w-72" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <Stethoscope size={15} className="flex-shrink-0" style={{ color: t.textMuted }} />
          <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent appearance-none cursor-pointer"
            style={{ color: t.text }}>
            <option value="">Todos os médicos</option>
            {doctors.map(d => <option key={d.id} value={d.name}>{d.name} — {d.specialty}</option>)}
          </select>
          {selectedDoctor && (
            <button onClick={() => setSelectedDoctor('')} className="transition-colors flex-shrink-0" style={{ color: t.textFaint }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Doctor badge */}
      {selectedDoctor && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: t.tint }}>
          <Stethoscope size={14} style={{ color: MG }} />
          <span className="text-sm" style={{ color: MG, fontWeight: 500 }}>Agenda de {selectedDoctor}</span>
          <span className="text-xs ml-1" style={{ color: t.textMuted }}>· {doctors.find(d => d.name === selectedDoctor)?.specialty}</span>
          <button onClick={() => setSelectedDoctor('')} className="ml-auto" style={{ color: t.textMuted }}><X size={13} /></button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Calendário */}
        <div className="rounded-xl p-6 lg:w-72 flex-shrink-0" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
          <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />
          <div className="mt-5 pt-5" style={{ borderTop: `1px solid ${t.border}` }}>
            <p className="text-xs mb-1" style={{ color: t.textMuted }}>Data selecionada</p>
            <p className="text-sm" style={{ fontWeight: 600, color: t.text }}>{format(selectedDate, 'dd/MM/yyyy')}</p>
            <p className="text-xs mt-1" style={{ color: t.textMuted }}>
              {dateAppointments.length} atendimento{dateAppointments.length !== 1 ? 's' : ''}
              {selectedDoctor ? ` · ${selectedDoctor}` : ''}
            </p>
          </div>
        </div>

        {/* Horários + lista */}
        <div className="flex-1 space-y-5">
          {/* Grade de horários */}
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${t.border}` }}>
              <Clock size={15} style={{ color: MG }} />
              <h2 className="text-sm" style={{ fontWeight: 600, color: t.textSub }}>
                Horários Disponíveis
                {selectedDoctor && <span style={{ fontWeight: 400, color: t.textMuted }}> · {selectedDoctor}</span>}
              </h2>
              <span className="ml-auto text-xs" style={{ color: t.textMuted }}>
                {timeSlots.length - bookedTimes.length} disponíve{timeSlots.length - bookedTimes.length !== 1 ? 'is' : 'l'}
              </span>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {timeSlots.map(slot => {
                  const isBooked = bookedTimes.includes(slot);
                  return (
                    <button key={slot} disabled={isBooked}
                      onClick={() => !isBooked && setBookingSlot(slot)}
                      className="py-2 rounded-lg text-xs transition-all border"
                      style={{
                        backgroundColor: isBooked ? t.bgSubtle : t.card,
                        borderColor:     isBooked ? t.border : t.borderMd,
                        color:           isBooked ? t.textFaint : t.textSub,
                        fontWeight:      isBooked ? 400 : 500,
                        cursor:          isBooked ? 'default' : 'pointer',
                        textDecoration:  isBooked ? 'line-through' : 'none',
                      }}>
                      {slot}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: `1px solid ${t.border}` }}>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: t.textMuted }}>
                  <div className="w-3 h-3 rounded" style={{ border: `1px solid ${t.borderMd}`, backgroundColor: t.card }} />Disponível
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: t.textMuted }}>
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: t.bgSubtle }} />Ocupado
                </div>
              </div>
            </div>
          </div>

          {/* Lista de atendimentos */}
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${t.border}` }}>
              <h2 className="text-sm" style={{ fontWeight: 600, color: t.textSub }}>
                Atendimentos · {format(selectedDate, 'dd/MM/yyyy')}
              </h2>
              {(search || selectedDoctor) && (
                <span className="text-xs" style={{ color: t.textMuted }}>
                  {dateAppointments.length} resultado{dateAppointments.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {dateAppointments.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm" style={{ color: t.textMuted }}>
                {search || selectedDoctor ? 'Nenhum atendimento encontrado com esse filtro.' : 'Nenhum atendimento para esta data.'}
              </div>
            ) : (
              <div>
                {dateAppointments.map(appt => (
                  <ApptRow key={appt.id} appt={appt}
                    onEdit={() => setEditAppt(appt)} onDelete={() => setDeleteAppt(appt)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {bookingSlot && (
        <ModalAgendamento date={selectedDate} time={bookingSlot}
          onClose={() => setBookingSlot(null)} onConfirm={handleConfirm} />
      )}
      {editAppt && (
        <ModalAgendamento date={modalDate} time={editAppt.time} initial={editAppt}
          onClose={() => setEditAppt(null)} onConfirm={handleConfirm} />
      )}
      {deleteAppt && (
        <DeleteApptModal appt={deleteAppt}
          onCancel={() => setDeleteAppt(null)}
          onConfirm={() => { deleteAppointment(deleteAppt.id); setDeleteAppt(null); }} />
      )}
    </div>
  );
}