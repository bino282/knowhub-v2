import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type DeleteChatHistoryModalProps = {
  onConfirm: () => void;
  chatName?: string;
  open?: boolean;
  close: () => void;
};

export function DeleteChatHistoryModal({
  onConfirm,
  open,
  close,
}: DeleteChatHistoryModalProps) {
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete chat?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              close();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
