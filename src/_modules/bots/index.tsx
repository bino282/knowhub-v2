"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Bot as BotIcon,
  Trash2,
  Edit,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useBots } from "../contexts/BotsContext";
import ModalCreateBot from "../components/ModalCreateBot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BotsPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const { bots, selectBot, createBot } = useBots();
  const filteredBots = bots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBotClick = (botId: string) => {
    selectBot(botId);
    router.push(`/bots/${botId}`);
  };

  const handleDeleteBot = (e: React.MouseEvent, botId: string) => {
    e.stopPropagation();
    if (
      confirm(
        "Are you sure you want to delete this bot? This action cannot be undone."
      )
    ) {
    }
  };

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

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Bots</h1>
        <Button
          className="text-gray-70 border hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 border-gray-700 dark:hover:bg-gray-700 p-2 py-1.5 "
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-5 w-5 mr-1" />
          Create Bot
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search bots..."
            className="input px-3 py-2 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredBots.length > 0 ? (
          filteredBots.map((bot) => (
            <motion.div
              key={bot.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="card cursor-pointer overflow-hidden"
              onClick={() => handleBotClick(bot.id)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                        <BotIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{bot.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {/* {bot.documents.length} documents · {bot.messages.length} messages */}
                        2 documents · 4 messages
                      </p>
                    </div>
                  </div>
                  <div className="relative group">
                    <Button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </Button>
                    <div className="absolute right-0 z-10 pt-2 w-48 origin-top-right hidden group-hover:block">
                      <div
                        className="mt-1 py-2 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none "
                        role="none"
                      >
                        <Button
                          className="flex w-full justify-baseline rounded-none px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBotClick(bot.id);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          className="flex w-full justify-baseline rounded-none  px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => handleDeleteBot(e, bot.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {bot.description}
                </p>
              </div>
              <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-primary-600 dark:text-primary-400">
                  Click to manage
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BotIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              No bots found
            </h3>
            {searchQuery ? (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No bots match your search criteria
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating your first bot
              </p>
            )}
            <Button
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mt-4"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Bot
            </Button>
          </div>
        )}
      </motion.div>

      <ModalCreateBot
        open={isCreateModalOpen}
        setOpen={() => setIsCreateModalOpen(false)}
        onCreate={createBot}
      />
    </div>
  );
};

export default BotsPage;
