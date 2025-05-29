import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, FileText, MessageSquare } from "lucide-react";

interface BotSummary {
  id: string;
  name: string;
  documentsCount: number;
  messagesCount: number;
  lastActivity: Date;
}

interface BotListItemProps {
  bot: BotSummary;
  onClick: () => void;
}

const BotListItem: React.FC<BotListItemProps> = ({ bot, onClick }) => {
  return (
    <div
      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                {bot.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">{bot.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last activity :{" "}
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
            <span>{bot.messagesCount}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default BotListItem;
