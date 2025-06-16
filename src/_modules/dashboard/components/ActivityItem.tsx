import React, { JSX } from "react";
import { Bot, FileUp, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { Activity } from "@/types/database.type";
import { formatDateTime } from "@/lib/format-date";
import { formatDistanceToNow } from "date-fns";

interface ActivityItemProps {
  activity: Activity;
}
type Action =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "EDITED"
  | "SHARED"
  | "UPLOADED";
const ActivityItem = ({ activity }: ActivityItemProps) => {
  console.log("Activity Item:", activity);
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
      {getIcon(activity.action, activity.targetName)}
      <div className="ml-2">
        <p className="font-normal text-sm text-gray-800 dark:text-[#f9fafb]">
          {capitalizeWords(activity.user.name as string)}
          <span className="text-sm text-[#9cabaf] px-1">
            {activity.action.toLowerCase()}
          </span>
          {capitalizeWords(activity.targetType)}
          <span className="text-sm text-[#9cabaf] px-1">in</span>
          {capitalizeWords(activity.targetName)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Last activity :{" "}
          {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;

function getIcon(action: string, type: string): JSX.Element | null {
  const normalized = action.toUpperCase();

  const actions = normalized.split(/[\s,]+/).filter(Boolean) as Action[];

  const hasCreate = actions.includes("CREATED");
  const hasEdit = actions.includes("EDITED");
  const hasUpload = actions.includes("UPLOADED");

  if ((hasCreate || hasEdit) && type === "CHAT BOT")
    return (
      <div className="p-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
        <Bot className="size-4" />
      </div>
    );
  if (hasCreate)
    return (
      <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full p-2">
        <Plus className="size-4" />
      </div>
    );
  if (actions.includes("UPDATED"))
    return (
      <div className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full p-2">
        <Upload className="size-4" />
      </div>
    );
  if (actions.includes("DELETED"))
    return (
      <div className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full p-2">
        <Trash2 className="size-4" />
      </div>
    );
  if (hasEdit)
    return (
      <div className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full p-2">
        <Pencil className="size-4" />
      </div>
    );
  if (hasUpload)
    return (
      <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full p-2">
        <FileUp className="size-4" />
      </div>
    );

  return null;
}
function capitalizeWords(input: string): string {
  return input
    .toLowerCase()
    .split(/\s+/) // tách theo khoảng trắng
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
