import React from "react";
import IconFileWord from "../components/icons/IconFileWord";
import IconFileXlsx from "../components/icons/IconFileXlsx";
import IconFileTxt from "../components/icons/IconFileTxt";
import IconFilePDF from "../components/icons/IconFilePDF";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { Reference } from "@/types/database.type";
import Link from "next/link";
import { useBots } from "../contexts/BotsContext";

type ReferenceDocumentsProps = {
  reference?: Reference;
  datasetId?: string;
};
export const ReferenceDocuments = ({
  reference,
  datasetId,
}: ReferenceDocumentsProps) => {
  const ref =
    typeof reference === "object" && reference !== null
      ? reference
      : JSON.parse(reference || "{}");
  const { datasets } = useBots();
  const docs = ref?.doc_aggs;
  if (!Array.isArray(docs) || docs.length === 0) return null;
  const handleDowloadFile = async (docId: string) => {
    if (!datasetId || !docId || datasets.length === 0) {
      console.error("Dataset ID or Document ID is missing");
      return;
    }
    const createdById = datasets.find(
      (dataset) => dataset.id === datasetId
    )?.createdById;
    const res = await fetch(
      `/api/download/file?dataset_id=${datasetId}&file_id=${docId}&created_by_id=${createdById}`
    );
    if (!res.ok) {
      console.error("Failed to download file");
      return;
    }
    const contentDisposition = res.headers.get("Content-Disposition");
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1].replace(/"/g, "")
      : `file_${docId}`;
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  };
  const extension = ref?.doc_aggs?.[0]?.doc_name
    ?.split(".")
    .pop()
    ?.toLowerCase();
  const urlDoc = "https://chatntq.ntq.ai/document/";
  return (
    <div className="flex flex-col border w-full border-gray-200 dark:border-gray-700 mt-2 rounded-lg p-2 text-xs text-gray-800 dark:text-gray-200">
      {docs.map((item, index) => (
        <div
          className={`flex items-center justify-between gap-2 ${
            index !== 0 ? "mt-2" : ""
          }`}
          key={index}
        >
          <div className="flex items-center gap-2">
            {getFileIcon(item.doc_name)}
            <Link
              href={`${urlDoc}${item.doc_id}?ext=${extension}&prefix=document`}
              target="_blank"
              className="font-semibold text-sm text-blue-500 hover:underline "
            >
              {item.doc_name}
            </Link>
          </div>
          <Button onClick={() => handleDowloadFile(item.doc_id)}>
            <DownloadIcon className="w-4 h-4 dark:text-white text-gray-800 hover:text-gray-500" />
          </Button>
        </div>
      ))}
    </div>
  );
};

function getFileIcon(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "";
  switch (extension) {
    case "doc":
    case "docx":
      return <IconFileWord width={25} height={28} />;
    case "xls":
    case "xlsx":
      return <IconFileXlsx width={25} height={28} />;
    case "txt":
    case "md":
      return <IconFileTxt width={25} height={28} />;
    case "pdf":
      return <IconFilePDF />;
    default:
      return <IconFileWord width={25} height={28} />;
  }
}
