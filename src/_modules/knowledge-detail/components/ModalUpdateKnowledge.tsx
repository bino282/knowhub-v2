import { useBots } from "@/_modules/contexts/BotsContext";
import { updateDataset } from "@/app/actions/datasets";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { DatasetInfo } from "@/types/database.type";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  close: () => void;
  knowledge: DatasetInfo | null;
}
export default function ModalUpdateKnowledge({
  open,
  close,
  knowledge,
}: Props) {
  const router = useRouter();
  const { setDatasets } = useBots();
  const [name, setName] = React.useState(knowledge?.name || "");
  const [description, setDescription] = React.useState(
    knowledge?.description || ""
  );
  const [permission, setPermission] = React.useState<"team" | "me">(
    (knowledge?.permission as "team" | "me") || "me"
  );

  const handleSubmit = async () => {
    if (!knowledge || !knowledge.id) {
      toast.error("Knowledge not found");
      return;
    }
    if (knowledge.createdById) {
      toast.error("You are not allowed to update this knowledge");
      return;
    }
    if (!name) {
      toast.error("Name is required");
      return;
    }
    if (!permission) {
      toast.error("Permission is required");
      return;
    }
    const res = await updateDataset(
      knowledge.id,
      name,
      description,
      permission
    );
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    setDatasets((prev) =>
      prev.map((dataset) =>
        dataset.id === knowledge.id
          ? {
              ...dataset,
              name,
              description,
              permission,
            }
          : dataset
      )
    );
    toast.success(res.message);
    close();
    router.refresh();
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Knowledge</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter knowledge name"
              className="px-3 py-2"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
          <div className="grid gap-2">
            <Label>Permission</Label>
            <RadioGroup
              value={permission}
              onValueChange={(val) => setPermission(val as "team" | "me")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="me" id="me" />
                <Label htmlFor="me">Only me</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="team" id="team" />
                <Label htmlFor="team">Team</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="flex justify-end items-center gap-2">
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
