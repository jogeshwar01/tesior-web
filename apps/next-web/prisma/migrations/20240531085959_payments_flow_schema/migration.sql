-- CreateEnum
CREATE TYPE "TxnStatus" AS ENUM ('Processing', 'Success', 'Failure');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Paid');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locked_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pending_amount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT DEFAULT 'Github PR',
    "contact" TEXT NOT NULL,
    "proof" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'Pending',
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "amount" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    "status" "TxnStatus" NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Escrow" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    "status" "TxnStatus" NOT NULL,

    CONSTRAINT "Escrow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Approval_task_id_key" ON "Approval"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_task_id_key" ON "Transfer"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_signature_key" ON "Payment"("signature");

-- CreateIndex
CREATE UNIQUE INDEX "Escrow_signature_key" ON "Escrow"("signature");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Escrow" ADD CONSTRAINT "Escrow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
