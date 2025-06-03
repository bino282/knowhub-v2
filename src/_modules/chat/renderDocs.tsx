import React from "react";
import IconFileWord from "../components/icons/IconFileWord";
import IconFileXlsx from "../components/icons/IconFileXlsx";
import IconFileTxt from "../components/icons/IconFileTxt";
import IconFilePDF from "../components/icons/IconFilePDF";

export const ReferenceDocuments = (reference?: {
  doc_aggs: {
    doc_name: string;
  }[];
}) => {
  const ref =
    typeof reference === "object" && reference !== null
      ? reference
      : JSON.parse(reference || "{}");

  const docs = ref?.doc_aggs;
  if (!Array.isArray(docs) || docs.length === 0) return null;

  return (
    <div className="flex flex-col border w-full border-gray-200 dark:border-gray-700 mt-2 rounded-lg p-2 text-xs text-gray-800 dark:text-gray-200">
      {docs.map((item, index) => (
        <div
          className={`flex items-center gap-2 ${index !== 0 ? "mt-2" : ""}`}
          key={index}
        >
          {getFileIcon(item.doc_name)}
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
            {item.doc_name}
          </p>
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
