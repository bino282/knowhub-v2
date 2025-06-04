"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface DeleteFileModalProps {
  fileId?: string;
  fileName?: string;
  botId?: string;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteFileModal({
  fileName,
  onClose,
  onDelete,
}: DeleteFileModalProps) {
  const router = useRouter();
  const handleConfirm = () => {
    onDelete();
    onClose();
    router.refresh();
  };

  return (
    <Dialog open={!!fileName} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span>{fileName}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="text-white"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
