import { inviteTeam } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TeamMember } from "@/types/database.type";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  close: () => void;
  adminId: string | undefined;
  users: TeamMember[];
  setUsers: (users: TeamMember[]) => void;
}
export default function ModalInviteTeam({
  open,
  close,
  adminId,
  users,
  setUsers,
}: Props) {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const handleInvite = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email");
      return;
    }
    if (!adminId) {
      toast.error("Please login to invite a team member");
      return;
    }
    setIsLoading(true);
    const response = await inviteTeam(email, adminId);
    if (response.success && response.data) {
      toast.success(response.message);
      close();
      setEmail("");
      setIsLoading(false);
      setUsers([...users, response.data as TeamMember]);
    } else {
      toast.error(response.message);
      close();
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <div className="my-4">
          <p className="text-base font-medium mb-2">
            Email <span className="text-red-500 ml-0.5">*</span>
          </p>
          <Input
            placeholder="Enter email"
            className="w-full px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="w-full" onClick={close}>
            Cancel
          </Button>
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            variant={"default"}
            onClick={handleInvite}
            disabled={!email.trim() || isLoading}
            isLoading={isLoading}
          >
            Invite
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
