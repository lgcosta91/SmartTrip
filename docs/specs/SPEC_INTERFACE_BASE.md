# SPEC DA INTERFACE-BASE — SMARTTRIP (MVP)

**Código:** SPEC-UI-001  
**Versão:** 1.0.0  
**Status:** Aprovado para Implementação  
**Escopo:** Telas, Componentes, Contratos de Apresentação e Estados de Interface do MVP  
**Referência Cruzada:** [SPEC Mestre (SPEC_MESTRE.md)](SPEC_MESTRE.md) | [SPEC Operacional (SPEC_OPERACIONAL_INICIALIZACAO.md)](SPEC_OPERACIONAL_INICIALIZACAO.md)  

---

## 1. Visão Geral da Interface e Design System

A interface do **SmartTrip** foi concebida sob os princípios de **Modernidade, Agilidade e Clareza Cognitiva**. O viajante deve sentir que está utilizando uma ferramenta de alta tecnologia e curadoria refinada, livre de poluição visual.

### 1.1 Diretrizes Visuais Globais
* **Paleta Cromática:** Tons contemporâneos com alto contraste (Off-white/Cinza neutro para planos de fundo `#F8FAFC`, Azul Profundo `#0F172A` para tipografia principal, Azul Royal/Índigo `#2563EB` para ações primárias, Âmbar `#F59E0B` para destaques de clima/IA e Esmeralda `#10B981` para confirmações).
* **Tipografia:** Fonte sem serifa moderna (Inter ou Outfit), hierarquia estrita de tamanhos e pesos (`h1` 32-40px bold, `h2` 24-28px semibold, `body` 14-16px regular).
* **Grid e Breakpoints:**
  * **Mobile:** `< 768px` (layout em coluna única vertical, barra de navegação flutuante inferior ou menu hambúrguer, áreas de toque mínimas de 44x44px).
  * **Tablet/Desktop:** `>= 768px` e `>= 1024px` (layout com cabeçalho superior persistente, grids de 2 a 3 colunas, modais centralizados e painéis laterais).

---

## 2. Mapa de Rotas e Classificação de Acesso

| Rota | Nome da Tela | Acesso | Comportamento de Redirecionamento |
|---|---|---|---|
| `/` | Landing Page | **Público** | Se autenticado, exibe atalho "Ir para o Dashboard". |
| `/login` | Login | **Público** | Se já autenticado, redireciona para `/dashboard`. |
| `/register` | Cadastro | **Público** | Se já autenticado, redireciona para `/dashboard`. |
| `/dashboard` | Painel Geral | **Privado** | Se não autenticado, redireciona para `/login`. |
| `/profile` | Perfil & Preferências | **Privado** | Se não autenticado, redireciona para `/login`. |
| `/availability` | Períodos de Folga | **Privado** | Se não autenticado, redireciona para `/login`. |
| `/explore` | Busca & Geração com IA | **Privado** | Se não autenticado, redireciona para `/login`. |
| `/trips` | Minhas Viagens | **Privado** | Se não autenticado, redireciona para `/login`. |
| `/trips/[id]` | Detalhe & Revisão do Roteiro | **Privado** | Se não autenticado, redireciona para `/login`. |

---

## 3. Especificação Detalhada das Telas do MVP

---

### 3.1 Tela: `/` (Landing Page)

* **Objetivo:** Apresentar a proposta de valor do SmartTrip, demonstrar como a IA gera roteiros personalizados e converter visitantes em novos usuários.
* **Elementos Obrigatórios:**
  1. Cabeçalho público com logotipo do SmartTrip, link "Como Funciona" e botões "Entrar" e "Começar Grátis".
  2. Hero Section com headline impactante, subtítulo explicativo, badges de benefícios (IA contextual, clima real, revisão humana) e CTA principal.
  3. Demonstração visual de um roteiro modelo (card interativo de preview).
  4. Seção explicativa em 3 passos: "1. Informe suas folgas $\rightarrow$ 2. Escolha o destino $\rightarrow$ 3. Receba e revise seu roteiro".
  5. Rodapé com links de documentação, termos e menção acadêmica.
