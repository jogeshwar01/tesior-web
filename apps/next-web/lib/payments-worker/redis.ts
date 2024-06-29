import { Redis as UpstashRedis } from "@upstash/redis";

interface AdminMessage {
  data: { adminId: string; amount: number; signature: string };
}

interface UserMessage {
  data: { userId: string };
}

interface GenericMessage {
  data: any;
}

// type mapping approach to link QUEUE_TYPE to message formats
type MessageByQueueType<T extends string> = T extends "user_payment"
  ? UserMessage
  : T extends "admin_escrow"
    ? AdminMessage
    : GenericMessage;

export class Redis {
  private client: UpstashRedis;
  private static instance: Redis;

  constructor() {
    this.client = new UpstashRedis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    });
  }

  public static getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis();
    }
    return this.instance;
  }

  async fetch(QUEUE_TYPE: string): Promise<string> {
    const response = await this.client.lpop(QUEUE_TYPE);
    return response !== null ? JSON.stringify(response) : ""; // check for null as typeof null is object
  }

  async send<T extends string>(QUEUE_TYPE: T, message: MessageByQueueType<T>) {
    await this.client.rpush(QUEUE_TYPE, JSON.stringify(message));
  }
}
