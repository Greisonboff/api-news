import { tavily } from "@tavily/core";
import { Provider } from "../../../types/news";

export async function tavilyGet(prompt: string, limit: number) {
  try {
    const client = tavily({
      apiKey: process.env.IA_TOKEN_TAVILY,
    });

    const response = await client.search(prompt, {
      includeAnswer: "basic",
      topic: "news",
      searchDepth: "basic",
      maxResults: limit,
      timeRange: "week",
      includeUsage: true,
      includeRawContent: "text",
    });

    return {
      success: true,
      provider: Provider.TAVILY,
      message: "sucesso ao buscar notícias",
      data: response.results,
    };
  } catch (error) {
    console.error("erro ao buscar ia tavily:", error);
    return {
      success: false,
      provider: Provider.TAVILY,
      message: "erro ao buscar notícias",
    };
  }
}
