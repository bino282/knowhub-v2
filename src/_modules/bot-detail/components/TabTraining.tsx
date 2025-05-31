import { useBots } from "@/_modules/contexts/BotsContext";
import { useTheme } from "@/_modules/contexts/ThemeContext";
import {
  getAllFileDatasets,
  parseFileDocument,
} from "@/app/actions/file-dataset";
import { Badge } from "@/components/ui/badge";
import { formatGmtDate } from "@/lib/format-date";
import { getVariant } from "@/lib/get-variant";
import { FileInfo } from "@/types/database.type";
import {
  Database,
  Download,
  FileText,
  MoreVertical,
  Play,
  PlayIcon,
  RefreshCw,
  RefreshCwIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function TabTraining() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { bots } = useBots();
  const [page, setPage] = React.useState("1");
  const [fileList, setFileList] = React.useState<FileInfo[]>([]);
  const datasetId = bots.find((bot) => bot.id === params.id)?.dataSetId;
  React.useEffect(() => {
    getAllFileDatasets({
      datasetId: datasetId as string,
      page: Number(page),
    })
      .then((respon) => {
        if (respon.success && respon.data.total > 0) {
          setFileList(respon.data.docs as FileInfo[]);
        }
      })
      .catch((error) => {
        console.error("Error fetching datasets:", error);
      });
  }, [page]);

  const baseCardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const handleParseFile = async (fileId: string) => {
    if (fileId === "all") {
      const ids = fileList.map((file) => file.id);
      const res = await parseFileDocument(params.id as string, ids);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.refresh();
      return;
    }
    const fileIds = [fileId];
    const res = await parseFileDocument(params.id as string, fileIds);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    router.refresh();
  };
  return (
    <div className="space-y-6">
      <div className={`${baseCardClasses} rounded-lg border p-6`}>
        <h3 className="font-semibold mb-4">Knowledge Base Training</h3>

        <div className="flex items-start space-x-3 mb-6">
          <div
            className={`p-3 rounded-md ${
              theme === "dark" ? "bg-blue-500/10" : "bg-blue-50"
            }`}
          >
            <Database size={20} className="text-blue-500" />
          </div>

          <div>
            <h4 className="font-medium">Customer Support</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              203 documents • Last updated 3 hours ago
            </p>

            <Link
              href={`/knowledge-bases/5`}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2 inline-block"
            >
              View Knowledge Base
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Document Selection
            </label>
            <select
              className={`w-full rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              } border px-3 py-2`}
            >
              <option>All documents</option>
              <option>Only documents with specific tags</option>
              <option>Selected documents</option>
            </select>
          </div>

          {/* File List Table */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Document List</h4>
              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded-md ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } text-gray-500 transition-colors`}
                >
                  <Download size={16} />
                </button>
                <button
                  className={`p-2 rounded-md ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } text-gray-500 transition-colors`}
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Chunk Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Chunk Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Parsing Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {fileList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        No files found.
                      </td>
                    </tr>
                  ) : (
                    fileList.map((file, index) => (
                      <tr
                        key={index}
                        className={`${
                          theme === "dark"
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center max-w-80 overflow-hidden">
                            <FileText
                              size={16}
                              className="mr-2 text-gray-500"
                            />
                            <span className="text-sm flex-1 truncate">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {file.chunk_count}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {formatGmtDate(file.update_date)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {file.chunk_method}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-between">
                            <Badge variant={getVariant(file.run)}>
                              {file.run}
                            </Badge>
                            {file.run === "UNSTART" ? (
                              <div
                                className="p-2 rounded-full bg-green-700/20 cursor-pointer"
                                onClick={() => handleParseFile(file.id)}
                              >
                                <PlayIcon className="size-4 text-green-500" />
                              </div>
                            ) : (
                              <div className="p-2 rounded-full bg-yellow-700/20">
                                <RefreshCwIcon className="size-4 text-yellow-500" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              className={`flex items-center px-4 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white transition-colors`}
              onClick={() => handleParseFile("all")}
            >
              <Play size={16} className="mr-2" />
              Start Training
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Estimated time: 5-10 minutes
            </p>
          </div>
        </div>
      </div>

      <div className={`${baseCardClasses} rounded-lg border p-6`}>
        <h3 className="font-semibold mb-4">Training History</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">May 15, 2025</td>
                <td className="px-4 py-3 whitespace-nowrap">Standard</td>
                <td className="px-4 py-3 whitespace-nowrap">203</td>
                <td className="px-4 py-3 whitespace-nowrap">8m 42s</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">May 8, 2025</td>
                <td className="px-4 py-3 whitespace-nowrap">Deep</td>
                <td className="px-4 py-3 whitespace-nowrap">198</td>
                <td className="px-4 py-3 whitespace-nowrap">15m 23s</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">May 1, 2025</td>
                <td className="px-4 py-3 whitespace-nowrap">Quick</td>
                <td className="px-4 py-3 whitespace-nowrap">195</td>
                <td className="px-4 py-3 whitespace-nowrap">3m 12s</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">Apr 24, 2025</td>
                <td className="px-4 py-3 whitespace-nowrap">Standard</td>
                <td className="px-4 py-3 whitespace-nowrap">187</td>
                <td className="px-4 py-3 whitespace-nowrap">7m 55s</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
