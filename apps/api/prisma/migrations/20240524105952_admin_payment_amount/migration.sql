/*
  Warnings:

  - Added the required column `locked_amount` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pending_amount` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "locked_amount" INTEGER NOT NULL,
ADD COLUMN     "pending_amount" INTEGER NOT NULL;
