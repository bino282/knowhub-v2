/*
  Warnings:

  - You are about to drop the column `role` on the `Message` table. All the data in the column will be lost.
  - Changed the type of `content` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "role",
ADD COLUMN     "session_id" TEXT,
DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;
