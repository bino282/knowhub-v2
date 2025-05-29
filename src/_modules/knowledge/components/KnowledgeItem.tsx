import { formatGmtDate } from "@/lib/format-date";
import { DatasetInfo } from "@/types/database.type";
import { format, parse } from "date-fns";
import {
  AlignJustifyIcon,
  CalendarIcon,
  EllipsisIcon,
  FileTextIcon,
  GlobeIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
interface Props {
  data: DatasetInfo;
}
export default function KnowledgeItem({ data }: Props) {
  return (
    <Link href={`/knowledge/${data.id}`}>
      <div className="p-4 border border-gray-200 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">{data.name}</h2>
          <EllipsisIcon className="h-5 w-5" />
        </div>
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <FileTextIcon className="size-5" />
            <p className="text-base font-normal">{data.document_count} Docs</p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <CalendarIcon className="size-5" />
            <p className="text-base font-normal">
              {formatGmtDate(data.create_date)}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <AlignJustifyIcon className="size-5" />
            <p className="text-base font-normal">
              {data.chunk_count} document chunks
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <GlobeIcon className="size-5" />
            <p className="text-base font-normal">{data.language}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
