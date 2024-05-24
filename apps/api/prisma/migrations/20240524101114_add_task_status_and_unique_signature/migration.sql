/*
  Warnings:

  - A unique constraint covering the columns `[signature]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'Pending';

-- CreateIndex
CREATE UNIQUE INDEX "Task_signature_key" ON "Task"("signature");
