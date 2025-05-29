/*
  Warnings:

  - Added the required column `chat_id` to the `Bot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_set_id` to the `Bot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "chat_id" TEXT NOT NULL,
ADD COLUMN     "data_set_id" TEXT NOT NULL;
