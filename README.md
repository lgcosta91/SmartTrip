# SmartTrip ✈️

Assistente Inteligente de Viagens desenvolvido como projeto final de IA Generativa.  
A aplicação orquestra modelos cognitivos avançados (**Google Gemini**) com dados de **geolocalização**, **previsão do tempo** e **pontos de interesse (POIs)** para gerar e gerenciar roteiros personalizados com curadoria e revisão humana ativa.

---

## 📋 Especificação do Projeto (SPEC Mestre)

O projeto segue estritamente a especificação mestre aprovada, documentada com identificadores de rastreabilidade (US, RF, RN, RNF, CA):
* 📄 **[SPEC Mestre Completa](docs/specs/SPEC_MESTRE.md)** (Visão, Personas, Histórias de Usuário, Arquitetura, Modelo de Dados e DoD)
* ⚙️ **[SPEC Operacional de Inicialização](docs/specs/SPEC_OPERACIONAL_INICIALIZACAO.md)** (Critérios de Ambiente, Reprodutibilidade, Git e Checklist)
* 🎨 **[SPEC da Interface-Base](docs/specs/SPEC_INTERFACE_BASE.md)** (Telas do MVP, Componentes, Acessibilidade e Critérios por Tela)
* 🔥 **[SPEC Técnica da Integração Firebase](docs/specs/SPEC_INTEGRACAO_FIREBASE.md)** (Auth, Firestore, Client vs Admin SDK, Security Rules e Singleton)
* 🔐 **[SPEC de Autenticação com Firebase Auth](docs/specs/SPEC_AUTENTICACAO_FIREBASE.md)** (Login, Cadastro, RBAC, users/{uid}, Proteção de Rotas e Testes)

---

## 🛠️ Stack Tecnológica

* **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React
* **Build Tool:** Vite
* **Autenticação:** Firebase Authentication (Email/Senha e Google Sign-In)
* **Banco de Dados:** Cloud Firestore (NoSQL em tempo real)
* **IA Generativa:** Google Gemini API (gemini-1.5-flash / 2.0) com JSON Schema Estruturado
* **Serviços de Contexto:** Open-Meteo API (Clima) e OpenStreetMap Nominatim / Open-Meteo Geocoding
* **Hospedagem & CI/CD:** Vercel

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) versão 18 ou superior instalada.
* Gerenciador de pacotes `npm`.

### 1. Clonar o repositório e acessar a pasta
```bash
cd smarttrip
```

### 2. Instalar as dependências
```bash
npm install --legacy-peer-deps
```

### 3. Configurar variáveis de ambiente
Copie o template de variáveis de ambiente:
```bash
cp .env.example .env.local
```
Edite o arquivo `.env.local` adicionando suas credenciais de desenvolvimento (obtenha a chave da API no [Google AI Studio](https://aistudio.google.com/) e a configuração no console do [Firebase](https://console.firebase.google.com/)).

> **Aviso de Segurança:** O arquivo `.env.local` e quaisquer credenciais sensíveis estão estritamente ignorados no `.gitignore` e **nunca** devem ser comitados.

### 4. Executar em modo de desenvolvimento
```bash
npm run dev
```
Acesse a aplicação em `http://localhost:3000`.

### 5. Executar verificação de tipos e lint
```bash
npm run lint
```

### 6. Gerar build de produção
```bash
npm run build
```
Para visualizar o build gerado:
```bash
npm run preview
```

---

## 📁 Estrutura do Repositório

```text
smarttrip/
├── docs/
│   └── specs/
│       └── SPEC_MESTRE.md    # Especificação mestre de requisitos e arquitetura
├── src/
│   ├── components/           # Componentes compartilhados (Header, Navigation, etc.)
│   ├── config/               # Configuração e leitura de variáveis de ambiente
│   ├── data/                 # Dados de apoio e mocks de transição
│   ├── hooks/                # Custom React Hooks
│   ├── screens/              # Telas da interface do usuário
│   ├── services/             # Camada de serviços (Auth, Firestore, Gemini, APIs)
│   ├── types/                # Definições de tipos e interfaces TypeScript
│   ├── App.tsx               # Componente raiz da aplicação
│   ├── index.css             # Estilos globais e tokens Tailwind
│   └── main.tsx              # Ponto de entrada da aplicação React
├── .env.example              # Template de variáveis de ambiente (sem valores)
├── .gitignore                # Regras rígidas de bloqueio de secrets e builds
├── package.json              # Metadados e dependências do projeto
├── tsconfig.json             # Configuração estrita do TypeScript
├── vite.config.ts            # Configuração do bundler Vite
└── README.md                 # Documentação de introdução e guia local
```

---

## 🔒 Segurança e Boas Práticas

* **Nenhum Secret no Repositório:** Variáveis como `GEMINI_API_KEY` e credenciais de banco são carregadas exclusivamente via variáveis de ambiente.
* **Saída Estruturada na IA:** Todas as respostas da IA devem aderir a schemas tipados para garantir estabilidade no frontend.
* **Human-in-the-Loop:** Toda proposta gerada pela IA passa por uma interface de revisão humana antes de ser homologada e salva.
