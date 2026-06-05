// ─── Color Palette ─────────────────────────────────────────────────────────────
// ─── Paleta de Cores ─────────────────────────────────────────────────────────
export const MG = '#3C5A3E';       // Verde Militar Escuro
export const MG_LIGHT = '#4A6E4D';
export const MG_TINT = '#EFF5EF';

// ─── UI Translation Helpers ────────────────────────────────────────────────────

// ─── Labels de Tradução da UI ────────────────────────────────────────────────
// Mapas de string usados para exibição em português
export const tipoLabel = {
  Consultation: 'Consulta',
  Exam: 'Exame',
};

export const statusLabel = {
  confirmed: 'Confirmado',
  pending: 'Pendente',
};

// ─── Interfaces ────────────────────────────────────────────────────────────────

// ─── Patients ──────────────────────────────────────────────────────────────────

// ─── Dados: Pacientes ────────────────────────────────────────────────────────
// Lista fictícia com 8 pacientes, incluindo alertas médicos
export const patients = [
  { id: 1, name: 'Ana Luísa Ferreira',    cpf: '123.456.789-00', lastVisit: '28/03/2026', dob: '14/06/1985', phone: '(11) 98765-4321', email: 'ana.ferreira@email.com',  chaveAcesso: 'PAC-ANA-001', atencaoMedica: 'Alergia a Dipirona e Penicilina. Histórico de hipertensão arterial. Em uso de Losartana 50mg.' },
  { id: 2, name: 'Carlos Eduardo Matos',  cpf: '234.567.890-11', lastVisit: '01/04/2026', dob: '02/11/1978', phone: '(11) 97654-3210', email: 'carlos.matos@email.com',  chaveAcesso: 'PAC-CAR-002', atencaoMedica: 'Diabetes Tipo 2. Alergia a látex. Uso contínuo de Metformina 850mg.' },
  { id: 3, name: 'Daniela Souza Lima',    cpf: '345.678.901-22', lastVisit: '05/04/2026', dob: '22/03/1992', phone: '(21) 96543-2109', email: 'daniela.lima@email.com',  chaveAcesso: 'PAC-DAN-003' },
  { id: 4, name: 'Fernando Rocha Neto',   cpf: '456.789.012-33', lastVisit: '15/03/2026', dob: '30/08/1965', phone: '(21) 95432-1098', email: 'fernando.neto@email.com', chaveAcesso: 'PAC-FER-004', atencaoMedica: 'Marca-passo cardíaco implantado em 2021. Contraindicado exames com campo magnético (RM). Alergia a contraste iodado.' },
  { id: 5, name: 'Giovana Martins',       cpf: '567.890.123-44', lastVisit: '08/04/2026', dob: '18/01/1990', phone: '(31) 94321-0987', email: 'giovana.martins@email.com',chaveAcesso: 'PAC-GIO-005' },
  { id: 6, name: 'Hugo Tavares Silva',    cpf: '678.901.234-55', lastVisit: '20/02/2026', dob: '07/09/1983', phone: '(31) 93210-9876', email: 'hugo.silva@email.com',    chaveAcesso: 'PAC-HUG-006', atencaoMedica: 'Asma brônquica grave. Portador de EpiPen. Nunca administrar AINEs (risco de broncoespasmo).' },
  { id: 7, name: 'Isabela Costa Ramos',   cpf: '789.012.345-66', lastVisit: '10/03/2026', dob: '25/12/1997', phone: '(41) 92109-8765', email: 'isabela.ramos@email.com', chaveAcesso: 'PAC-ISA-007' },
  { id: 8, name: 'João Pedro Alves',      cpf: '890.123.456-77', lastVisit: '07/04/2026', dob: '11/04/1975', phone: '(41) 91098-7654', email: 'joao.alves@email.com',    chaveAcesso: 'PAC-JOA-008' },
];

// ─── Doctors ───────────────────────────────────────────────────────────────────

// ─── Dados: Médicos ──────────────────────────────────────────────────────────
export const doctors = [
  { id: 1, name: 'Dr. Oliveira', specialty: 'Cardiologia',       chaveAcesso: 'MED-OLV-001' },
  { id: 2, name: 'Dr. Mendes',   specialty: 'Clínica Geral',     chaveAcesso: 'MED-MND-002' },
  { id: 3, name: 'Dra. Santos',  specialty: 'Neurologia',        chaveAcesso: 'MED-SNT-003' },
  { id: 4, name: 'Dra. Pereira', specialty: 'Dermatologia',      chaveAcesso: 'MED-PER-004' },
];

// ─── Access Key Maps ───────────────────────────────────────────────────────────

// ─── Mapas de Chaves de Acesso ───────────────────────────────────────────────
// Vincula chave de acesso ao ID do médico/paciente
export const chavesAcessoMedico = {
  'MED-OLV-001': 1,
  'MED-MND-002': 2,
  'MED-SNT-003': 3,
  'MED-PER-004': 4,
};