* **Navegação:**
  * Clique em "Começar Grátis" ou "Criar Conta": direciona para `/register`.
  * Clique em "Entrar": direciona para `/login`.
* **Layout:**
  * *Mobile:* Conteúdo verticalmente empilhado, CTAs de largura total (`w-full`), preview resumido em card único.
  * *Desktop:* Layout em duas colunas na Hero Section (texto de impacto à esquerda e mockup interativo à direita).
* **Estados de Interface:**
  * *Normal:* Exibição estática de alta fidelidade visual.
* **Critérios de Aceite:**
  * `CA-UI-001`: A página deve renderizar sem requisições protegidas e com FCP inferior a 1s.
  * `CA-UI-002`: Todos os botões de ação devem levar com precisão para `/login` ou `/register`.

---

### 3.2 Tela: `/login` (Autenticação)

* **Objetivo:** Permitir acesso seguro à conta do viajante via credenciais de e-mail/senha ou autenticação federada com Google.
* **Elementos Obrigatórios:**
  1. Card centralizado de login com logo da marca.
  2. Botão proeminente "Continuar com o Google" (com ícone oficial).
  3. Divisor visual "ou continue com e-mail".
  4. Campos de formulário: `E-mail` e `Senha` (com botão de alternar visualização de senha).
  5. Link "Esqueci minha senha".
  6. Botão de submissão primário "Acessar Conta".
  7. Rodapé com link "Não tem uma conta? Cadastre-se" direcionando para `/register`.
* **Navegação:**
  * Sucesso de autenticação: redireciona para `/dashboard`.
  * Clique em "Cadastre-se": direciona para `/register`.
* **Layout:**
  * *Mobile:* Card ocupando 100% da largura com margens de segurança, teclado numérico/email contextual.
  * *Desktop:* Card centralizado com largura máxima de `440px`, backdrop com gradiente sutil.
* **Estados de Interface:**
  * *Normal:* Formulário pronto para preenchimento.
  * *Loading:* Botões desabilitados com spinner circular e texto "Entrando...".
  * *Error:* Alerta inline com contorno vermelho destacando erro de credenciais inválidas ou conta não encontrada.
* **Critérios de Aceite:**
  * `CA-UI-003`: Campos com validação de formato de e-mail e bloqueio de submissão vazia.
  * `CA-UI-004`: Feedback claro de loading impedindo múltiplos cliques.

---

### 3.3 Tela: `/register` (Cadastro de Novo Usuário)

* **Objetivo:** Coletar dados básicos do usuário para criação de credenciais e inicialização do perfil de viajante.
* **Elementos Obrigatórios:**
  1. Card de cadastro com título "Crie sua conta no SmartTrip".
  2. Botão "Cadastrar com o Google".
  3. Campos de formulário: `Nome Completo`, `E-mail`, `Senha` e `Confirmação de Senha`.
  4. Indicador de força de senha (mínimo 6 caracteres).
  5. Checkbox de concordância com Termos e Privacidade.
  6. Botão "Criar Conta".
  7. Link para `/login` caso o usuário já possua cadastro.
* **Navegação:**
  * Sucesso de criação: redireciona para `/profile` (para onboarding de preferências) ou `/dashboard`.
* **Layout:**
  * *Mobile:* Formulário vertical com auto-scroll ao focar em inputs inferiores.
  * *Desktop:* Card de largura máxima de `480px` centralizado na tela.
* **Estados de Interface:**
  * *Normal:* Inputs limpos com placeholders informativos.
  * *Loading:* Botão desabilitado com spinner ativo.
  * *Error:* Mensagens contextuais em cada input (ex.: "As senhas não coincidem", "E-mail já cadastrado").
* **Critérios de Aceite:**
  * `CA-UI-005`: Bloqueio de submissão se as senhas forem divergentes ou menores que 6 caracteres.
  * `CA-UI-006`: Exibição acessível das mensagens de erro associadas aos campos via `aria-describedby`.

---

### 3.4 Tela: `/dashboard` (Painel Geral)

