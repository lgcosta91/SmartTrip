# ESPECIFICAÇÃO OPERACIONAL — INICIALIZAÇÃO DO REPOSITÓRIO SMARTTRIP

**Código:** SPEC-OPS-001  
**Versão:** 1.0.0  
**Status:** Vigente / Homologado  
**Finalidade:** Padronizar os critérios operacionais, convenções e requisitos de reprodutibilidade para qualquer desenvolvedor, aluno ou avaliador que inicialize o projeto SmartTrip.

---

## 1. Versão Mínima Esperada do Node.js e Runtime

### 1.1 Critérios Verificáveis
* **Versão Mínima Requerida:** Node.js `>= 18.18.0 LTS` (recomendado: Node.js `20.x LTS` ou `22.x LTS`).
* **Incompatibilidade:** Versões inferiores a 18.0.0 são consideradas inválidas por falta de suporte a recursos nativos do ecossistema React 19 e Vite 8 (como `fetch`, Web Streams e `import.meta`).
* **Verificação Automatizada:**
  * Comando: `node -v`
  * Critério de Aceite: A saída deve reportar versão maior ou igual a `v18.18.0`.
* **Metadados Obrigatórios em `package.json`:**
  * Deve conter o campo `engines`:
    ```json
    "engines": {
      "node": ">=18.18.0",
      "npm": ">=9.0.0"
    }
    ```

---

## 2. Gerenciador de Pacotes e Determinismo

### 2.1 Critérios Verificáveis
* **Gerenciador Oficial:** `npm` (Node Package Manager) versão `>= 9.0.0`.
* **Proibição de Concorrência de Lockfiles:** O repositório deve conter **exclusivamente** o arquivo `package-lock.json`. É expressamente proibido versionar `yarn.lock`, `pnpm-lock.yaml` ou `bun.lockb`.
* **Instalação Determinística:**
  * Comando padrão em ambiente local: `npm install --legacy-peer-deps`
  * Comando em pipeline CI/CD: `npm ci --legacy-peer-deps`
  * Critério de Aceite: O processo deve finalizar com código de saída `0`, gerando a pasta `node_modules` sem erros não resolvidos de dependência.

---

## 3. Scripts Obrigatórios no `package.json`

O arquivo `package.json` deve disponibilizar, no mínimo, os seguintes scripts operacionais com comportamento determinístico:

| Script | Finalidade Operacional | Critério Verificável de Sucesso |
|---|---|---|
| `npm run dev` | Inicia o servidor local de desenvolvimento Vite com HMR na porta configurada (default: 3000). | Servidor responde HTTP 200 em `http://localhost:3000/` em menos de 3 segundos. |
| `npm run build` | Compila o bundle estático de produção e assets otimizados via Vite. | Saída de código `0`; criação do diretório `dist/` contendo `index.html` e assets compilados. |
| `npm run preview` | Executa servidor local servindo o conteúdo da pasta de build `dist/`. | Disponibilização do app estático em porta local com saída sem erro. |
| `npm run lint` | Executa a verificação estática de tipos TypeScript em todo o projeto (`tsc --noEmit`). | Saída de código `0`; zero erros sintáticos ou violações de tipagem. |
| `npm run clean` | Remove artefatos temporários e diretórios de build (`dist/`, caches locais). | Remoção confirmada das pastas sem falhas de permissão. |

---

## 4. Estratégia de `.env.local` e `.env.example`

### 4.1 Regras Estruturais de Variáveis de Ambiente
1. **Regra de Ouro:** O arquivo `.env.example` é versionado no Git; arquivos `.env`, `.env.local` e similares **jamais** devem ser rastreados.
2. **Vacuidade de Valores no `.env.example`:**
   * Nenhuma variável no `.env.example` pode conter tokens reais, senhas de produção, chaves de API ativas ou valores de teste com segredos.
   * Formato obrigatório: `NOME_DA_VARIAVEL=` (valor vazio) ou documentado com instrução explicativa de obtenção.
3. **Catálogo Mínimo de Variáveis Obrigatórias:**
   * `GEMINI_API_KEY`: Chave de acesso à API do Google Gemini (obtida no Google AI Studio).
   * `VITE_FIREBASE_API_KEY`: Chave de API pública do projeto Firebase.
   * `VITE_FIREBASE_AUTH_DOMAIN`: Domínio de autenticação do Firebase.
   * `VITE_FIREBASE_PROJECT_ID`: Identificador do projeto Firebase.
   * `VITE_FIREBASE_STORAGE_BUCKET`: Bucket do Cloud Storage associado.
   * `VITE_FIREBASE_MESSAGING_SENDER_ID`: ID do remetente de mensageria.
   * `VITE_FIREBASE_APP_ID`: Identificador da aplicação no Firebase.