export const chavesAcessoPaciente = {
  'PAC-ANA-001': 1,
  'PAC-CAR-002': 2,
  'PAC-DAN-003': 3,
  'PAC-FER-004': 4,
  'PAC-GIO-005': 5,
  'PAC-HUG-006': 6,
  'PAC-ISA-007': 7,
  'PAC-JOA-008': 8,
};

// ─── Exam Types (PT-BR) ───────────────────────────────────────────────────────

// ─── Tipos de Exame ──────────────────────────────────────────────────────────
export const examTypes = [
  'Hemograma',
  'Raio-X',
  'Ressonância Magnética',
  'Ultrassonografia',
  'Eletrocardiograma (ECG)',
  'Tomografia Computadorizada',
];


// ─── Instruções de Preparo por Exame ─────────────────────────────────────────
export const examPrep = {
  'Hemograma':                   'Jejum de 8h. Evitar atividade física intensa nas 24h anteriores.',
  'Raio-X':                      'Não requer jejum. Retirar todos os acessórios metálicos antes do exame.',
  'Ressonância Magnética':        'Jejum de 4h. Informar sobre implantes metálicos ou sensação de claustrofobia.',
  'Ultrassonografia':             'Jejum de 6h. Ingerir 1L de água 1h antes do exame, não urinar.',
  'Eletrocardiograma (ECG)':      'Evitar cafeína nas 24h anteriores. Usar roupas confortáveis e folgadas.',
  'Tomografia Computadorizada':   'Jejum de 4h. Informar sobre alergias a contrastes iodados.',
};

// ─── Appointments ──────────────────────────────────────────────────────────────

// ─── Agendamentos de Hoje ────────────────────────────────────────────────────
export const todayAppointments = [
  { id: 1, time: '08:00', patient: 'Ana Luísa Ferreira',   type: 'Consultation', doctor: 'Dr. Oliveira', status: 'confirmed', date: '2026-04-09' },
  { id: 2, time: '09:30', patient: 'Carlos Eduardo Matos', type: 'Exam', examType: 'Hemograma',                  doctor: 'Dr. Mendes',   status: 'confirmed', prepInstructions: 'Jejum de 8h. Evitar atividade física intensa nas 24h anteriores.', date: '2026-04-09' },
  { id: 3, time: '10:00', patient: 'Daniela Souza Lima',   type: 'Consultation', doctor: 'Dr. Mendes',   status: 'pending',   date: '2026-04-09' },
  { id: 4, time: '11:30', patient: 'Fernando Rocha Neto',  type: 'Exam', examType: 'Raio-X',                     doctor: 'Dr. Oliveira', status: 'confirmed', prepInstructions: 'Não requer jejum. Retirar todos os acessórios metálicos antes do exame.', date: '2026-04-09' },
  { id: 5, time: '14:00', patient: 'Giovana Martins',      type: 'Consultation', doctor: 'Dr. Oliveira', status: 'confirmed', date: '2026-04-09' },
];


