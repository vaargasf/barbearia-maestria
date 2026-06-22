# Barbearia Maestria

Plataforma de agendamento online para barbearias. Clientes reservam horários sem cadastro; barbeiros gerenciam agenda, serviços e disponibilidade em um painel dedicado.

---

## Visão geral

| Público   | Acesso        | Descrição                                      |
|-----------|---------------|------------------------------------------------|
| Cliente   | Site público  | Escolha de barbeiro, serviço, data e horário |
| Barbeiro  | Área restrita | Dashboard, agenda, clientes e configurações    |

**Principais recursos**

- Agendamento público com confirmação por nome, telefone e e-mail
- Exportação para Google Calendar e Apple Calendar (`.ics`)
- Painel do barbeiro com métricas, histórico e gestão de serviços
- Controle de disponibilidade, folgas e perfil profissional
- API REST com autenticação JWT e validação de entrada

---

## Arquitetura

Monorepo com separação clara entre frontend e backend.

```
barbearia-maestria/
├── client/          # Interface React (Vite + Tailwind)
└── server/          # API Express (Controller → Service → Prisma)
```

**Stack**

| Camada    | Tecnologias                                      |
|-----------|--------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Axios, Recharts    |
| Backend   | Node.js, Express, Prisma ORM                     |
| Banco     | MySQL 8                                          |
| Segurança | JWT, bcrypt, Helmet, CORS, rate limit, Zod       |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [Docker](https://www.docker.com/) (recomendado para o banco) **ou** MySQL 8 instalado localmente

---

## Configuração

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/vaargasf/barbearia-maestria.git
cd barbearia-maestria
npm run install:all
```

### 2. Banco de dados

Com Docker:

```bash
docker compose up -d
```

O serviço sobe MySQL na porta `3306` com o banco `barbearia_maestria`.

### 3. Variáveis de ambiente

Crie o arquivo `server/.env` com as configurações do ambiente. Variáveis necessárias:

| Variável       | Descrição                              |
|----------------|----------------------------------------|
| `PORT`         | Porta da API                           |
| `JWT_SECRET`   | Chave secreta para assinatura dos tokens |
| `FRONTEND_URL` | URL do frontend (CORS)                 |
| `DATABASE_URL` | String de conexão com o MySQL          |

> Mantenha credenciais e segredos fora do controle de versão. O arquivo `.env` não deve ser commitado.

### 4. Migrar e popular o banco

```bash
npm run db:setup
```

---

## Desenvolvimento

Inicie a API e o frontend em terminais separados:

```bash
npm run dev:server   # API — http://localhost:6060
npm run dev:client   # App — http://localhost:5173
```

Health check da API: `GET /health`

---

## Scripts disponíveis

| Comando              | Descrição                              |
|----------------------|----------------------------------------|
| `npm run install:all`| Instala dependências de client e server |
| `npm run db:setup`   | Sincroniza schema e executa seed       |
| `npm run dev:server` | API com hot reload                     |
| `npm run dev:client` | Frontend com Vite                      |
| `npm run build`      | Build de produção do frontend          |

---

## API

Base URL: `/api`

| Grupo    | Endpoints principais                                              |
|----------|-------------------------------------------------------------------|
| Público  | Barbeiros, serviços, horários disponíveis, criação de agendamento |
| Auth     | Login de barbeiro                                                 |
| Barbeiro | Perfil, agendamentos, serviços, estatísticas, disponibilidade     |

Rotas protegidas exigem o header `Authorization: Bearer <token>`.

---

## Licença

Projeto privado — Barbearia Maestria. Todos os direitos reservados.
