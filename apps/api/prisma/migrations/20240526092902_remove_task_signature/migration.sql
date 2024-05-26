/*
  Warnings:

  - You are about to drop the column `signature` on the `Task` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Task_signature_key";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "signature";
