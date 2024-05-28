import { Worker, QueueEvents} from "bullmq";
import { processUserQueue, processAdminPayoutQueue, processAdminEscrowQueue } from "./process";
import { REDIS_CONNECTION } from "../config";

export const userPayoutWorker = new Worker("user-payout-queue", processUserQueue, { connection: REDIS_CONNECTION });
export const adminPayoutWorker = new Worker("admin-payout-queue", processAdminPayoutQueue, { connection: REDIS_CONNECTION });
export const adminEscrowWorker = new Worker("admin-escrow-queue", processAdminEscrowQueue, { connection: REDIS_CONNECTION });

// Queue event to monitor the status of the queue
const queueEvents = new QueueEvents("admin-escrow-queue", { connection: REDIS_CONNECTION });

queueEvents.on("completed", ({ jobId }) => {
  console.log("Completed escrow",jobId);
});

queueEvents.on("failed",
  ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
    console.error("Error in escrow",jobId, failedReason);
  }
);

queueEvents.on("waiting", ({ jobId }) => {
  console.log("Waiting escrow", jobId);
});