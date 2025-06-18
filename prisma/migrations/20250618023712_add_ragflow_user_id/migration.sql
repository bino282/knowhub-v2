/*
  Warnings:

  - A unique constraint covering the columns `[ragflow_user_id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "ragflow_user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_ragflow_user_id_key" ON "Users"("ragflow_user_id");