* **Objetivo:** Servir como central de comando do usuário logado, exibindo resumo da próxima viagem, contadores de folgas, atalho para nova geração e viagens recentes.
* **Elementos Obrigatórios:**
  1. Saudação personalizada (ex: "Olá, Juliana! Pronto para a próxima viagem?").
  2. Banner/Card de destaque da "Próxima Viagem" com contagem regressiva, destino, datas e botão "Ver Roteiro".
  3. Seção de Estatísticas Rápidas: Dias de folga cadastrados, Viagens planejadas e Países/Cidades explorados.
  4. Botão de Ação Rápida (Floating Action Button ou Card Destaque): "Planejar Nova Viagem com IA" (direciona para `/explore`).
  5. Carrossel ou Grid de "Roteiros Recentes" com status (`Rascunho`, `Confirmado`).
  6. Acesso rápido ao gerenciador de folgas (`/availability`).
* **Navegação:**
  * Clique no banner de viagem: direciona para `/trips/[id]`.
  * Clique em "Planejar Nova Viagem": direciona para `/explore`.
  * Clique em "Gerenciar Folgas": direciona para `/availability`.
* **Layout:**
  * *Mobile:* Cards em coluna única, navegação inferior com ícone ativo no Dashboard.
  * *Desktop:* Grid de 12 colunas (8 colunas para Próxima Viagem e Recentes, 4 colunas para Folgas e Ações Rápidas).
* **Estados de Interface:**
  * *Normal:* Dados mock populados exibindo a próxima viagem e métricas.
  * *Vazio:* Caso o usuário não possua viagens cadastradas: ilustração amigável, texto "Você ainda não tem roteiros planejados" e CTA proeminente "Criar Primeiro Roteiro".
  * *Loading:* Skeletons retangulares simulando o banner principal e os cards de viagens.
  * *Error:* Mensagem de erro com botão "Recarregar Painel".
* **Critérios de Aceite:**
  * `CA-UI-007`: O estado vazio deve ser apresentado com visual motivador e ação de primeiro uso sem quebras de layout.
  * `CA-UI-008`: Todos os cards de viagens recentes devem conter links válidos para `/trips/[id]`.

---

### 3.5 Tela: `/profile` (Perfil & Preferências)

* **Objetivo:** Gerenciar as informações cadastrais e as preferências de estilo de viagem que alimentam o motor de inteligência artificial.
* **Elementos Obrigatórios:**
  1. Cabeçalho de Perfil com foto/avatar do usuário, botão de upload/troca de avatar, nome e e-mail.
  2. Formulário de Dados Pessoais: Nome exibido, Cidade/País de origem.
  3. Seletor de Ritmo de Viagem (*Travel Pace*): 3 cards selecionáveis (Relaxado, Equilibrado, Intenso) com descrição de cada um.
  4. Tags de Interesses Turísticos (Multi-seleção com chips clicáveis): Gastronomia, Museus/História, Ecoturismo, Vida Noturna, Praias, Compras, Fotografia.
  5. Seletor de Nível de Orçamento: Mochileiro ($), Conforto ($$), Luxo ($$$).
  6. Campo de Restrições Especiais: Restrições alimentares (vegetariano, vegano, celíaco) ou mobilidade reduzida.
  7. Botão fixo/destaque "Salvar Alterações".
  8. Ação secundária perigosa: "Encerrar Sessão" e "Excluir Conta".
* **Navegação:**
  * Clique em "Salvar Alterações": exibe toast de confirmação e mantém na tela.
  * Clique em "Encerrar Sessão": direciona para `/login`.
* **Layout:**
  * *Mobile:* Abas ou acordeões verticais para evitar rolagem excessiva.
  * *Desktop:* Layout em 2 colunas (coluna esquerda com resumo e foto, coluna direita com formulário e chips de interesse).
* **Estados de Interface:**
  * *Normal:* Campos pré-preenchidos com valores padrão.
  * *Loading:* Inputs bloqueados com efeito shimmer durante salvamento simulado.
  * *Toast:* Feedback visual de sucesso no canto superior direito.
* **Critérios de Aceite:**
  * `CA-UI-009`: Os chips de interesse devem permitir seleção múltipla com indicação visual de foco e contraste de seleção ativo.
  * `CA-UI-010`: O seletor de ritmo deve ser mutuamente exclusivo (apenas 1 opção ativa).

