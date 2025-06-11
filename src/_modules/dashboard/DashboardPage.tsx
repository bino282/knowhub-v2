"use client";

import React from "react";
import { Bot, FileText, MessageSquare, Plus, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import StatsCard from "./components/StatsCard";
import { useBots } from "../contexts/BotsContext";
import ModalCreateBot from "../components/ModalCreateBot";
import BotListItem from "./components/BotListItem";
import ActivityItem from "./components/ActivityItem";
import { Activity } from "@/types/database.type";

interface Props {
  listMessage: {
    id: string;
    createdAt: Date;
    role: string;
    content: string;
    sessionChatId: string;
    reference: any;
  }[];
  listActivity?: Activity[];
}
const DashboardPage = ({ listMessage, listActivity }: Props) => {
  const listMessageUser =
    listMessage.length > 0
      ? listMessage.filter((msg) => msg.role === "user")
      : [];
  const session = useSession();
  const router = useRouter();
  const [opneModalCreateBot, setOpenModalCreateBot] =
    React.useState<boolean>(false);
  const {
    bots,
    createBot,
    selectBot,
    getTotalDocuments,
    getBotSummaries,
    getRecentActivity,
  } = useBots();

  const botSummaries = getBotSummaries();
  const totalDocuments = getTotalDocuments();
  const recentActivity = getRecentActivity();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleBotClick = (botId: string) => {
    selectBot(botId);
    router.push(`/bots/${botId}`);
  };

  return (
    <div className="h-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {session.data?.user.name || "User"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Total Bots"
            value={bots.length || 0}
            icon={
              <div className="p-3 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400">
                <Bot className="h-5 w-5 " />
              </div>
            }
            color="primary"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Total Documents"
            value={totalDocuments}
            icon={
              <div className="p-3 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <FileText className="h-5 w-5" />
              </div>
            }
            color="accent"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Total Messages"
            value={listMessageUser.length}
            icon={
              <div className="p-3 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <MessageSquare className="h-5 w-5 " />
              </div>
            }
            color="highlight"
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="card flex flex-col max-h-[500px] overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold">Your Bots</h2>
                <Button
                  className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                  onClick={() => setOpenModalCreateBot(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Bot
                </Button>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 flex-1 overflow-auto">
                {botSummaries.length > 0 ? (
                  botSummaries.map((bot) => (
                    <BotListItem
                      key={bot.id}
                      bot={bot}
                      onClick={() => handleBotClick(bot.id)}
                    />
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No bots created yet
                    </p>
                    <Button
                      className="text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 p-2 mt-4"
                      onClick={() => setOpenModalCreateBot(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create your first bot
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {botSummaries.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  className="text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                  variant={"default"}
                  onClick={() => router.push("/bots")}
                >
                  View all bots
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="card h-full max-h-[500px] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 flex-1 overflow-auto">
              {listActivity && listActivity.length > 0 ? (
                listActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <ModalCreateBot
        open={opneModalCreateBot}
        setOpen={() => setOpenModalCreateBot(false)}
        onCreate={createBot}
      />
    </div>
  );
};

export default DashboardPage;
