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
import { DataTypeFromLocaleFunction } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface DeleteFileModalProps {
  fileId?: string;
  fileName?: string;
  botId?: string;
  onClose: () => void;
  onDelete: () => void;
  dictionary: DataTypeFromLocaleFunction;
}

export function DeleteFileModal({
  fileName,
  onClose,
  onDelete,
  dictionary,
}: DeleteFileModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const handleConfirm = () => {
    if (!fileName) {
      onClose();
      return;
    }
    setIsLoading(true);
    try {
      onDelete();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file. Please try again.");
    } finally {
      setIsLoading(false);
    }
    onClose();
    router.refresh();
  };

  return (
    <Dialog open={!!fileName} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.knowledge.deleteFile}</DialogTitle>
          <DialogDescription>
            {dictionary.common.deleteConfirm}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {dictionary.common.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="text-white"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {dictionary.common.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
