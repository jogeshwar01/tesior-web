/*
  Warnings:

  - Added the required column `entity` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Entity" AS ENUM ('User', 'Admin');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_user_id_fkey";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "admin_id" TEXT,
ADD COLUMN     "entity" "Entity" NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
