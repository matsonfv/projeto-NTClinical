// ─── Importações ────────────────────────────────────────────────────────────
import { createContext, useContext } from 'react';
  // ─── Contexto de Autenticação ────────────────────────────────────────────────
// Gerencia o usuário logado (admin, médico ou paciente)
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

// ─── Hook: useAuth ───────────────────────────────────────────────────────────
// Retorna { user, login, logout } para qualquer componente
export function useAuth() {
  return useContext(AuthContext);
}
