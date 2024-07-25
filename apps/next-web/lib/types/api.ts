import z from "zod";

export const createTaskInput = z.object({
  username: z.string(),
  title: z.string(),
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

export const Task = createTaskInput
  .omit({
    username: true,
  })
  .extend({
    id: z.string(),
    status: z.nativeEnum(TaskStatus),
    user_id: z.string(),
    user: z.object({
      name: z.string(),
    }),
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

export const Payment = z.object({
  id: z.string(),
  user_id: z.string(),
  amount: z.number(),
  signature: z.string(),
  status: z.nativeEnum(TxnStatus),
});

export const Escrow = Payment;

export const Transfer = z.object({
  id: z.string(),
  sender_id: z.string(),
  receiver_id: z.string(),
  amount: z.number(),
  sender: z.object({
    name: z.string(),
  }),
  receiver: z.object({
    name: z.string(),
  }),
});

export const SimplifiedIssueData = z.object({
  issue: z.object({
    url: z.string(),
    user: z.object({
      login: z.string(),
    }),
    comment: z.object({
      body: z.string(),
      user: z.object({
        login: z.string(),
      }),
    }),
    repository: z.object({
      url: z.string(),
      name: z.string(),
      owner: z.object({
        login: z.string(),
      }),
    }),
  }),
});

//-------------------------------------------
// FRONTEND

export type CreateTaskInput = z.infer<typeof createTaskInput>;

export type TaskInput = z.infer<typeof Task>;

export type BalanceInput = {
  pending_amount: number;
  locked_amount: number;
};

export type PaymentInput = z.infer<typeof Payment>;

export type TransferInput = z.infer<typeof Transfer>;
