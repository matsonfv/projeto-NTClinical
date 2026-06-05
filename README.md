<div align="center">

# 🏥 NTClinical

**Sistema de gestão clínica com três portais de acesso, agendamento, dark mode e dados de demonstração**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7.13-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-components-000000?style=for-the-badge)](https://ui.shadcn.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Portais e Funcionalidades](#-portais-e-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Como Executar](#-como-executar)
- [Credenciais de Demonstração](#-credenciais-de-demonstração)
- [Melhorias Futuras](#-melhorias-futuras)

---

## 💡 Sobre o Projeto

**NTClinical** é uma aplicação web de gestão clínica construída com React, que simula um sistema real de três portais independentes: **Administrativo**, **Médico** e **Paciente**. Cada portal tem seu próprio fluxo de autenticação, visão de dados e conjunto de funcionalidades, todos compartilhando um estado global gerenciado via Context API.

O projeto explora padrões modernos de frontend como roteamento aninhado, múltiplos contextos, dark mode com paleta de tokens e uma biblioteca de componentes primitivos (Radix UI / shadcn).

> ⚠️ **Todos os dados exibidos são 100% fictícios**, gerados exclusivamente para fins de demonstração. Nenhuma informação real de pacientes ou profissionais de saúde é utilizada.

---

## ✅ Portais e Funcionalidades

### 🏠 Página de Entrada
- Seleção de portal via cards clicáveis (Médico / Paciente)
- Acesso discreto à Área Administrativa
- Toggle de dark/light mode flutuante

### 🛡️ Portal Administrativo
Acesso via login com usuário e senha fixos (ambiente de demo).

**Dashboard (`/admin`)**
- Cards de estatísticas: total de pacientes, consultas do dia, exames e agendamentos pendentes
- Agenda rápida do dia com horário, tipo (consulta/exame), paciente e status (Confirmado/Pendente)
- Lista de pacientes recentes com última visita
- Breakdown visual de atendimentos por tipo

**Gestão de Pacientes (`/admin/pacientes`)**
- Listagem com busca em tempo real por nome
- Visualização de ficha completa em modal (CPF, data de nascimento, telefone, e-mail, chave de acesso)
- Alerta médico destacado quando cadastrado (alergias, condições especiais, medicamentos contínuos)
- Cadastro de novo paciente com geração automática de chave de acesso (`PAC-XXX-000`)
- Edição e exclusão com modal de confirmação

**Gestão de Médicos (`/admin/medicos`)**
- Listagem com busca por nome e filtro por especialidade
- 16 especialidades disponíveis no formulário
- Cadastro com nome, CRM, telefone, e-mail e especialidade
- Geração automática de chave de acesso (`MED-XXX-000`)
- Edição e exclusão com confirmação

**Agendamento (`/admin/agenda`)**
- Calendário mensal interativo (date-fns + ptBR) para seleção de data
- Lista de agendamentos do dia selecionado com hora, paciente, médico/tipo de exame e status
- Criação de novo agendamento: tipo (Consulta / Exame), paciente com busca autocomplete, médico, tipo de exame, horário e status
- Edição completa e exclusão de agendamentos
- 6 tipos de exame disponíveis

**Agenda do Médico (`/admin/minha-agenda`)**
- Visão de agenda agrupada por data (Hoje / Amanhã / datas futuras)
- Expansão de instruções de preparo por exame
- Edição e exclusão de agendamentos individual

### 👨‍⚕️ Portal do Médico
Acesso via chave de acesso no formato `MED-XXX-000`.

- Visão personalizada com nome e especialidade do médico autenticado
- Agenda agrupada por data: próximas consultas e exames
- Ficha do paciente acessível direto da agenda (somente leitura)
- Alerta médico destacado na ficha quando cadastrado
- Instruções de preparo expansíveis para exames
- Histórico de atendimentos anteriores
- Logout com retorno à tela de entrada

### 🧑‍💼 Portal do Paciente
Acesso via chave de acesso no formato `PAC-XXX-000`.

- Visão personalizada com nome do paciente autenticado
- Próximos agendamentos com tipo, médico/exame, data, horário e status
- Instruções de preparo expansíveis para exames agendados
- Histórico de consultas e exames anteriores
- Dados cadastrais (CPF, data de nascimento, telefone, e-mail)
- Logout com retorno à tela de entrada

### 🌗 Dark Mode
- Toggle persistido via `localStorage`
- Paleta de tokens completa: dois objetos de tema (`light` / `dark`) com 18 variáveis de cor cada
- Todos os componentes consomem o tema via `useTheme()` — sem classes condicionais hardcoded

---

## 🛠 Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18.3.1 | Biblioteca de UI |
| React Router | ^7.13.0 | Roteamento client-side com rotas aninhadas |
| Vite | ^6.3.5 | Bundler e servidor de desenvolvimento |
| Tailwind CSS | ^4.1.12 | Utilitários de estilização |
| Radix UI | vários | Primitivos acessíveis (Dialog, Select, Tabs, etc.) |
| shadcn/ui | — | Componentes de UI sobre Radix UI |
| lucide-react | ^0.487.0 | Ícones SVG |
| date-fns | ^3.6.0 | Manipulação e formatação de datas (ptBR) |
| react-hook-form | ^7.55.0 | Gerenciamento de formulários |
| recharts | ^2.15.2 | Gráficos e visualizações de dados |
| motion | ^12.23.24 | Animações |
| sonner | ^2.0.3 | Toasts/notificações |
| canvas-confetti | ^1.9.4 | Efeito de confetes |

---

## 🏗 Arquitetura

A aplicação usa uma **SPA com rotas aninhadas** no React Router v7. Três contextos globais sustentam toda a lógica de estado:

```
main.jsx
  └── ThemeProvider          (dark/light mode + token de cores)
        └── AuthProvider     (usuário logado: admin | doctor | patient)
              └── DataProvider   (pacientes, médicos, agendamentos — CRUD em memória)
                    └── App.jsx → RouterProvider
                          └── RootLayout
                                ├── /                  EntradaPage
                                ├── /medico            MedicoAcesso
                                ├── /medico/portal     MedicoPortal
                                ├── /paciente          PacienteAcesso
                                ├── /paciente/portal   PacientePortal
                                ├── /admin/login       AdminLogin
                                └── /admin             AdminLayout (guard de auth)
                                      ├── index        Dashboard
                                      ├── pacientes    PatientManagement
                                      ├── medicos      DoctorManagement
                                      ├── agenda       SchedulingHub
                                      └── minha-agenda AgendaView
```

### Autenticação por tipo de usuário

O `AuthContext` armazena um objeto `user` com um campo `type` que determina o nível de acesso:

```js
// Admin
{ type: 'admin' }

// Médico (via chave MED-XXX-000)
{ type: 'doctor', doctorId, doctorName, specialty }

// Paciente (via chave PAC-XXX-000)
{ type: 'patient', patientId, patientName }
```

O `AdminLayout` aplica um guard via `useEffect`: se `user.type !== 'admin'`, redireciona para `/admin/login`.

---

## 🗺 Rotas da Aplicação

| Rota | Componente | Acesso |
|---|---|---|
| `/` | `EntradaPage` | Público |
| `/medico` | `MedicoAcesso` | Público |
| `/medico/portal` | `MedicoPortal` | Médico autenticado |
| `/paciente` | `PacienteAcesso` | Público |
| `/paciente/portal` | `PacientePortal` | Paciente autenticado |
| `/admin/login` | `AdminLogin` | Público |
| `/admin` | `Dashboard` | Admin autenticado |
| `/admin/pacientes` | `PatientManagement` | Admin autenticado |
| `/admin/medicos` | `DoctorManagement` | Admin autenticado |
| `/admin/agenda` | `SchedulingHub` | Admin autenticado |
| `/admin/minha-agenda` | `AgendaView` | Admin autenticado |

---

## 📁 Estrutura de Pastas

```
NTClinical/
│
├── index.html
├── vite.config.js
├── package.json
│
└── src/
    ├── main.jsx                        # Bootstrap: ThemeProvider + App
    │
    ├── styles/
    │   ├── index.css                   # Reset e base global
    │   ├── tailwind.css                # Entry point do Tailwind
    │   ├── theme.css                   # Variáveis CSS customizadas
    │   └── fonts.css                   # Import de fontes
    │
    └── app/
        ├── App.jsx                     # RouterProvider
        ├── routes.jsx                  # Definição de todas as rotas
        │
        ├── context/
        │   ├── AuthContext.jsx         # user, login(), logout(), useAuth()
        │   ├── DataContext.jsx         # CRUD: pacientes, médicos, agendamentos
        │   └── ThemeContext.jsx        # isDark, toggleTheme(), t (tokens), useTheme()
        │
        ├── data/
        │   └── mockData.js             # Dados fictícios de demonstração + helpers
        │
        └── components/
            ├── RootLayout.jsx          # Wrapper raiz das rotas
            ├── EntradaPage.jsx         # Tela inicial com seleção de portal
            ├── AdminLogin.jsx          # Login administrativo
            ├── Layout.jsx              # AdminLayout: header, nav, guard de auth
            ├── Dashboard.jsx           # Painel com estatísticas e agenda do dia
            ├── PatientManagement.jsx   # CRUD completo de pacientes
            ├── DoctorManagement.jsx    # CRUD completo de médicos
            ├── SchedulingHub.jsx       # Agendamento com calendário interativo
            ├── AgendaView.jsx          # Agenda agrupada por data
            ├── MedicoAcesso.jsx        # Login via chave de acesso (médico)
            ├── MedicoPortal.jsx        # Portal do médico autenticado
            ├── PacienteAcesso.jsx      # Login via chave de acesso (paciente)
            ├── PacientePortal.jsx      # Portal do paciente autenticado
            │
            ├── ui/                     # Componentes shadcn/ui (Radix UI)
            │   ├── DarkModeToggle.jsx  # Botão flutuante de tema
            │   ├── LogoPlaceholder.jsx # Logo da clínica
            │   └── [30+ primitivos]    # button, dialog, select, tabs, calendar...
            │
            └── figma/
                └── ImageWithFallback.jsx
```

---

## 🚀 Como Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18 ou superior
- [pnpm](https://pnpm.io/) (recomendado) ou npm

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/ntclinical.git
cd ntclinical

# 2. Instale as dependências
pnpm install
# ou
npm install

# 3. Inicie o servidor de desenvolvimento
pnpm dev
# ou
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**

### Scripts disponíveis

```bash
pnpm dev      # Servidor de desenvolvimento com Hot Reload
pnpm build    # Build de produção (gera /dist)
```

---

## 🔑 Credenciais de Demonstração

> Todos os dados são fictícios e existem apenas para demonstração do sistema.

### Área Administrativa
| Campo | Valor |
|---|---|
| Usuário | `admin` |
| Senha | `admin123` |

### Portal do Médico — chaves de acesso
| Médico | Especialidade | Chave |
|---|---|---|
| Dr. Oliveira | Cardiologia | `MED-OLV-001` |
| Dr. Mendes | Clínica Geral | `MED-MND-002` |
| Dra. Santos | Neurologia | `MED-SNT-003` |
| Dra. Pereira | Dermatologia | `MED-PER-004` |

### Portal do Paciente — chaves de acesso
| Paciente | Chave |
|---|---|
| Ana Luísa Ferreira | `PAC-ANA-001` |
| Carlos Eduardo Matos | `PAC-CAR-002` |
| Daniela Souza Lima | `PAC-DAN-003` |
| Fernando Rocha Neto | `PAC-FER-004` |
| Giovana Martins | `PAC-GIO-005` |
| Hugo Tavares Silva | `PAC-HUG-006` |
| Isabela Costa Ramos | `PAC-ISA-007` |
| João Pedro Alves | `PAC-JOA-008` |

---

## 🔮 Melhorias Futuras

- [ ] Backend real com autenticação JWT (Node.js / Express)
- [ ] Persistência de dados em banco de dados (PostgreSQL ou MongoDB)
- [ ] Geração e download de relatórios em PDF (prontuário do paciente)
- [ ] Sistema de notificações de agendamentos por e-mail ou WhatsApp
- [ ] Responsividade mobile completa para todos os portais
- [ ] Testes unitários e de integração (Vitest + Testing Library)
- [ ] Deploy em nuvem (Vercel ou Railway)

---

## 👨‍💻 Autor

Desenvolvido por **Matson** — estudante de Técnico em Informática para Internet no SENAC/RN e graduado em Ciências e Tecnologia pela UFRN.

[![GitHub](https://img.shields.io/badge/GitHub-matsonfv-181717?style=for-the-badge&logo=github)](https://github.com/matsonfv)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-matson--lima-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/matson-lima-078928187)

---

<div align="center">
  <sub>Feito com 🩺 React + Vite + Tailwind</sub>
</div>
