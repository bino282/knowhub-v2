/*
  Warnings:

  - You are about to drop the column `family_name` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `given_name` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "family_name",
DROP COLUMN "given_name",
DROP COLUMN "is_active",
DROP COLUMN "picture";
