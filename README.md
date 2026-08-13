# Mini Kanban — Desafio Fullstack Veritas


Aplicação de gerenciamento de tarefas em formato Kanban, desenvolvida como desafio técnico para a **Veritas Consultoria Empresarial**. O projeto é dividido em duas partes independentes: um backend em **Go** (API REST) e um frontend em **React** (Vite), com persistência em memória e deploy em produção.

🔗 **Aplicação em produção:** [desafioveritas.online](https://desafioveritas.online)
🔗 **API:** [desafio-fullstack-veritas.onrender.com](https://desafio-fullstack-veritas.onrender.com)

![Demonstração do Kanban](./docs/imagens/kanban-demo.webp)

---

## Funcionalidades

- **CRUD completo de tarefas** — criar, visualizar, editar e excluir
- **Drag and drop** entre colunas (A Fazer, Em Progresso, Concluídas), com suporte a mouse e touch (mobile)
- **Reordenação de tarefas** dentro da mesma coluna, com persistência da ordem no backend
- **Categorização** por área (Frontend, Backend, DevOps, Database, Design) e **prioridade** (Baixa, Média, Alta, Crítica)
- **Skeleton loaders** durante o carregamento inicial dos dados
- **Confirmação de exclusão** antes de remover uma tarefa
- **Status da API** — página com verificação em tempo real da saúde do backend (uptime do processo, latência da última requisição, versão)
- **Feedback visual** de erros de rede com opção de nova tentativa

---

## Rodando localmente

### Pré-requisitos

- [Go](https://go.dev/dl/) 1.22 ou superior
- [Node.js](https://nodejs.org/) 18 ou superior

### Backend

```bash
cd backend
go run .
```

A API sobe em `http://localhost:8080` por padrão (ou na porta definida pela variável de ambiente `PORT`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O app fica disponível em `http://localhost:5173`.

> **Testando no celular pela mesma rede local:** rode `npm run dev -- --host` e ajuste a URL da API no frontend para o IP local da máquina (ex: `http://192.168.0.x:8080`), garantindo que esse endereço esteja liberado no CORS do backend.

---

## Arquitetura de pastas

```
desafio-fullstack-veritas/
├── backend/
│   ├── main.go        # roteamento, CORS, inicialização do servidor
│   ├── handlers.go    # handlers HTTP e armazenamento em memória
│   ├── models.go      # struct Task e validações
│   └── go.mod
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── task/          # TaskCard, TaskAddModal, TaskEditModal, skeletons
    │   │   ├── board/         # KanbanBoard, KanbanColumn, skeletons
    │   │   └── Header.jsx
    │   ├── ui/                # componentes genéricos (ConfirmModal, EmptyState, Loading)
    │   ├── services/
    │   │   └── api.js         # camada de comunicação com a API
    │   └── App.jsx
    ├── index.html
    └── vite.config.js
```

**Critério de separação:** dentro de `components/`, os arquivos ficam agrupados por **domínio** (`task/`, `board/`) — cada subpasta reúne tudo que "sabe" o que é uma tarefa ou um quadro, incluindo seus respectivos skeletons. Já `ui/` reúne apenas componentes **genéricos e reutilizáveis** em qualquer projeto (modal de confirmação genérico, estado vazio, spinner de carregamento).

No backend, optei por manter os arquivos no nível raiz do pacote `main` (`handlers.go`, `models.go`, `main.go`) dado o tamanho reduzido do projeto.

---

## API — Endpoints

| Método | Rota             | Descrição                                              |
| ------ | ---------------- | ------------------------------------------------------ |
| GET    | `/tasks`         | Lista todas as tarefas, ordenadas por status e posição |
| POST   | `/tasks`         | Cria uma nova tarefa                                   |
| PUT    | `/tasks/{id}`    | Atualiza uma tarefa existente                          |
| DELETE | `/tasks/{id}`    | Remove uma tarefa                                      |
| PUT    | `/tasks/reorder` | Atualiza status e posição de múltiplas tarefas em lote |

### Modelo de dados (`Task`)

```json
{
  "id": "1",
  "title": "Configurar ambiente de desenvolvimento",
  "description": "Instalar Node.js e preparar o repositório base.",
  "category": "devops",
  "priority": "Alta",
  "status": "todo",
  "order": 0
}
```

**Valores aceitos:**

- `status`: `todo` · `in_progress` · `done`
- `priority`: `Baixa` · `Média` · `Alta` · `Crítica`
- `category`: `frontend` · `backend` · `devops` · `database` · `design`

---

## Decisões técnicas

- **Persistência em memória:** dado o escopo do desafio, os dados são armazenados em um `map` protegido por mutex (`sync.Mutex`), sem banco de dados externo. Isso simplificou a entrega inicial, mas significa que os dados são reiniciados a cada deploy ou reinício do servidor no Render, motivo pelo qual a migração para Supabase está priorizada nos próximos passos.
- **CORS restrito por origem:** em vez de liberar `Access-Control-Allow-Origin: *`, o backend valida a origem da requisição contra uma lista explícita (ambiente local + domínio de produção), reduzindo a superfície de exposição da API.
- **Ordenação de tarefas:** cada tarefa carrega um campo `order`, recalculado no backend a cada reordenação ou mudança de coluna, garantindo que a posição visual sobreviva a atualizações de página.
- **Drag and drop com `@dnd-kit`:** escolhido por ter suporte ativo, melhor acessibilidade e compatibilidade nativa com touch, necessária para o uso mobile.

---

## ⚠️ Limitações conhecidas

- **Sem paginação.** O endpoint `GET /tasks` retorna todas as tarefas de uma vez, o que não escalaria para um volume grande de dados.
- **Sem filtro por coluna ou categoria** na interface, apesar de estar mapeado no fluxo de usuário original.
- **Sem testes automatizados**, tanto no backend quanto no frontend.
- **Plano gratuito do Render** pode causar cold start (alguns segundos de atraso na primeira requisição após período de inatividade).

---

## Próximos passos

- [x] **Migrar a persistência para [Supabase](https://supabase.com/)** (PostgreSQL), substituindo o armazenamento em memória e eliminando a perda de dados a cada reinício do servidor
- [x] **Adicionar testes automatizados**
  - Backend: testes unitários para handlers e validações (`testing` + `httptest`, pacote padrão do Go)
  - Frontend: testes de componente com Vitest + Testing Library
- [ ] **Containerizar a aplicação com Docker** (`Dockerfile` para backend e frontend, com `docker-compose` para orquestrar localmente junto de um banco Postgres)
- [ ] **Filtro por coluna e categoria** na interface
- [ ] **CI/CD** com GitHub Actions para rodar testes e lint automaticamente a cada push
- [ ] **Observabilidade mais robusta** na página de Status da API (histórico de uptime real via serviço externo de monitoramento, em vez de apenas o uptime do processo atual)

---

## Documentação

### User Flow e Fluxo de Dados

Diagramas com as principais ações do usuário no sistema e a interação entre frontend, API e a camada de persistência em memória:

![User Flow e Fluxo de Dados](./docs/user-flow.png)

---

## 👤 Autor

**João Emanuel**
[GitHub](https://github.com/joaoemanuels) · [LinkedIn](https://linkedin.com/in/joao-emanuels)
