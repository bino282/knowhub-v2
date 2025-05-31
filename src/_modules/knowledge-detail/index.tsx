"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ListIcon,
  File as FilePdf,
  UsersIcon,
  ArrowLeft,
  Upload,
  Folder,
  FilePlus,
  Search,
  Filter,
  Grid,
  FileImage,
  FileSpreadsheet,
  FileVideo,
  FileText,
  Star,
  Download,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
} from "lucide-react";
import { ModalUploadFile } from "./components/ModalUploadFile";
import { DocumentCard } from "./components/DocumentCard";
import { FileInfo } from "@/types/database.type";
import Link from "next/link";
import { useBots } from "../contexts/BotsContext";
import { useTheme } from "../contexts/ThemeContext";
import { formatDate } from "date-fns";

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
  const { selectedDataset } = useBots();
  const { theme } = useTheme();
  const baseCardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const [isCreateModalOpen, setIsCreateModalOpen] =
    React.useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredFiles = listFile.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
        <Link
          href="/knowledge-bases"
          className="hover:text-blue-600 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" /> Knowledge Bases
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">
          {selectedDataset?.name}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{selectedDataset?.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {selectedDataset?.description}
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            className={`flex items-center px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            } transition-colors`}
          >
            <UsersIcon size={16} className="mr-2" />
            Manage Access
          </button>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className={`flex items-center px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white transition-colors`}
          >
            <Upload size={16} className="mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className={`${baseCardClasses} rounded-lg border p-4`}>
            <h3 className="font-medium mb-3">Folders</h3>

            <ul className="space-y-1">
              <li>
                <Button
                  onClick={() => setSelectedFolder(null)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    selectedFolder === null
                      ? theme === "dark"
                        ? "bg-gray-700"
                        : "bg-gray-100"
                      : theme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                  } transition-colors`}
                >
                  <Folder
                    size={16}
                    className={`mr-2 ${
                      selectedFolder === null ? "text-blue-500" : "text-white"
                    }`}
                  />
                  <span
                    className={`text-gray-500 dark:text-gray-100 text-sm ${
                      selectedFolder === null ? "font-medium" : ""
                    }`}
                  >
                    All Documents
                  </span>
                  <span className="ml-auto text-gray-500 dark:text-gray-400">
                    {listFile.length}
                  </span>
                </Button>
              </li>

              {folders.map((folder, index) => (
                <li key={index}>
                  <button
                    onClick={() => setSelectedFolder(folder.name)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                      selectedFolder === folder.name
                        ? theme === "dark"
                          ? "bg-gray-700"
                          : "bg-gray-100"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    } transition-colors`}
                  >
                    <Folder
                      size={16}
                      className={`mr-2 ${
                        selectedFolder === folder.name ? "text-blue-500" : ""
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        selectedFolder === folder.name ? "font-medium" : ""
                      }`}
                    >
                      {folder.name}
                    </span>
                    <span className="ml-auto text-gray-500 dark:text-gray-400">
                      {folder.count}
                    </span>
                  </button>
                </li>
              ))}

              <li className="pt-2">
                <button className="w-full text-left px-3 py-2 rounded-md flex items-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <FilePlus size={16} className="mr-2" />
                  <span>New Folder</span>
                </button>
              </li>
            </ul>
          </div>

          <div className={`${baseCardClasses} rounded-lg border p-4 mt-4`}>
            <h3 className="font-medium mb-3">Document Types</h3>

            <ul className="space-y-1">
              <li>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2">PDFs</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2">Word Documents</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2">Spreadsheets</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2">Images</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2">Videos</span>
                </label>
              </li>
              <li>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2">Other</span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="relative flex-grow">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search documents..."
                className={`w-full pl-10 pr-4 py-2 rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className="flex space-x-3">
              <Button
                className={`flex items-center px-3 py-2 rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800"
                } transition-colors`}
              >
                <Filter size={16} className="mr-2" />
                Filter
              </Button>

              <div
                className={`flex rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-100 border border-gray-300"
                }`}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-l-md ${
                    viewMode === "grid"
                      ? theme === "dark"
                        ? "bg-gray-600"
                        : "bg-gray-300"
                      : ""
                  } transition-colors`}
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-r-md ${
                    viewMode === "list"
                      ? theme === "dark"
                        ? "bg-gray-600"
                        : "bg-gray-300"
                      : ""
                  } transition-colors`}
                  aria-label="List view"
                >
                  <ListIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((document) => (
                <div
                  key={document.id}
                  className={`${baseCardClasses} border rounded-lg p-4 hover:shadow-md transition-shadow group overflow-hidden`}
                >
                  <div className="flex justify-between items-start">
                    <div
                      className={`p-3 rounded-md ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      {getFileIcon(document.location)}
                    </div>

                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className={`p-1 rounded-full hover:${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } text-amber-500 opacity-100`}
                      >
                        <Star size={16} />
                      </button>
                      <button
                        className={`p-1 rounded-full hover:${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } text-gray-400`}
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className={`p-1 rounded-full hover:${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } text-gray-400`}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-medium mt-3 line-clamp-1">
                    {document.name}
                  </h4>

                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                    <span> {`${(document.size / 1024).toFixed(2)} MB`}</span>
                    <span>
                      {formatDate(document.update_date, "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center w-full overflow-hidden">
                    <div className="flex items-center  flex-1">
                      <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                        {document.created_by
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>
                      <span className="ml-2 text-xs truncate flex-1">
                        {document.created_by}
                      </span>
                    </div>
                    <button
                      className={`p-1 rounded hover:${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      } text-gray-500`}
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`${baseCardClasses} border rounded-lg overflow-hidden`}
            >
              <table className="w-full">
                <thead
                  className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
                >
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((document, idx) => (
                    <tr
                      key={document.id}
                      className={`${
                        idx !== filteredFiles.length - 1
                          ? theme === "dark"
                            ? "border-b border-gray-700"
                            : "border-b border-gray-200"
                          : ""
                      } hover:${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getFileIcon(document.type)}
                          <span className="ml-3 font-medium">
                            {document.name}
                          </span>
                          <Star size={16} className="ml-2 text-amber-500" />
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-gray-600 dark:text-gray-400">
                        {`${(document.size / 1024).toFixed(2)} MB`}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-gray-600 dark:text-gray-400">
                        {document.created_by}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {formatDate(document.update_date, "EEEE, MMMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex space-x-2 justify-end">
                          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <Download size={16} />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <Edit size={16} />
                          </button>
                          <button className="text-gray-500 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isCreateModalOpen && (
        <ModalUploadFile
          open={isCreateModalOpen}
          close={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}
const getFileIcon = (filename: string) => {
  const imageTypes = ["jpg", "jpeg", "png", "gif", "webp"];
  const parts = filename.split(".");
  const type = parts.length > 1 ? parts.pop()!.toLowerCase() : "";

  if (imageTypes.includes(type)) {
    return <FileImage size={20} className="text-purple-500" />;
  }

  switch (type) {
    case "pdf":
      return <FilePdf size={20} className="text-red-500" />;
    case "xlsx":
      return <FileSpreadsheet size={20} className="text-green-500" />;
    case "doc":
    case "docx":
      return <FileVideo size={20} className="text-blue-500" />;
    default:
      return <FileText size={20} className="text-blue-500" />;
  }
};
