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
  Paid = "Paid",
}

export const Task = createTaskInput.extend({
  id: z.string(),
  status: z.nativeEnum(TaskStatus),
  user_id: z.string(),
});

export enum TxnStatus {
  Processing = "Processing",
  Success = "Success",
  Failure = "Failure",
}

export enum EntityType {
  User = "User",
  Admin = "Admin",
}

//-------------------------------------------
// FRONTEND

export type CreateTaskInput = z.infer<typeof createTaskInput>;

export type TaskInput = z.infer<typeof Task>;