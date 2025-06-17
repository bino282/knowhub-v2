"use server";

import { prisma } from "@/lib/prisma";

export async function inviteTeam(email: string, adminId: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return { success: false, message: "User is not registered !" };
  }
  const check = await prisma.inviteTeam.findUnique({
    where: {
      adminId_memberId: {
        adminId,
        memberId: user.id,
      },
    },
  });
  if (check) {
    return { success: false, message: "This user has been invited !" };
  }
  await prisma.inviteTeam.create({
    data: {
      adminId,
      memberId: user.id,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  const data = await prisma.inviteTeam.findUnique({
    where: {
      adminId_memberId: {
        adminId,
        memberId: user.id,
      },
    },
    include: {
      member: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return { success: true, message: "Invite sent successfully !", data };
}

export async function getTeamMembers(adminId: string) {
  const teamMembers = await prisma.inviteTeam.findMany({
    where: {
      adminId,
    },
    include: {
      member: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return { success: true, data: teamMembers };
}
export async function deleteTeamMember(adminId: string, memberId: string) {
  await prisma.inviteTeam.delete({
    where: {
      adminId_memberId: {
        adminId,
        memberId,
      },
    },
  });
  return { success: true, message: "Team member deleted successfully !" };
}
export async function getTeamJoined(memberId: string) {
  const teamJoined = await prisma.inviteTeam.findMany({
    where: {
      memberId,
    },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return { success: true, data: teamJoined };
}
export async function acceptTeam(adminId: string, memberId: string) {
  await prisma.inviteTeam.update({
    where: {
      adminId_memberId: {
        adminId,
        memberId,
      },
    },
    data: {
      status: "ACCEPTED",
    },
  });
  return { success: true, message: "Team accepted successfully !" };
}
export async function rejectOrLeaveTeam(adminId: string, memberId: string) {
  await prisma.inviteTeam.delete({
    where: {
      adminId_memberId: {
        adminId,
        memberId,
      },
    },
  });
  return { success: true, message: "Team rejected or left successfully !" };
}