---

### 3.6 Tela: `/availability` (Períodos de Folga)

* **Objetivo:** Cadastrar e visualizar intervalos de folgas, feriados prolongados ou férias para alimentar a geração automática de roteiros.
* **Elementos Obrigatórios:**
  1. Barra de Ação com título "Meus Períodos de Folga" e botão "Adicionar Período".
  2. Modal ou Formulário inline para novo período:
     * Campo de Rótulo/Título (ex.: "Férias de Inverno", "Feriado Tiradentes");
     * Data de Início (`date picker`);
     * Data de Término (`date picker`);
     * Cálculo automático de total de dias exibido em tempo real.
  3. Lista/Tabela de Folgas cadastradas com badge de status (Próximo, Em Andamento, Concluído).
  4. Botão de ação direta em cada folga: "Planejar Viagem para esta Folga" (leva para `/explore` com datas pré-selecionadas).
  5. Ação de excluir período com confirmação.
* **Navegação:**
  * Ação "Planejar Viagem": navega para `/explore?startDate=...&endDate=...`.
* **Layout:**
  * *Mobile:* Cards verticais para cada período de folga, botão flutuante "+".
  * *Desktop:* Tabela estruturada ou grid de cards de folgas com modal de cadastro.
* **Estados de Interface:**
  * *Normal:* Lista com períodos mockados.
  * *Vazio:* Ilustração de calendário, mensagem "Nenhuma folga cadastrada" e botão "Cadastrar Minha Primeira Folga".
  * *Loading:* Linhas de skeleton simulando o carregamento da lista.
  * *Error:* Alerta inline com opção de reprocessar.
* **Critérios de Aceite:**
  * `CA-UI-011`: O formulário deve bloquear a seleção de `dataFim < dataInicio` e impedir datas no passado.
  * `CA-UI-012`: O total de dias corridos deve ser recalculado dinamicamente ao alterar as datas.

---

### 3.7 Tela: `/explore` (Busca de Destino & Geração com IA)

* **Objetivo:** Permitir ao viajante buscar um destino, visualizar prévias de clima e atrativos locais, parametrizar sua viagem e disparar a síntese do roteiro pelo Gemini.
* **Elementos Obrigatórios:**
  1. Campo de Busca com Autocomplete: "Para onde você quer viajar?" (com ícone de mapa e botão de limpar).
  2. Seletor de Datas da Viagem (Início e Término ou atalho para vincular a uma folga já cadastrada).
  3. Painel de Contexto do Destino (aparece após escolher a cidade):
     * Card de **Clima Previsto**: Temperatura média, probabilidade de chuva, ícone meteorológico e dica de vestuário.
     * Card de **Pontos de Destaque (POIs)**: 3 a 5 atrações icônicas da cidade com tags de categoria.
  4. Resumo de Parâmetros: Estilo herdado do perfil (ex: "Ritmo Moderado • Gastronomia e Cultura • Orçamento Médio") com link rápido "Personalizar para esta viagem".
  5. Botão de Alta Ação: "Gerar Roteiro Inteligente com IA" (com ícone de brilho/estrela).
* **Navegação:**
  * Ao confirmar a geração: transita para a tela de visualização e revisão `/trips/[id]` (ou rascunho de revisão).
* **Layout:**
  * *Mobile:* Formulário sequencial passo a passo (Step 1: Destino $\rightarrow$ Step 2: Datas $\rightarrow$ Step 3: Resumo $\rightarrow$ Gerar).
  * *Desktop:* Painel em 2 colunas (coluna esquerda com formulário de busca e datas; coluna direita com visualizador de clima, mapa conceitual e POIs).
* **Estados de Interface:**
  * *Inicial:* Apenas a barra de busca e atalhos de destinos em alta.
  * *Destino Selecionado:* Cards de clima e POIs renderizados com animação suave de entrada.
  * *Loading de IA (Crítico):* Modal/Overlay inteligente de carregamento com barra de progresso visual, animação de síntese cognitiva e mensagens rotativas estimulantes ("Analisando atrações em Buenos Aires...", "Otimizando rotas pelo clima...", "Montando seu dia a dia perfeito...").
  * *Error:* Mensagem de erro caso a síntese falhe com botão de "Tentar Novamente".
