import { useTheme } from "@/_modules/contexts/ThemeContext";
import {
  acceptTeam,
  getTeamJoined,
  rejectOrLeaveTeam,
} from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format-date";
import { TeamJoined } from "@/types/database.type";
import { UsersIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
  memberId: string | undefined;
}
export default function ListTeamJoin({ memberId }: Props) {
  const { theme } = useTheme();
  const [teamJoined, setTeamJoined] = React.useState<TeamJoined[]>([]);
  const baseCardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  React.useEffect(() => {
    if (!memberId) return;
    const fetchUsers = async () => {
      const response = await getTeamJoined(memberId);
      if (response.success) {
        setTeamJoined(response.data as TeamJoined[]);
      }
    };
    fetchUsers();
  }, [memberId]);
  const handleAcceptTeam = async (adminId: string, memberId: string) => {
    const response = await acceptTeam(adminId, memberId);
    if (response.success) {
      toast.success(response.message);
      // update status to accepted
      setTeamJoined(
        teamJoined.map((team) =>
          team.adminId === adminId ? { ...team, status: "ACCEPTED" } : team
        )
      );
    } else {
      toast.error("Failed to accept team !");
    }
  };
  const handleRejectOrLeaveTeam = async (adminId: string, memberId: string) => {
    const response = await rejectOrLeaveTeam(adminId, memberId);
    if (response.success) {
      toast.success(response.message);
      // delete team from teamJoined
      setTeamJoined(
        teamJoined.filter(
          (team) => team.adminId !== adminId && team.memberId !== memberId
        )
      );
    } else {
      toast.error("Failed to reject or leave team !");
    }
  };
  return (
    <Card className={baseCardClasses}>
      <CardContent>
        <div className="flex items-center gap-2">
          <UsersIcon size={22} className="text-blue-400" />
          <h2 className="text-xl font-semibold">Joined Team</h2>
        </div>
        <div
          className={`${baseCardClasses} border rounded-lg overflow-hidden mt-6`}
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
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
                  Email Adress
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
              {teamJoined && teamJoined.length > 0 ? (
                teamJoined.map((team) => (
                  <tr
                    key={team.id}
                    className={`hover:${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          {team.admin.name.split(" ").join("").slice(0, 1)}
                        </div>
                        <div className="font-medium ml-4">
                          {team.admin.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm ">{team.admin.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {formatDateTime(team.updatedAt)}
                    </td>
                    <td
                      className=" whitespace-nowrap text-sm font-medium"
                      align="right"
                    >
                      {team.status === "PENDING" ? (
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="default"
                            className="text-blue-500 hover:text-blue-600 font-semibold"
                            onClick={() =>
                              handleAcceptTeam(team.adminId, team.memberId)
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            variant="default"
                            className="text-yellow-400 hover:text-yellow-500 font-semibold"
                            onClick={() =>
                              handleRejectOrLeaveTeam(
                                team.adminId,
                                team.memberId
                              )
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="default"
                          className="text-red-400 hover:text-red-500 font-semibold"
                          onClick={() =>
                            handleRejectOrLeaveTeam(team.adminId, team.memberId)
                          }
                        >
                          Leave
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    <p className="text-gray-500 p-6">No team joined</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
