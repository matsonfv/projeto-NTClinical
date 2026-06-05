// ─── Importações ────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { LayoutDashboard, Users, CalendarDays, ClipboardList, LogOut, ShieldCheck, Stethoscope } from 'lucide-react';
import { MG } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogoPlaceholder } from './ui/LogoPlaceholder';
import { DarkModeToggle } from './ui/DarkModeToggle';


// ─── Rotas de Navegação ──────────────────────────────────────────────────────
// Define os links da barra de navegação do painel administrativo
const navLinks = [
  { to: '/admin',              label: 'Painel',       icon: LayoutDashboard, end: true  },
  { to: '/admin/pacientes',    label: 'Pacientes',    icon: Users,            end: false },
  { to: '/admin/medicos',      label: 'Médicos',      icon: Stethoscope,      end: false },
  { to: '/admin/agenda',       label: 'Agendamento',  icon: CalendarDays,     end: false },
  { to: '/admin/minha-agenda', label: 'Agenda',       icon: ClipboardList,    end: false },
];


// ─── Componente Principal: AdminLayout ───────────────────────────────────────
// Layout do painel admin: header com navegação, área de conteúdo e footer
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { t, isDark } = useTheme();
  const navigate = useNavigate();

      // Redireciona para login se não estiver autenticado como admin
    useEffect(() => {
    if (!user || user.type !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user || user.type !== 'admin') return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif", backgroundColor: t.bgSubtle }}
    >
      {/* Top Navigation */}
      <header
        className="sticky top-0 z-40"
        style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.border}` }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo + Nav */}
          <div className="flex items-center gap-10">
            <LogoPlaceholder size="sm" />

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
                      isActive ? 'text-white' : ''
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? { backgroundColor: MG, color: 'white' }
                      : { color: t.textMuted }
                  }
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right side: dark toggle + admin badge + logout */}
          <div className="flex items-center gap-3">
            <DarkModeToggle variant="inline" />

            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor: isDark ? 'rgba(60,90,62,0.25)' : '#EFF5EF', color: MG }}
            >
              <ShieldCheck size={12} />
              <span style={{ fontWeight: 500 }}>Administrador</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs transition-colors px-3 py-1.5 rounded-lg"
              style={{ color: t.textMuted }}
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div
        className="md:hidden"
        style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: t.headerBg }}
      >
        <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto">
          {navLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors"
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: MG, color: 'white' }
                  : { color: t.textMuted }
              }
            >
              <Icon size={13} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1" style={{ backgroundColor: t.bgSubtle }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.headerBg }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xs" style={{ color: t.textFaint }}>NTClinical © 2026</span>
          <span className="text-xs" style={{ color: t.textFaint }}>Sistema de Gestão Clínica</span>
        </div>
      </footer>
    </div>
  );
}