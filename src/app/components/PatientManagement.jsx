// ─── Importações ────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Eye, Plus, Search, X, Pencil, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { MG } from '../data/mockData';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

// ─── Formulário de Paciente ───────────────────────────────────────────────────
function PacienteFormModal({
  initial, onClose, onSave,
}) {
  const isEdit = !!initial;
  const { t, isDark } = useTheme();
  const [form, setForm] = useState({
    name:         initial?.name          ?? '',
    cpf:          initial?.cpf           ?? '',
    dob:          initial?.dob           ?? '',
    phone:        initial?.phone         ?? '',
    email:        initial?.email         ?? '',
    atencaoMedica: initial?.atencaoMedica ?? '',
  });

  const field = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const prefix = form.name.split(' ')[0].substring(0, 3).toUpperCase();
    const suffix  = String(Date.now()).slice(-3);
    onSave({
      ...(initial ?? {}),
      ...form,
      lastVisit:   initial?.lastVisit   ?? '—',
      chaveAcesso: initial?.chaveAcesso ?? `PAC-${prefix}-${suffix}`,
    });
  };

  const textFields = [
    { key: 'name', label: 'Nome Completo', type: 'text', placeholder: 'Ex: João da Silva' },
    { key: 'cpf', label: 'CPF', type: 'text', placeholder: 'Ex: 123.456.789-00' },
    { key: 'dob', label: 'Data de Nascimento', type: 'date', placeholder: '' },
    { key: 'phone', label: 'Telefone', type: 'tel', placeholder: 'Ex: (11) 98765-4321' },
    { key: 'email', label: 'E-mail', type: 'email', placeholder: 'Ex: joao@example.com' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: t.overlay }}>
      <div className="rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" style={{ backgroundColor: t.card }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div>
            <h2 className="text-sm" style={{ fontWeight: 600, color: t.text }}>
              {isEdit ? 'Editar Paciente' : 'Novo Paciente'}
            </h2>
            {isEdit && <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>{initial.name}</p>}
          </div>
          <button onClick={onClose} className="transition-colors" style={{ color: t.textMuted }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
            {textFields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={field(key)}
                  required
                  className="w-full py-2 text-sm border-0 border-b-2 bg-transparent outline-none transition-colors"
                  style={{ borderBottomColor: MG, color: t.inputText }}
                />
              </div>
            ))}

            {/* ─── Atenção Médica ─────────────────────────────────────────── */}
            <div>
              <label className="text-xs mb-1.5 flex items-center gap-1.5" style={{ color: isDark ? '#FCD34D' : '#B45309', fontWeight: 500 }}>
                <ShieldAlert size={13} />
                Atenção Médica (Alergias, Urgências, etc.)
              </label>
              <textarea
                placeholder="Registre alergias, restrições, medicamentos em uso, condições de urgência..."
                value={form.atencaoMedica}
                onChange={field('atencaoMedica')}
                rows={3}
                className="w-full py-2.5 px-3 text-sm outline-none rounded-lg resize-none transition-colors"
                style={{
                  backgroundColor: isDark ? '#1A1000' : '#FFFBEB',
                  border: `1.5px solid ${isDark ? '#7C4A00' : '#F59E0B'}`,
                  color: t.inputText,
                }}
              />
            </div>
          </div>
          <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: `1px solid ${t.border}` }}>
            <button type="button" onClick={onClose}
              className="text-sm px-4 py-2 rounded-lg border transition-colors"
              style={{ borderColor: t.borderMd, color: t.textMuted }}>
              Cancelar
            </button>
            <button type="submit"
              className="text-sm px-5 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: MG }}>
              {isEdit ? 'Salvar Alterações' : 'Cadastrar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal de Visualização ────────────────────────────────────────────────────
function ViewModal({ patient, onClose, onEdit }) {
  const { t, isDark } = useTheme();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: t.overlay }}>
      <div className="rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" style={{ backgroundColor: t.card }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${t.border}` }}>
          <h2 className="text-sm" style={{ fontWeight: 600, color: t.text }}>Ficha do Paciente</h2>
          <button onClick={onClose} className="transition-colors" style={{ color: t.textMuted }}><X size={18} /></button>
        </div>
        <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
              style={{ backgroundColor: MG, fontWeight: 500 }}>
              {patient.name.charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 600, color: t.text }}>{patient.name}</p>
              <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>Chave de Acesso: <span style={{ fontFamily: 'monospace' }}>{patient.chaveAcesso}</span></p>
            </div>
          </div>

          {/* Atenção Médica — destaque */}
          {patient.atencaoMedica && (
            <div className="rounded-xl p-4 flex gap-3" style={{ backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#FFFBEB', border: `1.5px solid ${isDark ? '#92400E' : '#F59E0B'}` }}>
              <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" style={{ color: isDark ? '#FCD34D' : '#B45309' }} />
              <div>
                <p className="text-xs mb-1" style={{ color: isDark ? '#FCD34D' : '#B45309', fontWeight: 600 }}>Atenção Médica</p>
                <p className="text-xs leading-relaxed" style={{ color: t.textSub }}>{patient.atencaoMedica}</p>
              </div>
            </div>
          )}

          <div className="space-y-0">
            {[
              ['CPF',                patient.cpf],
              ['Data de Nascimento', patient.dob],
              ['Telefone',           patient.phone],
              ['E-mail',             patient.email],
              ['Última Consulta',    patient.lastVisit],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5" style={{ borderBottom: `1px solid ${t.border}` }}>
                <span className="text-xs" style={{ color: t.textMuted }}>{label}</span>
                <span className="text-xs" style={{ fontWeight: 500, color: t.textSub }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 flex justify-between" style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.bgSubtle }}>
          <button onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg border transition-colors"
            style={{ borderColor: t.borderMd, color: t.textMuted }}>
            Fechar
          </button>
          <button onClick={onEdit}
            className="text-sm px-4 py-2 rounded-lg text-white flex items-center gap-1.5 transition-opacity hover:opacity-90"
            style={{ backgroundColor: MG }}>
            <Pencil size={13} />Editar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal de Exclusão ────────────────────────────────────────────────────────
function DeleteConfirmModal({ name, onCancel, onConfirm }) {
  const { t, isDark } = useTheme();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: t.overlay }}>
      <div className="rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center" style={{ backgroundColor: t.card }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2' }}>
          <AlertTriangle size={22} className="text-red-400" />
        </div>
        <h2 className="mb-1" style={{ fontWeight: 600, color: t.text }}>Excluir paciente?</h2>
        <p className="text-sm mb-6" style={{ color: t.textMuted }}>
          <strong style={{ color: t.textSub }}>{name}</strong> será removido permanentemente do sistema.
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

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function PatientManagement() {
  const { patients, addPatient, updatePatient, deletePatient } = useData();
  const { t, isDark } = useTheme();

  const [search,       setSearch]       = useState('');
  const [viewPatient,  setViewPatient]  = useState(null);
  const [editPatient,  setEditPatient]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showNew,      setShowNew]      = useState(false);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.cpf.includes(search)
  );

  const handleSave = (data) => {
    if (data.id) {
      updatePatient(data);
      setEditPatient(null);
    } else {
      addPatient(data);
      setShowNew(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontWeight: 600, color: t.text }}>Pacientes</h1>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>{patients.length} cadastrados</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: MG }}>
          <Plus size={15} />Novo Paciente
        </button>
      </div>

      {/* Tabela */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${t.border}` }}>
          <Search size={15} className="flex-shrink-0" style={{ color: t.textMuted }} />
          <input
            type="text" placeholder="Buscar por nome ou CPF..."
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                <th className="text-left px-6 py-3 text-xs font-medium w-12" style={{ color: t.textMuted }}></th>
                <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: t.textMuted }}>Nome</th>
                <th className="text-left px-6 py-3 text-xs font-medium hidden md:table-cell" style={{ color: t.textMuted }}>CPF</th>
                <th className="text-left px-6 py-3 text-xs font-medium hidden sm:table-cell" style={{ color: t.textMuted }}>Última Consulta</th>
                <th className="text-center px-4 py-3 text-xs font-medium hidden lg:table-cell" style={{ color: t.textMuted }}>Atenção</th>
                <th className="px-6 py-3 text-xs font-medium text-right" style={{ color: t.textMuted }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm" style={{ color: t.textMuted }}>Nenhum paciente encontrado.</td></tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="last:border-0 transition-colors" style={{ borderBottom: `1px solid ${t.border}` }}>
                    <td className="px-6 py-4">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white"
                        style={{ backgroundColor: MG, fontWeight: 500 }}>
                        {p.name.charAt(0)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ fontWeight: 500, color: t.text }}>{p.name}</p>
                      <p className="text-xs mt-0.5 md:hidden" style={{ color: t.textMuted }}>{p.cpf}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm" style={{ color: t.textMuted }}>{p.cpf}</span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm" style={{ color: t.textMuted }}>{p.lastVisit}</span>
                    </td>
                    <td className="px-4 py-4 text-center hidden lg:table-cell">
                      {p.atencaoMedica && (
                        <span title={p.atencaoMedica}>
                          <ShieldAlert size={15} style={{ color: '#F59E0B' }} className="mx-auto" />
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewPatient(p)}
                          className="p-1.5 rounded-md transition-colors" title="Visualizar"
                          style={{ color: t.textMuted }}>
                          <Eye size={15} />
                        </button>
                        <button onClick={() => setEditPatient(p)}
                          className="p-1.5 rounded-md transition-colors" title="Editar"
                          style={{ color: t.textMuted }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded-md transition-colors text-red-400 hover:text-red-500" title="Excluir">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3" style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.bgSubtle }}>
          <span className="text-xs" style={{ color: t.textMuted }}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Modais */}
      {viewPatient && (
        <ViewModal
          patient={viewPatient}
          onClose={() => setViewPatient(null)}
          onEdit={() => { setEditPatient(viewPatient); setViewPatient(null); }}
        />
      )}
      {(showNew || editPatient) && (
        <PacienteFormModal
          initial={editPatient ?? undefined}
          onClose={() => { setShowNew(false); setEditPatient(null); }}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => { deletePatient(deleteTarget.id); setDeleteTarget(null); }}
        />
      )}
    </div>
  );
}