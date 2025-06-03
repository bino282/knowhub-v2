import React from "react";
import { formatDistanceToNow } from "date-fns";
import { User, Bot } from "lucide-react";

interface ActivityItemProps {
  activity: {
    id: string;
    role: string;
    content: string;
    bot_id: string;
    user_id: string;
    created_at: string;
  } & { botName?: string };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  console.log(activity);
  const { role, content, botName } = activity;

  // Truncate content if it's too long
  const truncatedContent =
    content.length > 60 ? `${content.substring(0, 60)}...` : content;

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {role === "user" ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {role === "user" ? "You" : botName || "Bot"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {/* {formatDistanceToNow(timestamp, { addSuffix: true })} */}
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {truncatedContent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
