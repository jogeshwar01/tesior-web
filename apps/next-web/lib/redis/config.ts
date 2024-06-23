export const REDIS_HOST = process.env.REDIS_HOST ?? "localhost";
export const REDIS_PORT = parseInt(process.env.REDIS_PORT ?? "6379");

export const REDIS_CONNECTION_URL =
  process.env.REDIS_CONNECTION_URL ?? `redis://${REDIS_HOST}:${REDIS_PORT}`;
