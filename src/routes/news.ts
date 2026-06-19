import { FastifyInstance } from "fastify";

import getNews from "../controllers/news.controller";

export default async function news(fastify: FastifyInstance) {
  fastify.get(
    "/news",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            limit: { type: "number", minimum: 1, maximum: 10, default: 1 },
          },
        },
      },
    },
    getNews,
  );
}
