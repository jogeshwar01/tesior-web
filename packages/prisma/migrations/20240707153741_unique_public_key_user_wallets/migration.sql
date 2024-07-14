/*
  Warnings:

  - A unique constraint covering the columns `[publicKey]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Wallet_user_id_publicKey_key";

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_publicKey_key" ON "Wallet"("publicKey");
