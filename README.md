# 📰 API Notícias

Uma API moderna e minimalista construída com **Fastify** e **TypeScript** para agregação de notícias e processamento inteligente de dados utilizando IA.

## ✨ Funcionalidades

- **Busca de Notícias (RSS):** Integração nativa com feeds RSS (ex: Wired) para captura de manchetes em tempo real.
- **Inteligência Artificial:** Processamento de tópicos e análise de conteúdo via Hugging Face (Llama 3).
- **Autenticação:** Proteção de rotas utilizando API Key.
- **Validação Automática:** Query params validados pelo Fastify através do AJV.
- **Alta Performance:** Estruturada sobre o Fastify para garantir baixa latência.
- **Desenvolvimento Moderno:** Totalmente tipada com TypeScript e execução ágil com `tsx`.

## 🚀 Tecnologias

- Node.js
- TypeScript
- Fastify
- AJV
- Hugging Face SDK
- Fast XML Parser
- dotenv
- tsx

## 📦 Instalação

### Clone o projeto

```bash
git clone <seu-repositorio-url>
cd api-noticias
```

### Instale as dependências

```bash
npm install
```

### Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

```env
PORT=3030

API_KEY=sua_api_key

IA_TOKEN_HUGGINFACE=seu_token

IA_TOKEN_TAVILY=seu_token

```

## 🛠️ Executando

Modo desenvolvimento:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Produção:

```bash
npm run start
```

Por padrão a API estará disponível em:

```bash
http://localhost:3030
```

---

## 🔐 Autenticação

Todas as rotas protegidas exigem uma API Key.

Exemplo de requisição:

```http
GET /news
```

Headers:

```http
x-api-key: sua_api_key
```

Exemplo utilizando curl:

```bash
curl http://localhost:3030/news \
-H "x-api-key: sua_api_key"
```

---

## 📚 Endpoints

### Buscar notícias

```http
GET /news
```

### Query Params

| Parâmetro | Tipo   | Obrigatório | Descrição                                |
| --------- | ------ | ----------- | ---------------------------------------- |
| limit     | number | Não         | Quantidade máxima de notícias retornadas |

Exemplo:

```http
GET /news?limit=5
```

Limites suportados:

- mínimo: 1
- máximo: 10
- padrão: 1

---

## 📂 Estrutura do Projeto

```text
src/
├── controllers/
│   └── news.controller.ts
│
├── middleware/
│   └── auth.ts
│
├── routes/
│   └── news.ts
│
├── services/
│   ├── ia/
│   │   └── huggingface/
│   │
│   └── search-feed/
│       └── wired/
│
├── types/
│
└── server.ts
```

### Responsabilidades

| Pasta       | Responsabilidade                |
| ----------- | ------------------------------- |
| controllers | Manipulação das requisições     |
| middleware  | Autenticação e interceptadores  |
| routes      | Definição dos endpoints         |
| services    | Regras de negócio e integrações |
| types       | Tipos compartilhados            |
| server.ts   | Inicialização da aplicação      |

## 🧪 Exemplo de Resposta

```json
[
  {
    "title": "Nova IA anunciada",
    "description": "Resumo da notícia...",
    "url": "https://site.com/noticia"
  }
]
```
