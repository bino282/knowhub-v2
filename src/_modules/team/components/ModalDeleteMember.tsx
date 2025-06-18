import { deleteTeamMember } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTypeFromLocaleFunction } from "@/types";
import { TeamMember } from "@/types/database.type";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  close: () => void;
  memberId: string | null;
  adminId: string | undefined;
  users: TeamMember[];
  setUsers: (users: TeamMember[]) => void;
  dictionary: DataTypeFromLocaleFunction;
}
export default function ModalDeleteMember({
  open,
  close,
  memberId,
  adminId,
  users,
  setUsers,
  dictionary,
}: Props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    if (!memberId || !adminId) return;
    setIsLoading(true);
    try {
      const response = await deleteTeamMember(adminId, memberId);
      if (response.success) {
        toast.success(response.message);
        close();
        setUsers(users.filter((user) => user.memberId !== memberId));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.team.deleteMember}</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm dark:text-gray-200 text-gray-800">
            {dictionary.team.deleteMemberConfirm}
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="w-full" onClick={close}>
              {dictionary.common.cancel}
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isLoading}
              isLoading={isLoading}
            >
              {dictionary.common.delete}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
