-- AlterTable
ALTER TABLE "Indexer" ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "GithubBot" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GithubBot_pkey" PRIMARY KEY ("id")
);
