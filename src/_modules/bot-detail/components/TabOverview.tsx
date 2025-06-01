import { useTheme } from "@/_modules/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Info,
  LineChart,
  MessageSquare,
  PieChart,
  UsersIcon,
  Zap,
} from "lucide-react";
import React from "react";

export default function TabOverview() {
  const { theme } = useTheme();
  const metrics = [
    {
      title: "Total Interactions",
      value: "2,456",
      change: "+18%",
      isPositive: true,
      icon: <MessageSquare size={20} />,
      color: "purple",
    },
    {
      title: "Users",
      value: "1,876",
      change: "+5%",
      isPositive: true,
      icon: <UsersIcon size={20} />,
      color: "blue",
    },
    {
      title: "Avg. Response Time",
      value: "1.2s",
      change: "-15%",
      isPositive: true,
      icon: <Zap size={20} />,
      color: "green",
    },
    {
      title: "Accuracy",
      value: "87%",
      change: "+2%",
      isPositive: true,
      icon: <CheckCircle2 size={20} />,
      color: "amber",
    },
  ];
  const conversations = [
    {
      id: 1,
      user: "John Smith",
      question: "How do I reset my password?",
      time: "10 minutes ago",
      resolved: true,
    },
    {
      id: 2,
      user: "Emily Davis",
      question: "What is your refund policy?",
      time: "32 minutes ago",
      resolved: true,
    },
    {
      id: 3,
      user: "Michael Wong",
      question: "I can't access my account after the latest update",
      time: "1 hour ago",
      resolved: false,
    },
    {
      id: 4,
      user: "Sarah Johnson",
      question: "When will my order be shipped?",
      time: "2 hours ago",
      resolved: true,
    },
    {
      id: 5,
      user: "David Kim",
      question: "How do I cancel my subscription?",
      time: "3 hours ago",
      resolved: true,
    },
  ];
  const baseCardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`${baseCardClasses} rounded-lg border p-6`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {metric.title}
                </p>
                <h3 className="text-2xl font-bold mt-2">{metric.value}</h3>

                <div className="flex items-center mt-2">
                  {metric.isPositive ? (
                    <ArrowUpRight size={16} className="text-green-500" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-500" />
                  )}
                  <span
                    className={`text-sm ml-1 ${
                      metric.isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {metric.change}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    vs last month
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-full ${
                  theme === "dark"
                    ? `bg-${metric.color}-500/10`
                    : `bg-${metric.color}-50`
                } text-${metric.color}-600 dark:text-${metric.color}-400`}
              >
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${baseCardClasses} rounded-lg border p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center">
              <LineChart size={18} className="mr-2" />
              Daily Interactions
            </h3>
            <select
              className={`text-sm rounded-md border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              } px-2 py-1`}
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          {/* Placeholder chart */}
          <div className="h-64 flex items-end space-x-2">
            {[35, 58, 42, 65, 32, 47, 53].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-purple-500 dark:bg-purple-600 rounded-t"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className={`${baseCardClasses} rounded-lg border p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center">
              <PieChart size={18} className="mr-2" />
              Query Resolution
            </h3>
          </div>

          {/* Placeholder chart */}
          <div className="flex justify-center items-center h-64">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  r="25"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  stroke="#A855F7"
                  strokeWidth="50"
                  strokeDasharray="117.81 157.08"
                  transform="rotate(-90) translate(-100 0)"
                />
                <circle
                  r="25"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  stroke="#6B7280"
                  strokeWidth="50"
                  strokeDasharray="39.27 157.08"
                  strokeDashoffset="-117.81"
                  transform="rotate(-90) translate(-100 0)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-20 h-20 rounded-full ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } flex items-center justify-center`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">76%</div>
                    <div className="text-xs text-gray-500">Resolved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-purple-500 mr-2"></span>
              <span className="text-sm">Resolved (76%)</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-gray-500 mr-2"></span>
              <span className="text-sm">Unresolved (24%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`${baseCardClasses} rounded-lg border p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold flex items-center">
            <MessageSquare size={18} className="mr-2" />
            Recent Conversations
          </h3>
          <Button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            View all
          </Button>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {conversations.map((conversation) => (
            <div key={conversation.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {conversation.user
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{conversation.user}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {conversation.question}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">
                    {conversation.time}
                  </span>
                  {conversation.resolved ? (
                    <span className="text-xs text-green-500 flex items-center mt-1">
                      <CheckCircle2 size={12} className="mr-1" /> Resolved
                    </span>
                  ) : (
                    <span className="text-xs text-amber-500 flex items-center mt-1">
                      <Info size={12} className="mr-1" /> Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
