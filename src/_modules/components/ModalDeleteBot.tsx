import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteChatBot } from "@/app/actions/bots";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useBots } from "../contexts/BotsContext";
import React from "react";

type DeleteBotModalProps = {
  open: boolean;
  close: () => void;
  botName: string;
  botId?: string;
};

export function DeleteBotModal({
  open,
  close,
  botName,
  botId,
}: DeleteBotModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { setBots } = useBots();
  const onDelete = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!botId) {
      toast.error("Bot ID is required for deletion");
      return;
    }
    setIsLoading(true);
    try {
      const res = await deleteChatBot(botId);
      if (!res.success) {
        toast.error(res.message);
      }
      setBots((prevBots) => prevBots.filter((bot) => bot.id !== botId));
      toast.success(res.message);
      router.refresh();
      router.push("/bots");
      close();
    } catch (error) {
      console.error("Error deleting bot:", error);
      toast.error("Failed to delete bot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2  dark:text-white text-gray-800">
            Delete Chatbot
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span>{botName}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={(e) => onDelete(e)}
            className="text-white"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
