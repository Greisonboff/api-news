import { tavily } from "@tavily/core";
import { Provider } from "../../../types/news";

export async function tavilyGet(prompt: string) {
  try {
    const client = tavily({
      apiKey: process.env.IA_TOKEN_TAVILY,
    });

    throw new Error("error");
    const response = await client.search(prompt, {
      includeAnswer: "basic",
      topic: "news",
      searchDepth: "basic",
      maxResults: 1,
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
