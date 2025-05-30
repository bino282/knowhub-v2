/*
  Warnings:

  - A unique constraint covering the columns `[api_key]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "api_key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_api_key_key" ON "Users"("api_key");
