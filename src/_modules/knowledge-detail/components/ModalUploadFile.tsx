"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadIcon } from "lucide-react";
import { createFileDataset } from "@/app/actions/file-dataset";
import { useParams, useRouter } from "next/navigation";
import { set } from "date-fns";

interface Props {
  open: boolean;
  close: () => void;
  fetchList?: () => void; // Optional prop to fetch list after upload
  setIsPolling: React.Dispatch<React.SetStateAction<boolean>>;
}
export function ModalUploadFile({
  open,
  close,
  fetchList,
  setIsPolling,
}: Props) {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | null>(null);
  const ref = React.useRef<HTMLInputElement>(null);
  const handleClose = () => {
    setFile(null);
    close();
  };
  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a file");
      return;
    }
    if (!params.id) {
      toast.error("Dataset ID is missing");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    createFileDataset(params.id as string, formData)
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          handleClose();
          router.refresh();
          if (fetchList) {
            fetchList();
            setIsPolling(true); // Start polling after upload
          }
        } else {
          toast.error(result.message || "Failed to upload file");
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        toast.error("An error occurred while uploading the file");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <div
          onClick={() => ref.current?.click()}
          className="flex flex-col mt-5 items-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <UploadIcon />

          <p className="mt-4">
            Choose a file to upload. Supported formats: PDF, TXT, CSV...
          </p>
        </div>
        <Input
          type="file"
          className="hidden"
          ref={ref}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        {file && (
          <p className="text-sm text-muted-foreground break-all">
            Selected file: <strong>{file.name}</strong>
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            onClick={handleUpload}
            className="bg-blue-600 text-gray-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            disabled={!file || isLoading}
            isLoading={isLoading}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
