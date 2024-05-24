/*
  Warnings:

  - You are about to drop the `EscrowPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EscrowPayment" DROP CONSTRAINT "EscrowPayment_admin_id_fkey";

-- DropTable
DROP TABLE "EscrowPayment";

-- CreateTable
CREATE TABLE "Escrow" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    "status" "TxnStatus" NOT NULL,

    CONSTRAINT "Escrow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Escrow" ADD CONSTRAINT "Escrow_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
