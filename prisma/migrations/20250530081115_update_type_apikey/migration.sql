/*
  Warnings:

  - Made the column `api_key` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "api_key" SET NOT NULL;
