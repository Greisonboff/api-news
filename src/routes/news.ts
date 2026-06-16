import { FastifyInstance } from "fastify";

import getNews from "../controllers/news.controller";

export default async function news(fastify: FastifyInstance) {
  fastify.get("/news", getNews);
}
