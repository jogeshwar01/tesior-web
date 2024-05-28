import { Queue } from "bullmq";
import { REDIS_CONNECTION } from "../config";

export const userPayoutQueue = new Queue("user-payout-queue", { connection: REDIS_CONNECTION });
export const adminPayoutQueue = new Queue("admin-payout-queue", { connection: REDIS_CONNECTION });
export const adminEscrowQueue = new Queue("admin-escrow-queue", { connection: REDIS_CONNECTION });
