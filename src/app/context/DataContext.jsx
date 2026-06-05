// ─── Importações ────────────────────────────────────────────────────────────
import { createContext, useContext, useState } from 'react';
import {
  patients as initialPatients,
  doctors as initialDoctors,
  upcomingAppointments as initialAppointments,
  resultados as initialResultados,
} from '../data/mockData';


// ─── Criação do Contexto de Dados ────────────────────────────────────────────
// Gerencia estado global: pacientes, médicos, agendamentos e resultados
const DataContext = createContext({
  patients: [], doctors: [], appointments: [], resultados: [],
  addPatient: () => {}, updatePatient: () => {}, deletePatient: () => {},
  addDoctor: () => {},   updateDoctor: () => {},  deleteDoctor: () => {},
  addAppointment: () => {}, updateAppointment: () => {}, deleteAppointment: () => {},
});


// ─── Provider: DataProvider ──────────────────────────────────────────────────
// Inicializa os estados e expõe as funções CRUD para toda a aplicação
export function DataProvider({ children }) {
  const [patients, setPatients]         = useState(initialPatients);
  const [doctors, setDoctors]           = useState(initialDoctors);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [resultados]                    = useState(initialResultados);

  const addPatient = (p) =>
    setPatients(prev => [{ ...p, id: Date.now() }, ...prev]);

  const updatePatient = (p) =>
    setPatients(prev => prev.map(x => (x.id === p.id ? p : x)));

  const deletePatient = (id) =>
    setPatients(prev => prev.filter(x => x.id !== id));

  const addDoctor = (d) =>
    setDoctors(prev => [{ ...d, id: Date.now() }, ...prev]);

  const updateDoctor = (d) =>
    setDoctors(prev => prev.map(x => (x.id === d.id ? d : x)));

  const deleteDoctor = (id) =>
    setDoctors(prev => prev.filter(x => x.id !== id));

  const addAppointment = (a) =>
    setAppointments(prev => [...prev, { ...a, id: Date.now() }]);

  const updateAppointment = (a) =>
    setAppointments(prev => prev.map(x => (x.id === a.id ? a : x)));

  const deleteAppointment = (id) =>
    setAppointments(prev => prev.filter(x => x.id !== id));

  return (
    <DataContext.Provider
      value={{
        patients, doctors, appointments, resultados,
        addPatient, updatePatient, deletePatient,
        addDoctor,  updateDoctor,  deleteDoctor,
        addAppointment, updateAppointment, deleteAppointment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}


// ─── Hook: useData ───────────────────────────────────────────────────────────
// Acessa pacientes, médicos, agendamentos e todas as funções CRUD
export function useData() {
  return useContext(DataContext);
}
