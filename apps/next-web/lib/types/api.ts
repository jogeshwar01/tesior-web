import z from "zod";

export const createTaskInput = z.object({
  title: z.string().optional(),
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

export const PaymentType = z.object({
  id: z.string(),
  user_id: z.string(),
  amount: z.number(),
  signature: z.string(),
  status: z.nativeEnum(TxnStatus),
});

//-------------------------------------------
// FRONTEND

export type CreateTaskInput = z.infer<typeof createTaskInput>;

export type TaskInput = z.infer<typeof Task>;

export type BalanceInput = {
  pending_amount: number;
  locked_amount: number;
};

export type PaymentInput = z.infer<typeof PaymentType>;
