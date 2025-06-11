import { deleteDataset } from "@/app/actions/datasets";
import { Button } from "@/components/ui/button";
import { formatGmtDate } from "@/lib/format-date";
import { DatasetInfo } from "@/types/database.type";
import {
  DatabaseIcon,
  FileTextIcon,
  MoreVertical,
  Trash2,
  UsersIcon,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { DeleteKnowledgeModal } from "./ModalDeleteKnowleadge";
import { useBots } from "@/_modules/contexts/BotsContext";

interface Props {
  data: DatasetInfo;
}
export default function KnowledgeItem({ data }: Props) {
  const { setDatasets } = useBots();
  const [datasetDelete, setDatasetDelete] = React.useState<DatasetInfo | null>(
    null
  );
  const handleDelete = async () => {
    if (!datasetDelete) return;
    const res = await deleteDataset(datasetDelete.id, datasetDelete.name);
    if (!res.success) {
      console.error("Failed to delete dataset:", res.message);
      toast.error(res.message);
      return;
    }
    setDatasets((prev) => prev.filter((item) => item.id !== datasetDelete.id));
    toast.success(res.message);
    setDatasetDelete(null);
  };

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between flex-1">
        <div className="p-4 rounded-md bg-blue-500/10">
          <DatabaseIcon className="size-5 text-blue-500" />
        </div>
        <div className="relative group">
          <Button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </Button>
          <div className="absolute right-0 z-10 pt-2 w-48 origin-top-right hidden group-hover:block">
            <div
              className="mt-1 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-500 focus:outline-none "
              role="none"
            >
              <Button
                className="flex w-full justify-baseline rounded-md px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setDatasetDelete(data);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="pb-6 border-b border-gray-200 dark:border-gray-700 ">
          <h2 className="font-semibold text-xl truncate">{data.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 break-all flex-1 truncate-2-lines">
            {data.description}
          </p>
        </div>
        <div className="pt-4 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileTextIcon className="size-4 text-gray-800 dark:text-gray-400" />
              <p className="text-sm text-gray-800 dark:text-gray-400 font-normal ">
                {data.document_count} documents
              </p>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-gray-800 dark:text-gray-400" />
              <p className="text-sm text-gray-800 dark:text-gray-400 font-normal">
                1
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-800 dark:text-gray-400 font-normal mt-4">
            Update {formatGmtDate(data.update_date)}
          </p>
        </div>
      </div>
      {datasetDelete && (
        <DeleteKnowledgeModal
          open={!!datasetDelete.id}
          close={() => setDatasetDelete(null)}
          knowledgeId={datasetDelete.id || ""}
          onDeleteKnowLeadge={handleDelete}
        />
      )}
    </div>
  );
}
