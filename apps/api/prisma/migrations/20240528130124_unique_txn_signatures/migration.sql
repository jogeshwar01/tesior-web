/*
  Warnings:

  - A unique constraint covering the columns `[signature]` on the table `Escrow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[signature]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Escrow_signature_key" ON "Escrow"("signature");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_signature_key" ON "Payment"("signature");