4. **Verificação de Inicialização:**
   * O sistema deve emitir aviso visual claro ou falhar graciosamente se uma variável de ambiente obrigatória não estiver presente ao tentar realizar a chamada correspondente.

---

## 5. Requisitos e Verificação do `.gitignore`

### 5.1 Regras Mandatórias de Bloqueio
O arquivo `.gitignore` deve cobrir categoricamente os seguintes vetores:

1. **Dependências:** `node_modules/`, `.pnp`, `.pnp.js`.
2. **Builds e Artefatos:** `dist/`, `build/`, `out/`, `.next/`.
3. **Arquivos de Ambiente e Credenciais:**
   * `.env`
   * `.env*.local`
   * `.env.development`
   * `.env.production`
   * `*.pem`
   * `*.key`
   * `serviceAccount*.json`
   * `credentials.json`
4. **Exceção Explícita:** `!.env.example` (único arquivo de ambiente permitido no controle de versão).
5. **Logs de Diagnóstico:** `*.log`, `npm-debug.log*`, `yarn-error.log*`, `firebase-debug.log*`.

### 5.2 Critério Verificável de Auditoria
* A execução do comando `git status --ignored` ou a checagem manual do diretório deve confirmar que a criação de um arquivo `.env.local` na raiz permanece oculta do stage do Git.

---

## 6. Convenção de Branches

### 6.1 Estrutura de Ramificação
* **`main`:** Branch de produção estável. Todo commit na `main` deve estar homologado, com build íntegro e pronto para deploy na Vercel.
* **`develop` (ou branch de integração contínua):** Concentra a integração dos recursos antes da liberação.
* **Branches de Tarefa / Feature:** Devem ser criadas obrigatoriamente a partir da branch base e seguir o padrão de nomenclatura rastreável.

### 6.2 Padrão de Nomenclatura de Branches
* **Funcionalidade associada à História de Usuário:**  
  `feat/US-<numero>-<slug-da-funcionalidade>`  
  *Exemplo:* `feat/US-001-autenticacao-firebase`
* **Correção de Defeito associada a Requisito Funcional:**  
  `fix/RF-<numero>-<slug-do-bug>`  
  *Exemplo:* `fix/RF-006-geocoding-timeout`
* **Melhorias de Arquitetura, Scaffolding ou Configuração:**  
  `chore/<slug-da-tarefa>`  
  *Exemplo:* `chore/setup-scaffolding-servicos`
* **Documentação e Atualização de Especificações:**  
  `docs/<slug-da-especificacao>`  
  *Exemplo:* `docs/spec-operacional-inicializacao`

---

## 7. Convenção de Commits

A equipe adota o padrão **Conventional Commits v1.0.0**, com inclusão obrigatória de rastreabilidade para itens da SPEC quando aplicável.

### 7.1 Formato Estrutural
```text
<tipo>(<escopo>): <descrição em modo imperativo> [ID-RASTREAMENTO]

[corpo opcional detalhando a motivação ou decisão de design]

[rodapé opcional com referências ou breaking changes]
```

### 7.2 Tipos Aceitos
* `feat`: Nova funcionalidade para o usuário (deve referenciar `US-xxx` ou `RF-xxx`).
* `fix`: Correção de bug em código de produção (deve referenciar `RF-xxx`).
* `docs`: Alterações exclusivamente em documentação, SPECs ou diagramas.
* `style`: Formatação, ponto e vírgula, indentação (sem impacto em lógica).
* `refactor`: Refatoração interna que não adiciona recurso nem corrige bug.
* `test`: Criação ou ajuste de testes automatizados.
* `chore`: Mudanças em scripts de build, dependências de pacotes ou ferramentas auxiliares.

### 7.3 Exemplos Válidos e Verificáveis
* `feat(auth): implementar tela de login e integracao firebase [US-001]`
* `fix(weather): adicionar fallback gracioso para timeout na api open-meteo [RF-007]`
* `docs(specs): adicionar especificacao operacional de inicializacao [SPEC-OPS-001]`
* `chore(deps): atualizar configuracao do package.json e scripts locais`

