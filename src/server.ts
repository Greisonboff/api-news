import "dotenv/config";
import { env } from "./config/env";
import { buildApp } from "./app";

const start = async () => {
  const app = await buildApp();

  const shutdown = async (signal: string) => {
    app.log.info(`${signal} recebido, encerrando servidor`);
    await app.close();
    process.exit(0);
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  try {
    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
