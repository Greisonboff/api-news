# 📰 API Notícias

API minimalista construída com **Fastify** e **TypeScript** que agrega notícias de tecnologia a partir de múltiplas fontes, com fallback automático entre elas.

## ✨ Funcionalidades

- **Busca de notícias com fallback:** tenta a [Tavily](https://tavily.com) (busca de notícias da semana) e, se falhar, usa o feed RSS da Wired.
- **Notícias variadas:** cada consulta busca dados ao vivo (sem cache) e sorteia `limit` notícias de um conjunto maior, então consultas repetidas trazem notícias diferentes. O conteúdo das notícias é em inglês.
- **Formato único de resposta:** todas as fontes retornam a mesma lista de artigos.
- **Autenticação:** rota `/news` protegida por API Key (header `x-api-key`).
- **Rate limit:** 30 requisições por minuto por IP.
- **Validação:** query params e respostas validados por JSON Schema do Fastify.

## 🚀 Tecnologias

- Node.js + TypeScript
- Fastify + @fastify/rate-limit
- @tavily/core
- fast-xml-parser
- dotenv
- tsx (desenvolvimento) e Vitest (testes)

## 📦 Instalação

```bash
git clone <seu-repositorio-url>
cd api-noticias
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Obrigatórias
API_KEY_AUTH=sua_api_key
IA_TOKEN_TAVILY=seu_token_tavily

# Opcional (padrão: 3030)
PORT=3030
```

A aplicação não inicia se `API_KEY_AUTH` ou `IA_TOKEN_TAVILY` estiverem ausentes.

## 🛠️ Scripts

| Comando             | Descrição                                   |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Desenvolvimento com hot reload              |
| `npm run build`     | Compila para `dist/`                        |
| `npm start`         | Executa a versão compilada                  |
| `npm run typecheck` | Checagem de tipos                           |
| `npm test`          | Testes (Vitest, sem chamadas externas)      |

Por padrão a API fica disponível em `http://localhost:3030`.

## 📚 Endpoints

### `GET /health`

Pública. Retorna `200` com `{ "message": "API funcionando!" }`.

### `GET /news`

Requer o header `x-api-key`.

| Parâmetro | Tipo    | Obrigatório | Descrição                                  |
| --------- | ------- | ----------- | ------------------------------------------ |
| limit     | inteiro | Não         | Quantidade de notícias (1 a 10, padrão: 1) |

```bash
curl "http://localhost:3030/news?limit=3" -H "x-api-key: sua_api_key"
```

### Respostas

| Status | Quando                                         |
| ------ | ---------------------------------------------- |
| 200    | Notícias encontradas                           |
| 400    | `limit` inválido                               |
| 401    | API Key ausente ou inválida                    |
| 429    | Limite de requisições excedido                 |
| 502    | Nenhuma fonte de notícias respondeu            |
| 500    | Erro interno                                   |

Exemplo de sucesso:

```json
{
  "success": true,
  "provider": "tavily",
  "message": "sucesso ao buscar notícias",
  "data": [
    {
      "title": "Título da notícia",
      "content": "Resumo da notícia...",
      "url": "https://site.com/noticia",
      "image": "https://site.com/imagem.jpg",
      "publishedDate": "Mon, 09 Nov 2026 22:40:10 +0000",
      "source": "tavily"
    }
  ]
}
```

`url`, `image` e `publishedDate` são opcionais. `provider` indica qual fonte respondeu (`tavily` ou `wired`).

Exemplo de falha (`502`):

```json
{
  "success": false,
  "provider": null,
  "message": "erro ao buscar notícias",
  "data": null
}
```

## 📂 Estrutura do Projeto

```text
src/
├── app.ts                  # Cria a instância Fastify (plugins e rotas)
├── server.ts               # Carrega o .env e inicia o servidor
├── config/env.ts           # Leitura e validação das variáveis de ambiente
├── controllers/            # Cadeia de fallback entre fontes
├── middleware/auth.ts      # Validação da API Key
├── routes/news.ts          # Rota /news e schemas
├── services/
│   ├── ia/providers/tavily.ts
│   └── search-feed/wired/
└── types/news.ts           # Tipos compartilhados
test/                       # Testes Vitest
```
