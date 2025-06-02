import { formatGmtDate } from "@/lib/format-date";
import { DatasetInfo } from "@/types/database.type";
import {
  DatabaseIcon,
  EllipsisIcon,
  FileTextIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
interface Props {
  data: DatasetInfo;
}
export default function KnowledgeItem({ data }: Props) {
  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between flex-1">
        <div className="p-4 rounded-md bg-blue-500/10">
          <DatabaseIcon className="size-5 text-blue-500" />
        </div>
        <EllipsisIcon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="mt-4">
        <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-xl ">{data.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 min-h-[1.25rem]">
            {data.description}
          </p>
        </div>
        <div className="pt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <FileTextIcon className="size-4 text-gray-800 dark:text-gray-400" />
            <p className="text-sm text-gray-800 dark:text-gray-400 font-normal">
              {data.document_count} documents
            </p>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="size-4 text-gray-800 dark:text-gray-400" />
            <p className="text-sm text-gray-800 dark:text-gray-400 font-normal">
              1
            </p>
          </div>
          <p className="text-xs text-gray-800 dark:text-gray-400 font-normal">
            Update {formatGmtDate(data.update_date)}
          </p>
        </div>
      </div>
    </div>
  );
}
