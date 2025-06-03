/*
  Warnings:

  - You are about to drop the column `bot_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `session_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Message` table. All the data in the column will be lost.
  - Added the required column `session_chat_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_bot_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_user_id_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "bot_id",
DROP COLUMN "session_id",
DROP COLUMN "user_id",
ADD COLUMN     "session_chat_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SessionChat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "bot_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionChat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SessionChat" ADD CONSTRAINT "SessionChat_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_session_chat_id_fkey" FOREIGN KEY ("session_chat_id") REFERENCES "SessionChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
