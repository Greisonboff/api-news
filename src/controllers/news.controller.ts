import { FastifyRequest, FastifyReply } from "fastify";
import { tavilySearch } from "../services/ia";
import { wired } from "../services/search-feed/wired";
import { News, ProviderResult } from "../types/news";

type NewsQuery = {
  limit: number;
};

const providers: Array<(limit: number) => Promise<ProviderResult>> = [
  tavilySearch,
  wired,
];

export default async function getNews(
  request: FastifyRequest<{
    Querystring: NewsQuery;
  }>,
  reply: FastifyReply,
): Promise<News> {
  const { limit } = request.query;

  try {
    for (const provider of providers) {
      const result = await provider(limit);

      if (result.success && result.data?.length) {
        return {
          success: true,
          provider: result.provider,
          message: "sucesso ao buscar notícias",
          data: result.data,
        };
      }

      request.log.warn(
        { provider: result.provider, err: result.error },
        result.message,
      );
    }

    reply.code(502);
    return {
      success: false,
      provider: null,
      message: "erro ao buscar notícias",
      data: null,
    };
  } catch (error) {
    request.log.error({ err: error }, "erro ao buscar notícias");

    reply.code(500);
    return {
      success: false,
      provider: null,
      message: "internal server error",
      data: null,
    };
  }
}
