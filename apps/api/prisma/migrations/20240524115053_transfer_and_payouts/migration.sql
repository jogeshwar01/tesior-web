/*
  Warnings:

  - You are about to drop the column `admin_id` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `task_id` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_task_id_fkey";

-- DropIndex
DROP INDEX "Payment_task_id_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "admin_id",
DROP COLUMN "task_id";

-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_task_id_key" ON "Transfer"("task_id");

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