* **Critérios de Aceite:**
  * `CA-UI-013`: O botão de geração deve permanecer desabilitado até que destino e datas válidas estejam selecionados.
  * `CA-UI-014`: O estado de loading da IA não pode bloquear a janela com tela estática; deve exibir feedback dinâmico e tempo estimado.

---

### 3.8 Tela: `/trips` (Minhas Viagens — Listagem Geral)

* **Objetivo:** Oferecer um painel limpo e organizado com todos os roteiros criados pelo usuário, permitindo filtragem, busca e exclusão.
* **Elementos Obrigatórios:**
  1. Barra Superior com título "Minhas Viagens", contador de viagens e botão de nova viagem "+ Novo Roteiro".
  2. Filtros de Status: Abas com chips ("Todas", "Próximas", "Concluídas", "Rascunhos").
  3. Campo de busca de viagens pelo nome do destino.
  4. Cards de Viagem contendo:
     * Foto do destino;
     * Nome da cidade e país com bandeira/código;
     * Período de datas (ex: "12 a 16 de Outubro • 5 dias");
     * Badge de status (`Confirmada`, `Em Revisão`, `Concluída`);
     * Mini-resumo de atrações principais;
     * Menu de Ações rápidas: "Abrir Roteiro", "Duplicar" e "Excluir Viagem".
  5. Modal de Confirmação de Exclusão com aviso de ação irreversível.
* **Navegação:**
  * Clique no card: navega para `/trips/[id]`.
  * Clique em "+ Novo Roteiro": navega para `/explore`.
* **Layout:**
  * *Mobile:* Cards de lista vertical com imagem em banner superior.
  * *Desktop:* Grid responsivo de 3 colunas com transições em hover.
* **Estados de Interface:**
  * *Normal:* Exibição dos cards mockados.
  * *Vazio:* Ilustração de mala de viagem com mensagem "Nenhuma viagem encontrada neste filtro" e botão para explorar.
  * *Loading:* Grid com 6 cards de skeleton pulsantes.
  * *Modal de Exclusão:* Diálogo modal acessível bloqueando o fundo.
* **Critérios de Aceite:**
  * `CA-UI-015`: Ao acionar o botão de exclusão, deve abrir obrigatoriamente um modal de confirmação com foco acessível no botão "Cancelar".
  * `CA-UI-016`: A busca de viagens deve filtrar os cards em tempo real na interface.

---

### 3.9 Tela: `/trips/[id]` (Detalhamento do Roteiro & Revisão Humana)

* **Objetivo:** Exibir o roteiro dia a dia gerado pela IA e oferecer os controles de **curadoria e revisão humana ativa** (edição de atividades, exclusão, troca de horários e aprovação final).
* **Elementos Obrigatórios:**
  1. Hero Header da Viagem: Imagem de capa do destino, título da viagem, datas, total de dias, badge de clima e botão de compartilhamento rápido.
  2. Barra de Navegação Diária (Tabs/Pills): "Dia 1", "Dia 2", "Dia 3", com indicador da data correspondente.
  3. Painel do Dia Selecionado:
     * Tema/Destaque do dia (ex.: "Dia 1: Centro Histórico e Gastronomia Tradicional");
     * Resumo meteorológico do dia (temperatura média e ícone);
     * Lista de Atividades agrupadas por períodos: **Manhã**, **Tarde**, **Noite**.
  4. Card de Atividade Interativo:
     * Horário sugerido (ex: `09:30`);
     * Título da atração;
     * Descrição e dica prática gerada pela IA;
     * Localização e custo estimado;
     * Badge `Personalizado` (caso tenha sido editado manualmente);
     * Ações do Card: Botão "Editar" (abre edição inline de título/horário) e Botão "Remover" (ícone de lixeira).
  5. Botão "+ Adicionar Atividade neste período".
  6. Barra de Ação Fixa de Homologação:
     * Botão "Confirmar e Salvar Viagem" (grava versão definitiva);
     * Botão "Regenerar com IA" (com modal de ajuste de prompt);
     * Botão de impressão / exportação visual limpa.
