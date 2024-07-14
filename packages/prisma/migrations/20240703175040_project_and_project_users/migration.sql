/*
  Warnings:

  - Added the required column `project_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('owner', 'member');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "project_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUsers" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "ProjectUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "ProjectUsers_project_id_idx" ON "ProjectUsers"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectUsers_user_id_project_id_key" ON "ProjectUsers"("user_id", "project_id");

-- AddForeignKey
ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