---

## 8. Requisitos Mandatórios para o `README.md`

O arquivo `README.md` principal do repositório deve conter, obrigatoriamente, as seguintes seções estruturadas:

1. **Identificação e Propósito do Projeto:** Nome do projeto, contexto acadêmico (IA Generativa), objetivo principal e proposta de valor.
2. **Link Direto para a SPEC Mestre:** Referência rastreável para [docs/specs/SPEC_MESTRE.md](file:///c:/Users/Aluno/Desktop/Aula%2008%20-%20Amtigravity/smarttrip/docs/specs/SPEC_MESTRE.md).
3. **Matriz de Stack Tecnológica:** Listagem explícita de framework, linguagens, bibliotecas de estilo e provedores cloud.
4. **Guia de Instalação Passo a Passo:** Sequência exata de comandos para:
   * Clonagem do repositório;
   * Instalação de dependências com a flag necessária;
   * Criação e preenchimento de variáveis de ambiente a partir do `.env.example`;
   * Execução do servidor de desenvolvimento.
5. **Dicionário de Scripts:** Tabela explicando o que cada comando do `npm run` executa.
6. **Árvore Arquitetural do Repositório:** Diagrama de pastas explicando o papel de cada diretório em `src/` e `docs/`.
7. **Diretrizes de Segurança:** Aviso explícito contra o commit de credenciais e chaves.

---

## 9. Critérios para Considerar o Ambiente Reproduzível

O ambiente do repositório é formalmente considerado **reproduzível** quando atende simultaneamente a 5 critérios objetivos:

* **CR-01 (Determinismo de Instalação):** A execução de `npm install --legacy-peer-deps` em um diretório recém-clonado sem cache local finaliza com status `0` sem intervenção manual.
* **CR-02 (Isolamento de Segredos):** A execução de clonagem em qualquer máquina não traz nenhum arquivo `.env` pré-populado, exigindo a cópia explícita do template `.env.example`.
* **CR-03 (Zero Quebras de Tipagem):** O comando `npm run lint` executa e passa com código `0`, assegurando que o código TypeScript está totalmente íntegro.
* **CR-04 (Build Limpo de Produção):** O comando `npm run build` compila o projeto gerando a pasta `dist/` sem dependência de variáveis de ambiente privadas no momento de bundling.
* **CR-05 (Independência de Sistema Operacional):** Os scripts funcionam identicamente em terminais Windows (PowerShell/CMD), macOS (Zsh/Bash) e Linux (Bash).

---

## 10. Checklist de Onboarding para Outro Aluno / Avaliador

Este checklist deve ser utilizado para validar se qualquer novo membro do time consegue clonar, instalar e executar o projeto:

| # | Passo de Verificação | Comando a Executar | Resultado Esperado | Status |
|---|---|---|---|---|
| **1** | Checar Runtime do Node | `node -v` | Versão exibida `>= v18.18.0` | [ ] Pass / [ ] Fail |
| **2** | Checar Gerenciador | `npm -v` | Versão exibida `>= 9.0.0` | [ ] Pass / [ ] Fail |
| **3** | Clonar Repositório | `git clone <repo-url> smarttrip && cd smarttrip` | Pasta criada com histórico e arquivos base | [ ] Pass / [ ] Fail |
| **4** | Instalar Dependências | `npm install --legacy-peer-deps` | Código `0`, `node_modules` gerado | [ ] Pass / [ ] Fail |
| **5** | Gerar Arquivo de Configuração | `cp .env.example .env.local` (ou `copy` no Windows) | Arquivo `.env.local` criado na raiz | [ ] Pass / [ ] Fail |
| **6** | Verificar Auditoria Git | `git status` | `.env.local` **NÃO** aparece nos arquivos rastreados | [ ] Pass / [ ] Fail |
| **7** | Validar Tipagem do Código | `npm run lint` | Código `0` (`tsc --noEmit` sem erros) | [ ] Pass / [ ] Fail |
| **8** | Validar Compilação | `npm run build` | Código `0`, pasta `dist/` gerada com sucesso | [ ] Pass / [ ] Fail |
| **9** | Executar Servidor Local | `npm run dev` | Aplicação disponível em `http://localhost:3000/` | [ ] Pass / [ ] Fail |
| **10**| Navegação Inicial no Browser | Acessar URL no navegador | Tela carrega sem tela branca ou exceções no console | [ ] Pass / [ ] Fail |
