import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, FileText, MessageSquare } from "lucide-react";
import { DataTypeFromLocaleFunction } from "@/types";

interface BotSummary {
  id: string;
  name: string;
  documentsCount: number;
  messagesCount: number;
  totalMessages?: number;
  lastActivity: Date;
}

interface BotListItemProps {
  bot: BotSummary;
  onClick: () => void;
  dictionary: DataTypeFromLocaleFunction;
}
const colorMap = [
  "bg-red-100 text-red-600",
  "bg-orange-100 text-orange-600",
  "bg-amber-100 text-amber-600",
  "bg-yellow-100 text-yellow-600",
  "bg-lime-100 text-lime-600",
  "bg-green-100 text-green-600",
  "bg-emerald-100 text-emerald-600",
  "bg-teal-100 text-teal-600",
  "bg-cyan-100 text-cyan-600",
  "bg-sky-100 text-sky-600",
  "bg-blue-100 text-blue-600",
  "bg-indigo-100 text-indigo-600",
  "bg-violet-100 text-violet-600",
  "bg-purple-100 text-purple-600",
  "bg-fuchsia-100 text-fuchsia-600",
  "bg-pink-100 text-pink-600",
  "bg-rose-100 text-rose-600",
];

const BotListItem: React.FC<BotListItemProps> = ({
  bot,
  onClick,
  dictionary,
}) => {
  const initial = bot.name.charAt(0).toUpperCase();
  const index = initial.charCodeAt(0) % colorMap.length;
  const colorClass = colorMap[index];
  return (
    <div
      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
            >
              <span className="font-semibold">
                {bot.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">{bot.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {dictionary.common.create} :{" "}
              {formatDistanceToNow(bot.lastActivity, { addSuffix: true })}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mr-4">
            <FileText className="h-3.5 w-3.5" />
            <span>{bot.documentsCount}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mr-4">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{bot.totalMessages || 0}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default BotListItem;
