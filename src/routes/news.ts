import { FastifyInstance } from "fastify";

import getNews from "../controllers/news.controller";
import auth from "../middleware/auth";

const articleSchema = {
  type: "object",
  required: ["title", "content"],
  properties: {
    title: { type: "string" },
    content: { type: "string" },
    url: { type: "string" },
    image: { type: "string" },
    publishedDate: { type: "string" },
    source: { type: "string" },
  },
} as const;

const newsResponseSchema = {
  type: "object",
  required: ["success", "provider", "message", "data"],
  properties: {
    success: { type: "boolean" },
    provider: { type: ["string", "null"] },
    message: { type: "string" },
    data: { type: ["array", "null"], items: articleSchema },
  },
} as const;

export default async function news(fastify: FastifyInstance) {
  fastify.addHook("onRequest", auth);

  fastify.get(
    "/news",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            limit: { type: "integer", minimum: 1, maximum: 10, default: 1 },
          },
        },
        response: {
          200: newsResponseSchema,
          500: newsResponseSchema,
          502: newsResponseSchema,
        },
      },
    },
    getNews,
  );
}
