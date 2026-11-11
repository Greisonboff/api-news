import { timingSafeEqual } from "node:crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/env";

const expectedKey = Buffer.from(env.API_KEY_AUTH);

function isValidKey(key: string): boolean {
  const received = Buffer.from(key);

  return (
    received.length === expectedKey.length &&
    timingSafeEqual(received, expectedKey)
  );
}

export default async function auth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const apiKey = request.headers["x-api-key"];

  if (typeof apiKey !== "string" || !isValidKey(apiKey)) {
    return reply.status(401).send({
      message: "Unauthorized",
    });
  }
}
