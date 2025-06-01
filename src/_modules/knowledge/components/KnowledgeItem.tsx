import { formatGmtDate } from "@/lib/format-date";
import { DatasetInfo } from "@/types/database.type";
import {
  AlignJustifyIcon,
  CalendarIcon,
  DatabaseIcon,
  EllipsisIcon,
  FileTextIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
interface Props {
  data: DatasetInfo;
}
export default function KnowledgeItem({ data }: Props) {
  return (
    <Link href={`/knowledge/${data.id}`}>
      <div className="p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="p-4 rounded-md bg-blue-500/10">
            <DatabaseIcon className="size-5 text-blue-500" />
          </div>
          <EllipsisIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="mt-4">
          <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-xl ">{data.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {data.description || ""}
            </p>
          </div>
          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FileTextIcon className="size-4" />
              <p className="text-sm text-gray-800 dark:text-gray-400 font-normal">
                {data.document_count} Docs
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <CalendarIcon className="size-4" />
              <p className="text-sm text-gray-800 dark:text-gray-400 font-normal">
                {formatGmtDate(data.create_date)}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <AlignJustifyIcon className="size-4" />
              <p className="text-sm text-gray-800 dark:text-gray-400 font-normal">
                {data.chunk_count} document chunks
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <UsersIcon className="size-4" />
              <p className="text-sm text-gray-800 dark:text-gray-400 font-normal">
                1
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
