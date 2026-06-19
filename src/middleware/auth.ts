import { FastifyReply, FastifyRequest } from "fastify";

export default async function auth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const apiKey = request.headers["x-api-key"];

  if (apiKey !== process.env.API_KEY_AUTH) {
    return reply.status(401).send({
      message: "Unauthorized",
    });
  }
}