* **Navegação:**
  * Clique no botão de voltar: retorna para `/trips` ou `/dashboard`.
  * Clique em salvar: exibe toast de sucesso e atualiza o status para `Confirmada`.
* **Layout:**
  * *Mobile:* Navegação horizontal por scroll para os dias ("Dia 1, Dia 2..."), cards verticais com ações em botões touch-friendly, barra de salvar fixa na parte inferior.
  * *Desktop:* Layout de 2 colunas (coluna esquerda com índice dos dias e resumo de custos/clima; coluna direita com a timeline expandida de atividades do dia selecionado).
* **Estados de Interface:**
  * *Normal:* Linha do tempo de atividades interativas.
  * *Edição Ativa:* O card de atividade se transforma em formulário inline (campos de input para título, hora e observações).
  * *Loading:* Skeletons da timeline simulando blocos de manhã/tarde/noite.
  * *Confirmado:* Feedback visual de sucesso informando que as alterações foram salvas.
* **Critérios de Aceite:**
  * `CA-UI-017`: O usuário deve conseguir editar o texto de uma atividade e o card deve refletir a alteração imediatamente no estado da tela.
  * `CA-UI-018`: Ao remover uma atividade, a timeline deve se reorganizar sem recarregar a página.
  * `CA-UI-019`: A alternância entre os dias (Dia 1, Dia 2, Dia 3) deve ser instantânea sem rolagem indesejada para o topo da página.

---

## 4. Biblioteca de Componentes Reutilizáveis

Os componentes devem ser desacoplados e padronizados:

```text
src/components/
├── ui/
│   ├── Button.tsx             # Variantes: primary, secondary, outline, danger, ghost
│   ├── Input.tsx              # Input com suporte a label, ícone, helperText e error
│   ├── DatePicker.tsx         # Seletor de datas acessível com range
│   ├── Card.tsx               # Container com bordas suaves, sombra e padding
│   ├── Badge.tsx              # Pílula colorida (success, warning, info, neutral)
│   ├── Modal.tsx              # Diálogo com foco preso (focus trap) e tecla Esc
│   ├── Skeleton.tsx           # Efeito de shimmer retangular e circular
│   └── Toast.tsx              # Notificações flutuantes com auto-dismiss
├── layout/
│   ├── Header.tsx             # Cabeçalho com logo, avatar e navegação
│   ├── Navigation.tsx         # Bottom navigation (mobile) ou menu superior
│   └── PageContainer.tsx      # Container com max-width e margens padronizadas
└── travel/
    ├── WeatherCard.tsx        # Exibição compacta de previsão meteorológica
    ├── ActivityCard.tsx       # Card de atração com suporte a modo visualização e edição
    ├── DayTabs.tsx            # Navegador de dias do itinerário
    └── DestinationSearch.tsx  # Input de autocompletar com mock de cidades
```

---

## 5. Acessibilidade Básica (a11y)

* **Semântica HTML:** Uso estrito de `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` e `<footer>`.
* **Hierarquia de Títulos:** Cada tela possui exatamente um elemento `<h1>`. Subseções utilizam sequencialmente `<h2>` e `<h3>`.
* **Navegação por Teclado:**
  * Todos os elementos interativos (botões, links, inputs, chips) devem ser focáveis via `Tab`.
  * Estados de foco com anel visível de alto contraste (`focus-visible:ring-2 focus-visible:ring-blue-500`).
  * Modais devem fechar ao pressionar a tecla `Escape` e prender o foco enquanto abertos.
* **Rotulagem ARIA:**
  * Ícones sem texto explicativo devem conter `aria-label` descritivo.
  * Indicadores de loading devem conter `aria-live="polite"` e `role="status"`.
* **Contraste de Cores:** Relação de contraste mínima de 4.5:1 para texto normal e 3:1 para texto grande/componentes gráficos (WCAG 2.1 nível AA).

---

## 6. Contrato de Dados Mock Permitidos nesta Fase

