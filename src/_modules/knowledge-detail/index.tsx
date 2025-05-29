"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowDownToLineIcon,
  CircleCheckIcon,
  PlayIcon,
  Plus,
  RefreshCcwIcon,
  Search,
  Trash2Icon,
} from "lucide-react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ModalUploadFile } from "./components/ModalUploadFile";
import { FileInfo } from "@/types/database.type";
import { getVariant } from "@/lib/get-variant";
import { formatGmtDate } from "@/lib/format-date";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  listFile?: FileInfo[];
  total: number;
}
export default function KnowledgeDetailPage({ listFile }: Props) {
  console.log(listFile);
  const [isCreateModalOpen, setIsCreateModalOpen] =
    React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-semibold text-xl">List File Dataset</h2>
        <div className="flex items-center gap-7">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 " />
            <Input
              type="text"
              placeholder="Search dataset..."
              className="input px-3 py-2 pl-10 bg-white dark:bg-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className="text-gray-70 border hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 border-gray-700 dark:hover:bg-gray-700 p-2 py-1.5 "
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-1" />
            Add File
          </Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Chunk Number</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Chunk Method</TableHead>
              <TableHead className="text-center">Parsing Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listFile && listFile.length > 0 ? (
              listFile.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-48 truncate">
                    {item.name}
                  </TableCell>
                  <TableCell>{item.chunk_count}</TableCell>
                  <TableCell>{formatGmtDate(item.create_date)}</TableCell>
                  <TableCell>{item.chunk_method}</TableCell>
                  <TableCell align="center">
                    <div className="flex items-center justify-between">
                      <Badge variant={getVariant(item.run)}>{item.run}</Badge>
                      {item.run === "UNSTART" ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="size-6 flex items-center justify-center cursor-pointer border border-green-500 bg-green-100 rounded-full">
                              <PlayIcon className="size-4 text-green-800" />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm">
                                Are you sure you want to start parsing this file{" "}
                                {item.name} ?
                              </p>
                              <Button
                                variant="default"
                                className="w-full bg-blue-400 text-white hover:bg-blue-500 "
                                onClick={() => {
                                  console.log("Start parsing", item.id);
                                }}
                              >
                                Start Parsing
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : item.run === "DONE" ? (
                        <CircleCheckIcon className="text-green-400" />
                      ) : item.run === "CANCEL" ? (
                        <RefreshCcwIcon className="text-yellow-400" />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-4">
                      <div className="cursor-pointer">
                        <Trash2Icon className="size-4" />
                      </div>
                      <div className="cursor-pointer">
                        <ArrowDownToLineIcon className="size-5" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5}>
                  <div className="flex justify-center items-center h-80 ">
                    No files found. Please add a file to continue.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ModalUploadFile
        open={isCreateModalOpen}
        close={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
