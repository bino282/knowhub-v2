"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
import {
  GridIcon,
  ListIcon,
  FilterIcon,
  UploadIcon,
  UsersIcon,
} from "lucide-react";
import { ModalUploadFile } from "./components/ModalUploadFile";
import { DocumentCard } from "./components/DocumentCard";
import { FileInfo } from "@/types/database.type";

interface Props {
  listFile: FileInfo[];
}
const folders = [
  { name: "Campaigns", count: 0 },
  { name: "Brand Guidelines", count: 0 },
  { name: "Social Media", count: 0 },
  { name: "Presentations", count: 0 },
  { name: "Market Research", count: 0 },
];

const documentTypes = [
  "PDFs",
  "Word Documents",
  "Spreadsheets",
  "Images",
  "Videos",
  "Other",
];

export default function KnowledgeDetailPage({ listFile }: Props) {
  const [isCreateModalOpen, setIsCreateModalOpen] =
    React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredFiles = listFile.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marketing Knowledge Base</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-1 bg-white dark:bg-gray-800 border-gray-500"
          >
            <UsersIcon size={16} /> Manage Access
          </Button>
          <Button
            className="gap-1 bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <UploadIcon size={16} /> Upload
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-400">
        Contains marketing materials, campaign docs, and brand guidelines
      </p>
      <div className=" text-white grid grid-cols-12 gap-4 mt-8">
        <aside className="col-span-3 space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent>
              <h2 className="text-xl font-bold mb-1">Folders</h2>
              <ul className="space-y-1">
                <li className="font-semibold text-blue-400 flex justify-between">
                  All Documents{" "}
                  <span className="text-white">{listFile.length}</span>
                </li>
                {folders.map((folder) => (
                  <li key={folder.name} className="flex justify-between">
                    {folder.name}{" "}
                    <span className="text-gray-400">{folder.count}</span>
                  </li>
                ))}
                <li className="text-blue-400 cursor-pointer text-sm mt-2">
                  + New Folder
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent>
              <h2 className="text-xl font-bold mb-1">Document Types</h2>
              <div className="space-y-2">
                {documentTypes.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox id={type} />
                    <label htmlFor={type}>{type}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="col-span-9 space-y-4">
          {/* Search + Filter */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search documents..."
              className="bg-white dark:bg-gray-800 border-gray-500 px-3.5 py-2.5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="outline"
              className="gap-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-500"
            >
              <FilterIcon size={16} /> Filter
            </Button>
            <Button
              variant="outline"
              className="gap-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-500"
            >
              <GridIcon size={16} />
            </Button>
            <Button
              variant="outline"
              className="gap-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-500"
            >
              <ListIcon size={16} />
            </Button>
          </div>

          {/* Document Cards */}
          <div className="grid grid-cols-3 gap-4">
            {filteredFiles.map((doc) => (
              <DocumentCard
                key={doc.name}
                filename={doc.name}
                size={doc.size}
                timeAgo={doc.create_date}
                uploaderName={doc.created_by}
                uploaderInitials={doc.created_by
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              />
            ))}
          </div>
        </main>
      </div>
      <ModalUploadFile
        open={isCreateModalOpen}
        close={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
