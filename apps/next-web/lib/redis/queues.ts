import { Queue } from "bullmq";
import { REDIS_CONNECTION } from "./config";
import { Worker, QueueEvents } from "bullmq";
import { processUserPaymentQueue, processAdminEscrowQueue } from "./process";

export const userPayoutQueue = new Queue("user-payout-queue", {
  connection: REDIS_CONNECTION,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

export const adminEscrowQueue = new Queue("admin-escrow-queue", {
  connection: REDIS_CONNECTION,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

export const userPayoutWorker = new Worker(
  "user-payout-queue",
  processUserPaymentQueue,
  { connection: REDIS_CONNECTION }
);
export const adminEscrowWorker = new Worker(
  "admin-escrow-queue",
  processAdminEscrowQueue,
  { connection: REDIS_CONNECTION }
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
