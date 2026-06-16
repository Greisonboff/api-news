# 📰 API Notícias

Uma API moderna e minimalista construída com **Fastify** e **TypeScript** para agregação de notícias e processamento inteligente de dados utilizando IA.

## ✨ Funcionalidades

- **Busca de Notícias (RSS):** Integração nativa com feeds RSS (ex: Wired) para captura de manchetes em tempo real.
- **Inteligência Artificial:** Processamento de tópicos e análise de conteúdo via Hugging Face (Llama 3).
- **Alta Performance:** Estruturada sobre o Fastify para garantir baixa latência.
- **Desenvolvimento Moderno:** Totalmente tipada com TypeScript e execução ágil com `tsx`.

## 🚀 Tecnologias

- Node.js & TypeScript
- Fastify - Framework web focado em performance.
- Hugging Face SDK - Integração com LLMs.
- Fast-XML-Parser - Processamento eficiente de feeds RSS.

## 📦 Instalação

1. Clone o repositório:

   ```bash
   git clone <seu-repositorio-url>
   cd api-noticias
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   IA_TOKEN_HUGGINFACE=seu_token_aqui
   ```

## 🛠️ Como usar

Para iniciar o servidor em modo de desenvolvimento com hot-reload:

```bash
npm run dev
```

O servidor estará disponível, por padrão, em `http://localhost:3000`.

## 📂 Estrutura de Pastas (Resumo)

- `src/services/search-feed`: Implementação dos providers de notícias (RSS).
- `src/services/ia`: Integração com provedores de Inteligência Artificial.
- `src/types`: Definições de tipos globais.
- `src/server.ts`: Ponto de entrada da aplicação Fastify.
