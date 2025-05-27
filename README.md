# Projeto Integrador 1

Este é um projeto de API REST com autenticação de usuários e gerenciamento de dicas.

## Requisitos

- Node.js (versão 14 ou superior)
- MongoDB (versão 4 ou superior)
- NPM ou Yarn

## Configuração

1. Clone o repositório.
2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
PORT=3000
DATABASE_URL="mongodb://localhost:27017/pi1"
SESSION_SECRET="sua-chave-secreta-aqui"
NODE_ENV=development
```

4. Gere o cliente Prisma:
```bash
npx prisma generate
```

## Rodando o Projeto

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm start
```

## Endpoints da API

### Usuários
- POST /api/usuarios - Registrar novo usuário
- GET /api/usuarios - Listar usuários
- PUT /api/usuarios/:id - Atualizar usuário
- DELETE /api/usuarios/:id - Deletar usuário

### Autenticação
- POST /api/login - Login
- POST /api/login/logout - Logout
- GET /api/login/verificar - Verificar autenticação

### Dicas
- GET /api/dicas - Listar dicas
- POST /api/dicas - Criar nova dica

## Estrutura do Projeto

```
.
├── controllers/     # Controladores da aplicação
├── models/         # Modelos de dados
├── routes/         # Rotas da API
├── middleware/     # Middlewares
├── prisma/        # Configuração do Prisma
└── public/        # Arquivos estáticos
``` 