// ─── Todos os Agendamentos (próximos + histórico) ────────────────────────────
export const upcomingAppointments = [
  ...todayAppointments,
  { id: 6,  time: '09:00', patient: 'Hugo Tavares Silva',    type: 'Exam',         examType: 'Ressonância Magnética',    doctor: 'Dra. Santos',  status: 'confirmed', prepInstructions: 'Jejum de 4h. Informar sobre implantes metálicos ou sensação de claustrofobia.', date: '2026-04-10' },
  { id: 7,  time: '10:30', patient: 'Isabela Costa Ramos',   type: 'Consultation', doctor: 'Dra. Santos',  status: 'confirmed', date: '2026-04-10' },
  { id: 8,  time: '14:30', patient: 'João Pedro Alves',      type: 'Consultation', doctor: 'Dra. Pereira', status: 'pending',   date: '2026-04-11' },
  { id: 9,  time: '09:00', patient: 'Ana Luísa Ferreira',    type: 'Exam',         examType: 'Eletrocardiograma (ECG)',   doctor: 'Dr. Oliveira', status: 'confirmed', prepInstructions: 'Evitar cafeína nas 24h anteriores. Usar roupas confortáveis e folgadas.', date: '2026-04-12' },
  // ─── Histórico (passado) ───────────────────────────────────────────────────
  { id: 10, time: '08:00', patient: 'Ana Luísa Ferreira',    type: 'Exam',         examType: 'Hemograma',                doctor: 'Dr. Oliveira', status: 'confirmed', date: '2026-03-28' },
  { id: 11, time: '10:00', patient: 'Ana Luísa Ferreira',    type: 'Consultation', doctor: 'Dr. Oliveira', status: 'confirmed', date: '2026-02-15' },
  { id: 12, time: '09:30', patient: 'Carlos Eduardo Matos',  type: 'Consultation', doctor: 'Dr. Mendes',   status: 'confirmed', date: '2026-04-01' },
  { id: 13, time: '11:00', patient: 'Carlos Eduardo Matos',  type: 'Exam',         examType: 'Raio-X',                   doctor: 'Dr. Mendes',   status: 'confirmed', date: '2026-03-10' },
  { id: 14, time: '14:00', patient: 'Daniela Souza Lima',    type: 'Consultation', doctor: 'Dr. Mendes',   status: 'confirmed', date: '2026-04-05' },
  { id: 15, time: '09:00', patient: 'Daniela Souza Lima',    type: 'Exam',         examType: 'Ultrassonografia',         doctor: 'Dr. Mendes',   status: 'confirmed', date: '2026-03-20' },
  { id: 16, time: '08:30', patient: 'Fernando Rocha Neto',   type: 'Consultation', doctor: 'Dr. Oliveira', status: 'confirmed', date: '2026-03-15' },
  { id: 17, time: '15:00', patient: 'Giovana Martins',       type: 'Exam',         examType: 'Ressonância Magnética',    doctor: 'Dr. Oliveira', status: 'confirmed', date: '2026-03-20' },
  { id: 18, time: '10:00', patient: 'Giovana Martins',       type: 'Consultation', doctor: 'Dr. Oliveira', status: 'confirmed', date: '2026-02-10' },
  { id: 19, time: '09:00', patient: 'Hugo Tavares Silva',    type: 'Consultation', doctor: 'Dra. Santos',  status: 'confirmed', date: '2026-02-20' },
  { id: 20, time: '14:30', patient: 'Isabela Costa Ramos',   type: 'Exam',         examType: 'Tomografia Computadorizada', doctor: 'Dra. Santos', status: 'confirmed', date: '2026-03-10' },
  { id: 21, time: '11:30', patient: 'João Pedro Alves',      type: 'Consultation', doctor: 'Dra. Pereira', status: 'confirmed', date: '2026-04-07' },
  { id: 22, time: '08:00', patient: 'João Pedro Alves',      type: 'Exam',         examType: 'Eletrocardiograma (ECG)',   doctor: 'Dra. Pereira', status: 'confirmed', date: '2026-03-02' },
  { id: 23, time: '10:30', patient: 'Ana Luísa Ferreira',    type: 'Exam',         examType: 'Eletrocardiograma (ECG)',   doctor: 'Dr. Oliveira', status: 'confirmed', date: '2026-02-15' },
  { id: 24, time: '09:30', patient: 'Carlos Eduardo Matos',  type: 'Consultation', doctor: 'Dr. Mendes',   status: 'confirmed', date: '2026-01-20' },
];

// ─── Medical Results (Resultados) ─────────────────────────────────────────────

// ─── Resultados de Exames ────────────────────────────────────────────────────
export const resultados = [
  { id: 1, pacienteId: 1, tipo: 'Hemograma',                   data: '28/03/2026', descricao: 'Exame de sangue completo — resultados dentro da normalidade.',   arquivoNome: 'hemograma_28-03-2026.pdf' },
  { id: 2, pacienteId: 1, tipo: 'Eletrocardiograma (ECG)',      data: '15/02/2026', descricao: 'ECG de rotina — ritmo sinusal normal.',                          arquivoNome: 'ecg_15-02-2026.pdf' },
  { id: 3, pacienteId: 2, tipo: 'Raio-X',                      data: '01/04/2026', descricao: 'Raio-X de tórax — sem alterações significativas.',                arquivoNome: 'raio_x_01-04-2026.pdf' },
  { id: 4, pacienteId: 3, tipo: 'Ultrassonografia',             data: '05/04/2026', descricao: 'Ultrassonografia abdominal — órgãos sem alterações.',             arquivoNome: 'ultrassom_05-04-2026.pdf' },
  { id: 5, pacienteId: 5, tipo: 'Ressonância Magnética',        data: '20/03/2026', descricao: 'Ressonância de coluna lombar — sem compressão radicular.',        arquivoNome: 'rm_coluna_20-03-2026.pdf' },
  { id: 6, pacienteId: 4, tipo: 'Tomografia Computadorizada',   data: '14/03/2026', descricao: 'TC de abdome — sem lesões focais detectadas.',                   arquivoNome: 'tc_abdome_14-03-2026.pdf' },
  { id: 7, pacienteId: 6, tipo: 'Hemograma',                    data: '18/02/2026', descricao: 'Hemograma completo — dentro dos valores de referência.',         arquivoNome: 'hemograma_18-02-2026.pdf' },
];

// ─── Scheduling Data ───────────────────────────────────────────────────────────

// ─── Horários Disponíveis ────────────────────────────────────────────────────
export const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00',
];


// ─── Horários Já Ocupados (por data) ─────────────────────────────────────────
export const bookedSlots = {
  '2026-04-09': ['08:00', '09:30', '10:00', '11:30', '14:00'],
  '2026-04-10': ['09:00', '10:30'],
  '2026-04-11': ['14:30'],
  '2026-04-12': ['09:00'],
};

// Admin mock credentials

// ─── Credenciais de Demonstração ─────────────────────────────────────────────
export const ADMIN_EMAIL    = 'admin@ntclinical.com';
export const ADMIN_PASSWORD = 'admin123';