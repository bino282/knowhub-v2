"use client";
import Loading from "@/_modules/components/loading";
import { useBots } from "@/_modules/contexts/BotsContext";
import { createDataset } from "@/app/actions/datasets";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DataTypeFromLocaleFunction } from "@/types";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function ModalCreateDataset({
  open,
  close,
  dictionary,
}: {
  open: boolean;
  close: () => void;
  dictionary: DataTypeFromLocaleFunction;
}) {
  const router = useRouter();
  const { createDatasetFunction } = useBots();
  const [datasetName, setDatasetName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const handleCreateDataset = async () => {
    if (!datasetName.trim()) {
      toast.error("Dataset name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await createDatasetFunction(datasetName, description);
      if (!res.success) {
        toast.error(res.message || "Failed to create dataset");
        return;
      }
      toast.success(res.message || "Dataset created successfully");
      close();
      setDatasetName("");
      setDescription("");
      router.refresh();
    } catch (error) {
      console.error("Error creating dataset:", error);
      toast.error("Failed to create dataset. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{dictionary.knowledge.createDataset}</DialogTitle>
        </DialogHeader>
        <div className="mt-5">
          <div>
            <Label className="font-medium text-sm" htmlFor="datasetName">
              <span className="text-red-400 mr-1">*</span>
              {dictionary.knowledge.datasetName} :
            </Label>
            <Input
              placeholder={dictionary.knowledge.datasetName}
              className="px-4 py-2.5 flex-1 mt-1.5"
              autoFocus
              type="text"
              name="datasetName"
              id="datasetName"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Label className="font-medium text-sm" htmlFor="description">
              {dictionary.common.description} :
            </Label>
            <Input
              placeholder={dictionary.common.description}
              className="px-4 py-2.5 flex-1 mt-1.5"
              autoFocus
              type="text"
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="w-full items-center mt-5">
          <Button
            variant={"default"}
            onClick={close}
            className="border-gray-300 dark:border-gray-700 border rounded-md px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {dictionary.common.cancel}
          </Button>
          <Button
            variant={"default"}
            className="bg-blue-500 text-sm font-semibold text-white dark:text-gray-200 hover:bg-blue-600 px-4 py-2.5 "
            onClick={handleCreateDataset}
            disabled={loading || !datasetName.trim()}
            isLoading={loading}
          >
            {dictionary.common.saveChanges}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
