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
import { Check, ChevronsUpDown, UploadIcon } from "lucide-react";
import { createFileDataset, getTypeFile } from "@/app/actions/file-dataset";
import { useParams, useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FolderFile } from "@/types/database.type";
import { DataTypeFromLocaleFunction } from "@/types";

interface Props {
  open: boolean;
  datasetName?: string;
  close: () => void;
  fetchList?: () => void; // Optional prop to fetch list after upload
  setIsPolling: React.Dispatch<React.SetStateAction<boolean>>;
  setFolders: React.Dispatch<React.SetStateAction<FolderFile[]>>;
  dictionary: DataTypeFromLocaleFunction;
}
type FileType = {
  label: string | null;
  value: string | undefined;
};
export function ModalUploadFile({
  open,
  datasetName,
  close,
  fetchList,
  setIsPolling,
  setFolders,
  dictionary,
}: Props) {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [openPopover, setOpenPopover] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selected, setSelected] = React.useState<string | null>(null);
  const [list, setList] = React.useState<FileType[]>([]);
  const [listFiltered, setListFiltered] = React.useState<FileType[]>([]);

  // get file type
  React.useEffect(() => {
    getTypeFile().then((res) => {
      if (res.success && res.data) {
        const types = res.data.map((item: string | null) => ({
          label: item,
          value: item?.toLowerCase(),
        }));
        setList(types);
        setListFiltered(types);
      } else {
        toast.error(res.message || "Failed to fetch file types");
      }
    });
  }, []);
  React.useEffect(() => {
    if (inputValue) {
      const filtered = list.filter((item) =>
        item.label?.toLowerCase().includes(inputValue.toLowerCase())
      );
      setListFiltered(filtered);
    } else {
      setListFiltered(list);
    }
  }, [inputValue]);

  const handleSelect = (value: string) => {
    setInputValue(value);
    setSelected(value);
    setOpenPopover(false);
  };
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
    createFileDataset(params.id as string, selected, formData, datasetName)
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          handleClose();
          router.refresh();
          if (selected) {
            setFolders((prev) => {
              const index = prev.findIndex(
                (item) => item.name === selected.toLowerCase()
              );
              if (index !== -1) {
                // Đã tồn tại → tăng count
                const updated = [...prev];
                updated[index] = {
                  ...updated[index],
                  count: updated[index].count + 1,
                };
                return updated;
              } else {
                // Chưa có → thêm mới
                return [...prev, { name: selected, count: 1 }];
              }
            });
          }
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
          <DialogTitle>{dictionary.knowledge.uploadFile}</DialogTitle>
        </DialogHeader>
        <div className="mt-5">
          <p className="font-medium text-base mb-1.5 text-gray-700 dark:text-gray-200">
            {dictionary.knowledge.file}{" "}
            <span className="text-red-400 ml-0.5">*</span>
          </p>
          <div
            onClick={() => ref.current?.click()}
            className="flex flex-col items-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <UploadIcon />

            <p className="mt-4">{dictionary.knowledge.chooseFileToUpload}</p>
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
            <p className="text-sm text-muted-foreground break-all mt-2">
              Selected file: <strong>{file.name}</strong>
            </p>
          )}
        </div>

        <div className="mt-4">
          <p className="font-medium text-base mb-1.5 text-gray-800 dark:text-gray-200">
            {dictionary.knowledge.selectOrEnterFileType}
          </p>
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild className="w-full">
              <Button variant="outline" className="w-full justify-between">
                {selected || dictionary.knowledge.enterOrSelect}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-2 space-y-2" align="start">
              <Input
                placeholder={dictionary.knowledge.enterOrSelect}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setSelected(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim() !== "") {
                    handleSelect(inputValue.trim());
                  }
                }}
                className="w-full px-2 py-1.5"
              />
              <div className="w-full overflow-auto">
                {listFiltered.map((item) => (
                  <div
                    key={item.value}
                    onClick={() => handleSelect(item.label || "")}
                    className={cn(
                      "px-2 py-1 rounded-md cursor-pointer hover:bg-accent flex items-center overflow-hidden",
                      selected === item.label && "bg-accent font-semibold"
                    )}
                  >
                    {selected === item.label && (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    <span className="truncate">
                      {capitalize(item.label || "")}
                    </span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button variant="outline" onClick={handleClose} className="w-full">
            {dictionary.common.cancel}
          </Button>
          <Button
            variant={"destructive"}
            onClick={handleUpload}
            className="bg-blue-600 text-gray-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 w-full"
            disabled={!file || isLoading}
            isLoading={isLoading}
          >
            {dictionary.knowledge.upload}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
