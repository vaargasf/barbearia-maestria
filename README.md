# Barbearia Maestria

Sistema de agendamento online para barbearia, com fluxo público para clientes e painel exclusivo para barbeiros.

Monorepo com frontend React e backend Node.js seguindo arquitetura **Controller → Service → Prisma**.

## Funcionalidades

### Cliente (sem login)
- Escolha do barbeiro, serviço, data e horário
- Confirmação com nome, telefone e e-mail
- Exportação do agendamento para Google Calendar ou Apple Calendar (.ics)

### Barbeiro (área restrita)
- Dashboard com gráficos de agendamentos e receita mensal
- Gestão de agendamentos, clientes e histórico
- Edição de serviços e preços
- Configuração de disponibilidade e folgas
- Perfil com upload de foto

## Stack

| Camada    | Tecnologias |
|-----------|-------------|
| Frontend  | React, Vite, Tailwind CSS, Axios, Recharts |
| Backend   | Node.js, Express, Prisma ORM |
| Banco     | MySQL 8 |
| Auth      | JWT (8h), bcrypt |
| Segurança | Helmet, CORS, rate limit, validação com Zod |

## Estrutura

```
barbearia-maestria/
├── client/                 # Frontend React
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── constants/
└── server/                 # Backend Express
    ├── prisma/
    └── src/
        ├── controllers/
        ├── routes/
        ├── services/
        ├── middlewares/
        └── utils/
```

## Pré-requisitos

- Node.js 18+
- MySQL 8

## Instalação

```bash
npm run install:all
```

Crie o arquivo `server/.env`:

```env
PORT=6060
JWT_SECRET=sua-chave-secreta-forte
FRONTEND_URL=http://localhost:5173
DATABASE_URL="mysql://usuario:senha@localhost:3306/barbearia_maestria"
```

Configure o banco e popule os dados iniciais:

```bash
npm run db:setup
```

## Desenvolvimento

```bash
# Terminal 1 — API
npm run dev:server

# Terminal 2 — Frontend
npm run dev:client
```

- Frontend: http://localhost:5173
- API: http://localhost:6060
- Health check: http://localhost:6060/health

## Acesso

| Perfil  | URL              | Credenciais demo        |
|---------|------------------|-------------------------|
| Cliente | `/`              | Agendamento sem login   |
| Barbeiro| `/login`         | `eric@maestria.com` / `123456` |

> O link de login do barbeiro não aparece no site público — acesso direto pela URL `/login`.

## API

Prefixo base: `/api`

| Grupo    | Rotas |
|----------|-------|
| Público  | `GET /public/barbers`, serviços, horários, `POST /public/appointments` |
| Auth     | `POST /auth/login` |
| Barbeiro | `GET/PUT /barbers/profile`, agendamentos, serviços, stats, disponibilidade |

Autenticação: `Authorization: Bearer <token>`

## Scripts

```bash
npm run install:all   # instala dependências do client e server
npm run db:setup      # cria tabelas + seed
npm run dev:server    # API com hot reload
npm run dev:client    # frontend Vite
npm run build         # build de produção do frontend
```

## Licença

Projeto privado — Barbearia Maestria.
