"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { CustomSlider } from "@/_modules/components/custom-slider";
import { FileInfo } from "@/types/database.type";
import { Button } from "@/components/ui/button";
import {
  getAllFileDatasets,
  updateFileDataset,
} from "@/app/actions/file-dataset";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SettingFIleModal({
  open,
  close,
  file,
  setFile,
  createdById,
}: {
  open: boolean;
  close: () => void;
  file: FileInfo;
  setFile: React.Dispatch<React.SetStateAction<FileInfo[]>>;
  createdById: string | undefined;
}) {
  const chunkingMethods = [
    { value: "naive", label: "General" },
    { value: "manual", label: "Manual" },
    { value: "qa", label: "Q&A" },
    { value: "table", label: "Table" },
    { value: "paper", label: "Paper" },
    { value: "book", label: "Book" },
    { value: "laws", label: "Laws" },
    { value: "presentation", label: "Presentation" },
    { value: "picture", label: "Picture" },
    { value: "one", label: "One" },
    { value: "email", label: "Email" },
  ];
  const router = useRouter();
  const [chunkSize, setChunkSize] = React.useState<number>(128);
  const [chunkMethod, setChunkMethod] = React.useState<string>(
    file.chunk_method ?? "naive"
  );
  const [delimiter, setDelimiter] = React.useState<string>(
    file.parser_config?.delimiter ?? "\n"
  );
  const handleSettingFile = async () => {
    const data = {
      chunk_method: chunkMethod,
      parser_config: {
        chunk_token_count: chunkSize,
        delimiter: delimiter,
      },
    };
    const res = await updateFileDataset(file.dataset_id, file.id, data);
    if (res.success) {
      close();
      const resFile = await getAllFileDatasets({
        datasetId: file.dataset_id,
        createdById: createdById,
      });
      if (resFile.success && resFile.data?.count > 0) {
        setFile(resFile.data?.docs as FileInfo[]);
      }
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chunking method</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="chunking-method">Chunking method :</Label>
            <Select
              value={chunkMethod}
              onValueChange={(val) => setChunkMethod(val)}
            >
              <SelectTrigger className="w-full mt-1.5">
                <SelectValue placeholder="General" />
              </SelectTrigger>
              <SelectContent>
                {chunkingMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="chunk-size">
              Recommended chunk size (in characters) :
            </Label>
            <div className="mt-3 flex items-center gap-4">
              <CustomSlider
                value={[chunkSize]}
                onChange={(value) => setChunkSize(value[0])}
                min={100}
                max={2048}
                step={1}
                className="w-full flex-1"
              />
              <div className="flex items-center gap-3 border rounded px-2 w-fit  dark:bg-gray-800 bg-gray-100">
                <div className="text-sm text-gray-800 dark:text-white  text-center">
                  {chunkSize}
                </div>
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setChunkSize((prev) => prev + 1)}
                    className="text-sm text-gray-800 dark:text-white hover:text-black p-0"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setChunkSize((prev) => Math.max(1, prev - 1))
                    }
                    className="text-smtext-gray-800 dark:text-white hover:text-black p-0"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="delimiter">
              <span className="text-red-500">*</span> Delimiter for text :
            </Label>
            <Input
              id="delimiter"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              placeholder="Enter delimiter (e.g., newline, comma)"
              className="px-3 py-2"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" type="button" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="default"
            type="button"
            onClick={handleSettingFile}
            className="bg-blue-500 text-white ml-2 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
