// ─── Importações ────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Outlet } from 'react-router';
import { AuthContext, AuthUser } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';
import { ThemeProvider } from '../context/ThemeContext';


// ─── Componente: RootLayout ──────────────────────────────────────────────────
// Raiz da aplicação: envolve tudo com ThemeProvider, AuthContext e DataProvider
export default function RootLayout() {
  const [user, setUser] = useState(null);

  const login  = (u: AuthUser) => setUser(u);
  const logout = () => setUser(null);

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ user, login, logout }}>
        <DataProvider>
          <Outlet />
        </DataProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}