import z from "zod";

export const createTaskInput = z.object({
  title: z.string().optional(),
  signature: z.string(),
  contact: z.string(),
  proof: z.string(),
  amount: z.number(),
});

export enum TaskStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export enum TxnStatus {
  Processing = "Processing",
  Success = "Success",
  Failure = "Failure",
}

export enum EntityType {
  User = "User",
  Admin = "Admin",
}
