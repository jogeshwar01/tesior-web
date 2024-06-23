import {
  Queue,
  QueueOptions,
  WorkerOptions,
  Worker,
  QueueEvents,
} from "bullmq";
import { Redis } from "ioredis";
import { REDIS_CONNECTION_URL } from "./config";
import { processUserPaymentQueue, processAdminEscrowQueue } from "./process";

const REDIS_CONNECTION = new Redis(REDIS_CONNECTION_URL, {
  maxRetriesPerRequest: null,
  tls: {},
  connectTimeout: 10000,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

const queueOptions: QueueOptions = {
  connection: REDIS_CONNECTION,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 50000,
    },
  },
};

const workerOptions: WorkerOptions = {
  connection: REDIS_CONNECTION,
  stalledInterval: 30000,
};

export const userPayoutQueue = new Queue("user-payout-queue", queueOptions);
export const adminEscrowQueue = new Queue("admin-escrow-queue", queueOptions);

export const userPayoutWorker = new Worker(
  "user-payout-queue",
  processUserPaymentQueue,
  workerOptions
);
export const adminEscrowWorker = new Worker(
  "admin-escrow-queue",
  processAdminEscrowQueue,
  workerOptions
);

// Queue event to monitor the status of the queue
const escrowQueueEvents = new QueueEvents("admin-escrow-queue", {
  connection: REDIS_CONNECTION,
});

escrowQueueEvents.on("waiting", ({ jobId }) => {
  console.log("Waiting escrow", jobId);
});

escrowQueueEvents.on("completed", ({ jobId }) => {
  console.log("Completed escrow", jobId);
});

escrowQueueEvents.on(
  "failed",
  ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
    console.error("Error in escrow", jobId, failedReason);
  }
);

const payoutQueueEvents = new QueueEvents("user-payout-queue", {
  connection: REDIS_CONNECTION,
});

payoutQueueEvents.on("waiting", ({ jobId }) => {
  console.log("Waiting payout", jobId);
});

payoutQueueEvents.on("completed", ({ jobId }) => {
  console.log("Completed payout", jobId);
});

payoutQueueEvents.on(
  "failed",
  ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
    console.error("Error in payout", jobId, failedReason);
  }
);
