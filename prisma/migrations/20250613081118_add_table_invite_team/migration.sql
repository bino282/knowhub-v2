-- CreateEnum
CREATE TYPE "InviteTeamStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "InviteTeam" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" "InviteTeamStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InviteTeam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InviteTeam" ADD CONSTRAINT "InviteTeam_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InviteTeam" ADD CONSTRAINT "InviteTeam_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
