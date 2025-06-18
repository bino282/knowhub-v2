/*
  Warnings:

  - A unique constraint covering the columns `[adminId,memberId]` on the table `InviteTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InviteTeam_adminId_memberId_key" ON "InviteTeam"("adminId", "memberId");
