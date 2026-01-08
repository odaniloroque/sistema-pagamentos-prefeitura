1. A tela inicial do projeto tem que ter um menu lateral com as opções de Login e Cadastro.
2. 📌 PROMPT – Sistema de Controle de Pagamentos
Projeto: EMPENHO
🎯 Objetivo do Sistema

Desenvolver um Sistema de Controle de Pagamentos (Empenho) para gestão de despesas, contratos e fornecedores, permitindo o cadastro, acompanhamento e avaliação de pagamentos realizados por uma instituição pública (ex: prefeitura).

O sistema deverá garantir rastreamento completo, status do pagamento, dados do fornecedor, vínculo contratual e histórico de alterações.

🧱 Tecnologias Base

Frontend: Next.js 15 (App Router)

Backend: API Routes (Next.js)

Banco de Dados: PostgreSQL ou SQLite

ORM: Prisma

Autenticação: JWT / NextAuth

Estilo: Tailwind CSS

Versionamento: GitHub

Registro de Alterações: Arquivo .mb (log do sistema)

🗂️ Nome do Arquivo de Registro

Todas as alterações do sistema deverão ser registradas em um arquivo chamado:

empenho_auditoria.mb

🧩 Módulos do Sistema
🔐 1. Autenticação

Tela de login

Perfis de acesso:

Administrador

Financeiro

Auditoria (somente leitura)

🏢 2. Cadastro de Fornecedores

Campos obrigatórios:

Razão Social

Nome Fantasia

CNPJ

Endereço Completo

Telefone

E-mail

Dados Bancários

Banco

Agência

Conta

Tipo de Conta

Situação (Ativo / Inativo)

📄 3. Cadastro de Contratos (Opcional)

Número do Contrato

Fornecedor vinculado

Objeto do Contrato

Data de Início

Data de Término

Valor Total do Contrato

Situação (Vigente / Encerrado / Suspenso)

💰 4. Cadastro de Empenho (Pagamento)

Ao cadastrar um empenho, o sistema deverá inicializar automaticamente o status como “Em Avaliação”.

Campos do Empenho:

Número do Empenho

Fornecedor

Possui contrato? (Sim / Não)

Se sim:

Número do Contrato

Empresa/Órgão Pagador

CNPJ do Órgão Pagador

Descrição do Pagamento

Valor do Empenho

Data de Emissão

Data Prevista de Pagamento

Status do Empenho:

EM_AVALIACAO (padrão)

APROVADO

REPROVADO

PAGO

CANCELADO

Observações

Usuário Responsável pelo Cadastro

🔄 5. Fluxo de Status

Todo empenho inicia com o status:

EM_AVALIACAO


Alterações de status devem:

Registrar data e hora

Registrar usuário responsável

Registrar motivo da alteração

Ser gravadas no arquivo empenho_auditoria.mb

📑 6. Auditoria e Logs

O sistema deve:

Registrar toda criação, edição ou exclusão

Gravar logs no formato:

[DATA_HORA] | USUÁRIO | AÇÃO | ENTIDADE | ID | DETALHES


Exemplo:

2026-01-08 15:22 | admin | CREATE | EMPENHO | 1023 | Status inicial: EM_AVALIACAO

🖥️ Telas Obrigatórias

Login

Dashboard (resumo financeiro)

Fornecedores

Contratos

Empenhos

Detalhes do Empenho

Histórico / Auditoria

🧠 Regras de Negócio

Não permitir pagamento (PAGO) sem aprovação prévia

Não permitir exclusão de empenho já pago

Empenhos vinculados a contrato não podem exceder o valor do contrato

Somente usuários autorizados podem aprovar ou reprovar empenhos

🚀 Resultado Esperado

Um sistema:

Seguro

Auditável

Modular

Escalável

Adequado para ambiente público

Compatível com boas práticas de desenvolvimento moderno