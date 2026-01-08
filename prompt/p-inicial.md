📌 PROMPT – Sistema de Controle de Pagamentos (Prefeitura)
🏛️ Contexto Geral

Estou desenvolvendo um Sistema de Controle de Pagamentos para Prefeitura, com foco inicial em autenticação de usuários e gestão de cadastro.
O projeto será versionado no GitHub, e todas as alterações deverão ser registradas em um arquivo .mb, que servirá como histórico técnico do projeto (nome do arquivo fica a critério da implementação).

🧱 Stack Tecnológica Obrigatória
Frontend

Next.js 15 (App Router)

TypeScript

Estrutura moderna baseada em Server Components

CSS:

Pode utilizar TailwindCSS ou CSS Modules

Layout responsivo e institucional (padrão governo)

Backend / Persistência

Supabase como banco de dados PostgreSQL

Prisma ORM para modelagem e acesso ao banco

Migrations via Prisma

🎯 Objetivo do Prompt

Implementar:

Tela de Login

Login via e-mail e senha

Validação de campos

Feedback visual de erro/sucesso

Estrutura preparada para futura autenticação institucional

Controle de Cadastro de Usuário

Cadastro de usuário com:

Nome completo

E-mail

Senha (criptografada)

Status (ativo/inativo)

Data de criação

Listagem de usuários

Edição de dados

Exclusão lógica (soft delete)

Proteção de rotas (apenas usuários autenticados)

🗄️ Banco de Dados – Supabase
🔐 Dados do Projeto Supabase

Nome do projeto: dados

Senha: 043EGyaNeUHU0zt1

📁 Configuração de Ambiente
Arquivo: .env.local
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.wcvhhyzdstglhmzpejai:043EGyaNeUHU0zt1@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.wcvhhyzdstglhmzpejai:043EGyaNeUHU0zt1@aws-0-us-west-2.pooler.supabase.com:5432/postgres"

📁 Prisma
Arquivo: prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}


O schema deverá ser estendido para incluir o modelo User, com boas práticas de nomenclatura e índices.

📝 Controle de Alterações (.mb)

Criar um arquivo .mb (exemplo: controle-alteracoes.mb)

Todas as mudanças relevantes devem ser registradas:

Criação de telas

Alterações de schema

Ajustes de autenticação

Migrations

Decisões técnicas

🔄 Versionamento

Após finalizar a implementação:

Commitar todas as alterações

Atualizar o repositório no GitHub

Commits claros e objetivos (ex: feat: tela de login, feat: cadastro de usuários)

🚀 Resultado Esperado

Projeto Next.js 15 funcional

Autenticação básica implementada

CRUD de usuários operacional

Prisma conectado corretamente ao Supabase

Estrutura pronta para evolução do sistema de pagamentos