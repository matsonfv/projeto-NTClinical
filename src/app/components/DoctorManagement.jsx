// ─── Importações ────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Plus, Search, X, Pencil, Trash2, Eye, AlertTriangle, Stethoscope } from 'lucide-react';
import { MG, Doctor } from '../data/mockData';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

const especialidades = [
  'Cardiologia', 'Clínica Geral', 'Dermatologia', 'Endocrinologia',
  'Gastroenterologia', 'Ginecologia', 'Neurologia', 'Oftalmologia',
  'Oncologia', 'Ortopedia', 'Pediatria', 'Pneumologia',
  'Psiquiatria', 'Radiologia', 'Reumatologia', 'Urologia',
];

// ─── Formulário de Médico (Novo ou Edição) ────────────────────────────────────
function MedicoFormModal({
  initial, onClose, onSave,
}) {
  const isEdit = !!initial;
  const { t, isDark } = useTheme();
  const [form, setForm] = useState({
    name:      initial?.name      ?? '',
    specialty: initial?.specialty ?? '',
    crm:       (initial)?.crm ?? '',
    phone:     (initial)?.phone ?? '',
    email:     (initial)?.email ?? '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const prefix = form.name.split(' ').pop()?.substring(0, 3).toUpperCase() ?? 'MED';
    const suffix  = String(Date.now()).slice(-3);
    onSave({
      ...(initial ?? {}),
      name:       form.name,
      specialty:  form.specialty,
      chaveAcesso: initial?.chaveAcesso ?? `MED-${prefix}-${suffix}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: t.overlay }}>
      <div className="rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" style={{ backgroundColor: t.card }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${t.border}` }}>
          <h2 className="text-sm" style={{ fontWeight: 600, color: t.text }}>
            {isEdit ? 'Editar Médico' : 'Novo Médico'}
          </h2>
          <button onClick={onClose} className="transition-colors" style={{ color: t.textMuted }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
            {[
              { key: 'name',  label: 'Nome Completo', type: 'text',  placeholder: 'Dr. Nome Sobrenome' },
              { key: 'crm',   label: 'CRM',           type: 'text',  placeholder: 'CRM/UF 000000'      },
              { key: 'phone', label: 'Telefone',       type: 'tel',   placeholder: '(00) 00000-0000'    },
              { key: 'email', label: 'E-mail',         type: 'email', placeholder: 'medico@email.com'   },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>{label}</label>
                <input
                  type={type} placeholder={placeholder}
                  value={(form)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  required
                  className="w-full py-2 text-sm  border-0 border-b-2 bg-transparent outline-none"
                  style={{ borderBottomColor: MG, color: t.text }}
                />
              </div>
            ))}
            <div>
              <label className="text-xs block mb-1.5" style={{ color: t.textMuted }}>Especialidade</label>
              <select value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} required
                className="w-full py-2 text-sm border-0 border-b-2 bg-transparent outline-none appearance-none cursor-pointer"
                style={{ borderBottomColor: MG, color: t.text }}>
                <option value="">Selecione...</option>
                {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
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
              {isEdit ? 'Salvar Alterações' : 'Cadastrar Médico'}
            </button>
          </div>
        </form>
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
        <h2 className="mb-1" style={{ fontWeight: 600, color: t.text }}>Excluir médico?</h2>
        <p className="text-sm mb-6" style={{ color: t.textMuted }}>
          <strong style={{ color: t.textSub }}>{name}</strong> será removido permanentemente.
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

// ─── Modal de Visualização ────────────────────────────────────────────────────
function ViewModal({ doctor, onClose, onEdit }) {
  const { t, isDark } = useTheme();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: t.overlay }}>
      <div className="rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" style={{ backgroundColor: t.card }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${t.border}` }}>
          <h2 className="text-sm" style={{ fontWeight: 600, color: t.text }}>Ficha do Médico</h2>
          <button onClick={onClose} className="transition-colors" style={{ color: t.textMuted }}><X size={18} /></button>
        </div>
        <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
              style={{ backgroundColor: MG, fontWeight: 500 }}>
              {doctor.name.charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 600, color: t.text }}>{doctor.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Stethoscope size={11} style={{ color: MG }} />
                <p className="text-xs" style={{ color: t.textMuted }}>{doctor.specialty}</p>
              </div>
            </div>
          </div>
          <div className="space-y-0">
            {[
              ['Chave de Acesso', doctor.chaveAcesso],
              ['CRM',            (doctor).crm   ?? '—'],
              ['Telefone',       (doctor).phone ?? '—'],
              ['E-mail',         (doctor).email ?? '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5" style={{ borderBottom: `1px solid ${t.border}` }}>
                <span className="text-xs" style={{ color: t.textMuted }}>{label}</span>
                <span className="text-xs" style={{ fontWeight: 500, color: t.textSub, fontFamily: label === 'Chave de Acesso' || label === 'CRM' ? 'monospace' : undefined }}>{value}</span>
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

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function DoctorManagement() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useData();
  const { t, isDark } = useTheme();

  const [search,       setSearch]       = useState('');
  const [viewDoctor,   setViewDoctor]   = useState(null);
  const [editDoctor,   setEditDoctor]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showNew,      setShowNew]      = useState(false);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data) => {
    if (data.id) {
      updateDoctor(data);
      setEditDoctor(null);
    } else {
      addDoctor(data);
      setShowNew(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontWeight: 600, color: t.text }}>Médicos</h1>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>{doctors.length} cadastrados</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: MG }}>
          <Plus size={15} />Novo Médico
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.card, border: `1px solid ${t.border}` }}>
        <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${t.border}` }}>
          <Search size={15} className="flex-shrink-0" style={{ color: t.textMuted }} />
          <input type="text" placeholder="Buscar por nome ou especialidade..."
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
                <th className="text-left px-6 py-3 text-xs font-medium w-10" style={{ color: t.textMuted }}></th>
                <th className="text-left px-6 py-3 text-xs font-medium" style={{ color: t.textMuted }}>Nome</th>
                <th className="text-left px-6 py-3 text-xs font-medium hidden md:table-cell" style={{ color: t.textMuted }}>Especialidade</th>
                <th className="text-left px-6 py-3 text-xs font-medium hidden lg:table-cell" style={{ color: t.textMuted }}>CRM</th>
                <th className="text-left px-6 py-3 text-xs font-medium hidden lg:table-cell" style={{ color: t.textMuted }}>Chave de Acesso</th>
                <th className="px-6 py-3 text-xs font-medium text-right" style={{ color: t.textMuted }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm" style={{ color: t.textMuted }}>Nenhum médico encontrado.</td></tr>
              ) : (
                filtered.map(d => (
                  <tr key={d.id} className="last:border-0 transition-colors" style={{ borderBottom: `1px solid ${t.border}` }}>
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                        style={{ backgroundColor: MG, fontWeight: 500 }}>
                        {d.name.charAt(0)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ fontWeight: 500, color: t.text }}>{d.name}</p>
                      <p className="text-xs mt-0.5 md:hidden" style={{ color: t.textMuted }}>{d.specialty}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope size={12} style={{ color: MG }} />
                        <span className="text-sm" style={{ color: t.textMuted }}>{d.specialty}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm" style={{ color: t.textMuted, fontFamily: 'monospace' }}>{(d).crm ?? '—'}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: t.tint, color: MG, fontFamily: 'monospace' }}>
                        {d.chaveAcesso}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewDoctor(d)}
                          className="p-1.5 rounded-md transition-colors" title="Visualizar"
                          style={{ color: t.textMuted }}>
                          <Eye size={15} />
                        </button>
                        <button onClick={() => setEditDoctor(d)}
                          className="p-1.5 rounded-md transition-colors" title="Editar"
                          style={{ color: t.textMuted }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(d)}
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
        <div className="px-6 py-3" style={{ borderTop: `1px solid ${t.border}` }}>
          <span className="text-xs" style={{ color: t.textMuted }}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Modais */}
      {viewDoctor && (
        <ViewModal
          doctor={viewDoctor}
          onClose={() => setViewDoctor(null)}
          onEdit={() => { setEditDoctor(viewDoctor); setViewDoctor(null); }}
        />
      )}
      {(showNew || editDoctor) && (
        <MedicoFormModal
          initial={editDoctor ?? undefined}
          onClose={() => { setShowNew(false); setEditDoctor(null); }}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => { deleteDoctor(deleteTarget.id); setDeleteTarget(null); }}
        />
      )}
    </div>
  );
}