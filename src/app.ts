import fastify, { FastifyServerOptions } from "fastify";
import rateLimit from "@fastify/rate-limit";
import news from "./routes/news";

export async function buildApp(options: FastifyServerOptions = {}) {
  const app = fastify({ logger: true, ...options });

  await app.register(rateLimit, {
    max: 30,
    timeWindow: "1 minute",
  });

  app.get("/health", async () => {
    return {
      message: "API funcionando!",
    };
  });

  await app.register(news);

  return app;
}
