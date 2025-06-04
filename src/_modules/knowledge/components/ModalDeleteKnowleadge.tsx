import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type DeleteBotModalProps = {
  open: boolean;
  close: () => void;
  knowledgeId: string;
  onDeleteKnowLeadge: () => Promise<void>;
};

export function DeleteKnowledgeModal({
  open,
  close,
  onDeleteKnowLeadge,
}: DeleteBotModalProps) {
  const router = useRouter();
  const onDelete = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    await onDeleteKnowLeadge();
    router.refresh();
    close();
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2  dark:text-white text-gray-800">
            Delete Knowledge
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete? This action cannot be undone.
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
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