Durante a fase de interface-base, a aplicação utilizará mocks tipados em [src/types/trip.ts](file:///c:/Users/Aluno/Desktop/Aula%2008%20-%20Amtigravity/smarttrip/src/types/trip.ts) para simular o comportamento real sem disparar chamadas externas:

```typescript
// Contratos permitidos em src/data/mockData.ts
export const MOCK_USER_PROFILE = {
  uid: "usr_mock_123",
  displayName: "Juliana Mendes",
  email: "juliana.mendes@example.com",
  photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  preferences: {
    travelPace: "moderate",
    interests: ["Gastronomia", "Cultura & Museus", "Caminhadas ao Ar Livre"],
    budgetLevel: "medium",
    dietaryRestrictions: ["Sem restrições graves"]
  }
};

export const MOCK_DESTINATIONS = [
  { name: "Buenos Aires, Argentina", lat: -34.6037, lng: -58.3816, country: "AR", temp: 22, condition: "Ensolarado" },
  { name: "Santiago, Chile", lat: -33.4489, lng: -70.6693, country: "CL", temp: 19, condition: "Parcialmente Nublado" },
  { name: "Rio de Janeiro, Brasil", lat: -22.9068, lng: -43.1729, country: "BR", temp: 28, condition: "Ensolarado" }
];

export const MOCK_TIME_OFFS = [
  { id: "to_1", userId: "usr_mock_123", title: "Férias de Outono", startDate: "2026-10-10", endDate: "2026-10-15", days: 5 },
  { id: "to_2", userId: "usr_mock_123", title: "Feriado de Finados", startDate: "2026-11-01", endDate: "2026-11-04", days: 3 }
];
```

---

## 7. Matriz de Critérios de Aceite por Tela

| ID | Tela | Critério Verificável |
|---|---|---|
| **CA-UI-001** | `/` | Hero section e seções explicativas renderizam sem requisições privadas com FCP < 1s. |
| **CA-UI-002** | `/` | Todos os CTAs navegam corretamente para `/login` ou `/register`. |
| **CA-UI-003** | `/login` | Formulário valida e-mail inválido e submissão vazia antes do envio. |
| **CA-UI-004** | `/login` | Botões entram em estado desabilitado durante o carregamento. |
| **CA-UI-005** | `/register` | Bloqueio de submissão se confirmação de senha divergir ou tiver menos de 6 caracteres. |
| **CA-UI-006** | `/register` | Mensagens de erro são associadas semanticamente aos campos com `aria-describedby`. |
| **CA-UI-007** | `/dashboard`| Exibe card de Próxima Viagem quando há dados ou estado vazio amigável quando a lista está vazia. |
| **CA-UI-008** | `/dashboard`| Todos os cards de viagens contêm atalhos funcionais para `/trips/[id]`. |
| **CA-UI-009** | `/profile` | Chips de interesses permitem seleção múltipla com indicação visual de foco e seleção. |
| **CA-UI-010** | `/profile` | Seletor de ritmo de viagem é mutuamente exclusivo (apenas 1 ativo). |
| **CA-UI-011** | `/availability` | Bloqueio automático de datas de término anteriores às de início no formulário de folga. |
| **CA-UI-012** | `/availability` | Cálculo de total de dias de folga atualiza em tempo real ao selecionar datas. |
| **CA-UI-013** | `/explore` | Botão "Gerar Roteiro Inteligente com IA" só fica ativo após destino e datas selecionados. |
| **CA-UI-014** | `/explore` | Estado de loading da IA exibe tela dinâmica com mensagens contextuais rotativas. |
| **CA-UI-015** | `/trips` | Exclusão de viagem aciona modal de confirmação antes de remover o item da lista. |
| **CA-UI-016** | `/trips` | Campo de busca filtra a lista de viagens em tempo real. |
| **CA-UI-017** | `/trips/[id]` | Edição de atividade permite alterar título e horário refletindo de imediato na timeline. |
| **CA-UI-018** | `/trips/[id]` | Remoção de atividade atualiza a lista de períodos do dia sem recarregar a tela. |
| **CA-UI-019** | `/trips/[id]` | Troca de dia nas abas (Dia 1, Dia 2...) é instantânea sem saltos bruscos de rolagem. |
| **CA-UI-020** | Global | Todas as telas privadas redirecionam para `/login` quando o estado de autenticação for nulo. |
