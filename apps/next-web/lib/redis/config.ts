export const REDIS_HOST = process.env.REDIS_HOST ?? "localhost";
export const REDIS_PORT = parseInt(process.env.REDIS_PORT ?? "6379");
export const REDIS_CONNECTION = { host: REDIS_HOST, port: REDIS_PORT, };
