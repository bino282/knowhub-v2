import React from "react";
import { Plus, Trash2, UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ModalInviteTeam from "./ModalInviteTeam";
import { useTheme } from "@/_modules/contexts/ThemeContext";
import { TeamMember } from "@/types/database.type";
import ModalDeleteMember from "./ModalDeleteMember";
import { formatDateTime } from "@/lib/format-date";

enum InviteTeamStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
export default function ListTeamMember({
  listMembers,
  adminId,
}: {
  listMembers: TeamMember[];
  adminId: string | undefined;
}) {
  const { theme } = useTheme();
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [users, setUsers] = React.useState<TeamMember[]>(listMembers);
  const [memberIdDelete, setMemberIdDelete] = React.useState<string | null>(
    null
  );
  const baseCardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const statusColorMap: Record<
    InviteTeamStatus,
    | "success"
    | "info"
    | "error"
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "blue"
    | "process"
    | "pending"
    | "warning"
  > = {
    PENDING: "pending",
    ACCEPTED: "success",
    REJECTED: "destructive",
  };
  // React.useEffect(() => {
  //   if (!adminId) return;
  //   const fetchUsers = async () => {
  //     const response = await getTeamMembers(adminId);
  //     if (response.success) {
  //       setUsers(response.data as unknown as TeamMember[]);
  //     }
  //   };
  //   fetchUsers();
  // }, [adminId]);

  return (
    <>
      <Card className={baseCardClasses}>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <UserIcon size={22} className="text-blue-400" />
              <h2 className="text-xl font-semibold">Team Members</h2>
            </div>
            <Button
              onClick={() => setShowInviteModal(true)}
              className={`flex items-center px-4 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-colors`}
            >
              <Plus size={18} className="mr-2" />
              Invite User
            </Button>
          </div>
          <div
            className={`${baseCardClasses} border rounded-lg overflow-hidden mt-6`}
          >
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead
                className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
              >
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
                  >
                    Updated At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                            {user.member.name.split(" ").join("").slice(0, 1)}
                          </div>
                          <div className="font-medium ml-4">
                            {user.member.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm ">{user.member.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <Badge
                          variant={
                            statusColorMap[
                              user.status as keyof typeof statusColorMap
                            ]
                          }
                          className="lowercase"
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                        {formatDateTime(user.updatedAt)}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                        align="right"
                      >
                        <div
                          className="hover:cursor-pointer hover:text-red-500 w-fit p-2"
                          onClick={() => setMemberIdDelete(user.memberId)}
                        >
                          <Trash2 size={16} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      <p className="text-gray-500 p-6">No team members found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <ModalInviteTeam
        open={showInviteModal}
        close={() => setShowInviteModal(false)}
        adminId={adminId}
        users={users}
        setUsers={setUsers}
      />
      <ModalDeleteMember
        open={!!memberIdDelete}
        close={() => setMemberIdDelete(null)}
        memberId={memberIdDelete}
        adminId={adminId}
        users={users}
        setUsers={setUsers}
      />
    </>
  );
}
