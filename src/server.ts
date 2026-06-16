import fastify, { FastifyInstance } from "fastify";
import news from "./routes/news";
import "dotenv/config";

const app: FastifyInstance = fastify({
  logger: true,
});

app.get("/", async (request, reply) => {
  return {
    message: "API funcionando!",
  };
});

app.register(news);

const start = async () => {
  try {
    await app.listen({
      port: 3030,
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
