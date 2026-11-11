import type { IncomingMessage, ServerResponse } from "node:http";
import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
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

// Handler serverless (Vercel): reutiliza a instância entre invocações.
let appPromise: Promise<FastifyInstance> | undefined;

async function getApp(): Promise<FastifyInstance> {
  appPromise ??= buildApp()
    .then(async (app) => {
      await app.ready();
      return app;
    })
    .catch((err) => {
      appPromise = undefined;
      throw err;
    });

  return appPromise;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const app = await getApp();
  app.server.emit("request", req, res);
}
