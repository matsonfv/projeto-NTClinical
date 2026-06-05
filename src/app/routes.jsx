// ─── Importações ────────────────────────────────────────────────────────────
import { createBrowserRouter } from 'react-router';
import RootLayout      from './components/RootLayout';
import EntradaPage     from './components/EntradaPage';
import MedicoAcesso    from './components/MedicoAcesso';
import MedicoPortal    from './components/MedicoPortal';
import PacienteAcesso  from './components/PacienteAcesso';
import PacientePortal  from './components/PacientePortal';
import AdminLogin      from './components/AdminLogin';
import AdminLayout     from './components/Layout';
import Dashboard       from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import DoctorManagement  from './components/DoctorManagement';
import SchedulingHub   from './components/SchedulingHub';
import AgendaView      from './components/AgendaView';


// ─── Configuração de Rotas ───────────────────────────────────────────────────
// Define toda a estrutura de navegação da aplicação:
// / → EntradaPage
// /medico → MedicoAcesso → MedicoPortal
// /paciente → PacienteAcesso → PacientePortal
// /admin → AdminLayout com sub-rotas (painel, pacientes, médicos, agenda)
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: EntradaPage },
      { path: 'medico',          Component: MedicoAcesso   },
      { path: 'medico/portal',   Component: MedicoPortal   },
      { path: 'paciente',        Component: PacienteAcesso },
      { path: 'paciente/portal', Component: PacientePortal },
      { path: 'admin/login',     Component: AdminLogin     },
      {
        path: 'admin',
        Component: AdminLayout,
        children: [
          { index: true,              Component: Dashboard         },
          { path: 'pacientes',        Component: PatientManagement },
          { path: 'medicos',          Component: DoctorManagement  },
          { path: 'agenda',           Component: SchedulingHub     },
          { path: 'minha-agenda',     Component: AgendaView        },
        ],
      },
    ],
  },
]);