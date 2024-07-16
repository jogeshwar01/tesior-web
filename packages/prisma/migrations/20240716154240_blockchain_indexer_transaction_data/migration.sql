-- CreateTable
CREATE TABLE "Indexer" (
    "id" TEXT NOT NULL,
    "transaction" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Indexer_pkey" PRIMARY KEY ("id")
);
