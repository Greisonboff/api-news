import { tavily } from "@tavily/core";
import { env } from "../../../config/env";
import { Article, Provider, ProviderResult } from "../../../types/news";
import { sample } from "../../../utils/sample";

// Em inglês: em pt-BR o índice de notícias da Tavily retorna poucos resultados para sortear.
const QUERY = "technology news";
const TIMEOUT_SECONDS = 10;
// Busca mais resultados que o pedido e sorteia `limit` deles para variar a cada consulta.
const POOL_SIZE = 20;

const client = tavily({
  apiKey: env.IA_TOKEN_TAVILY,
});

export async function tavilySearch(limit: number): Promise<ProviderResult> {
  try {
    const response = await client.search(QUERY, {
      topic: "news",
      searchDepth: "basic",
      maxResults: POOL_SIZE,
      timeRange: "week",
      // 0 = não aceitar resultados do cache da Tavily; sempre buscar dados novos.
      maxAgeHours: 0,
      timeout: TIMEOUT_SECONDS,
    });

    const data: Article[] = sample(response.results, limit).map((result) => ({
      title: result.title,
      content: result.content,
      url: result.url,
      image: result.images?.[0]?.url,
      publishedDate: result.publishedDate,
      source: Provider.TAVILY,
    }));

    if (data.length === 0) {
      return {
        success: false,
        provider: Provider.TAVILY,
        message: "nenhuma notícia encontrada",
      };
    }

    return {
      success: true,
      provider: Provider.TAVILY,
      message: "sucesso ao buscar notícias",
      data,
    };
  } catch (error) {
    return {
      success: false,
      provider: Provider.TAVILY,
      message: "erro ao buscar notícias",
      error,
    };
  }
}
