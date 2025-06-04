"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Bot as BotIcon,
  Trash2,
  Edit,
  MoreVertical,
  Settings2Icon,
  ChevronDownIcon,
  DatabaseIcon,
  CalendarIcon,
  UserIcon,
  UsersIcon,
  AlignJustifyIcon,
  FileIcon,
  FileTextIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useBots } from "../contexts/BotsContext";
import ModalCreateBot from "../components/ModalCreateBot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format-date";
import { useTheme } from "../contexts/ThemeContext";
import { Database } from "@/types/database.type";
import { DeleteBotModal } from "../components/ModalDeleteBot";

type Bot = {};
const BotsPage: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [category, setCategory] = React.useState<string>("");
  const [timeRange, setTimeRange] = React.useState<string>("");
  const [botDelete, setBotDelete] = useState<
    Database["public"]["Tables"]["bots"]["Row"] | null
  >(null);
  const { bots, selectBot, createBot, datasets } = useBots();
  const filteredBots = bots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log("Filtered Bots:", filteredBots);
  const handleBotClick = (botId: string) => {
    selectBot(botId);
    router.push(`/bots/${botId}`);
  };

  const handleCreateBot = () => {
    if (datasets.length === 0) {
      toast.error(
        "You need to create a dataset and add file before creating a bot."
      );
      return;
    }
    setIsCreateModalOpen(true);
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
      <div className="flex items-center justify-between mb-10">
        <div className="w-full">
          <div className="flex items-center justify-between w-full gap-4">
            <h2 className="font-semibold text-xl">Chatbots</h2>
            <div className="flex items-center gap-7">
              <Button
                className="text-gray-70  px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 "
                onClick={handleCreateBot}
              >
                <Plus className="h-5 w-5 mr-1" />
                Create New Chatbot
              </Button>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 " />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search chatbots..."
                className="w-full pl-10 pr-4 py-2 rounded-md dark:bg-gray-700 bg-white border-gray-100 dark:border-gray-600 border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="px-6 py-2 bg-white dark:bg-gray-800"
                >
                  <Settings2Icon className="h-5 w-5 mr-2" />
                  Filters
                  <ChevronDownIcon className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 space-y-4 mt-2 mr-6">
                <div className="w-full">
                  <label className="text-sm font-medium">Status</label>
                  <Select onValueChange={setCategory}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="tech">Training</SelectItem>
                      <SelectItem value="finance">Active</SelectItem>
                      <SelectItem value="health">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full">
                  <label className="text-sm font-medium">Updated Time</label>
                  <Select onValueChange={setTimeRange}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
          </div>
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
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-md bg-purple-500/10">
                    <BotIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    {bot.isActive === true ? (
                      <Badge variant={"success"}>
                        <CheckCircle2 size={12} />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant={"warning"}>
                        <CheckCircle2 size={12} />
                        Deactive
                      </Badge>
                    )}
                    <div className="relative group">
                      <Button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </Button>
                      <div className="absolute right-0 z-10 pt-2 w-48 origin-top-right hidden group-hover:block">
                        <div
                          className="mt-1 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-500 focus:outline-none "
                          role="none"
                        >
                          <Button
                            className="flex w-full justify-baseline rounded-md px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBotClick(bot.id);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            className="flex w-full justify-baseline rounded-md px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBotDelete(bot);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" mt-6">
                  <h3 className="text-lg font-semibold">{bot.name}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {bot.description}
                  </p>
                  {bot.dataset && bot.dataset !== null && (
                    <div className="mt-3 flex items-center gap-2 text-gray-800 dark:text-gray-400">
                      <DatabaseIcon className="size-4" />
                      <p className="text-sm">Linked to: {bot.dataset.name}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-5 pt-5 border-t border-gray-300 dark:border-gray-600 grid grid-cols-2 gap-x-4">
                <div className="text-start flex flex-col gap-1">
                  <p className="flex items-center">
                    <MessageSquareIcon className="size-4 text-gray-800 dark:text-gray-400 " />
                    <span className="ml-1 text-base text-gray-800 dark:text-gray-400 flex-1">
                      Interactions
                    </span>
                  </p>
                  <p className="text-base font-normal flex-1 text-gray-800 dark:text-gray-200">
                    0
                  </p>
                </div>
                <div className="ftext-start flex flex-col gap-1">
                  <p className="flex items-center">
                    <UsersIcon className="size-4 text-gray-800 dark:text-gray-400" />
                    <span className="ml-1 text-base text-gray-800 dark:text-gray-400">
                      Users
                    </span>
                  </p>
                  <p className="text-base font-normal flex-1 text-gray-800 dark:text-gray-200">
                    1
                  </p>
                </div>
              </div>
              <div className="mt-4 px-5 pb-5 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Updated {formatDateTime(bot.updatedAt)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    router.push(`/bots/${bot.id}/test`);
                  }}
                  className={`flex items-center px-3 py-1.5 rounded-md ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  } transition-colors text-sm`}
                >
                  <HelpCircle size={14} className="mr-1.5" />
                  Chat
                </button>
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
              onClick={handleCreateBot}
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
      <DeleteBotModal
        open={!!botDelete}
        close={() => {
          setBotDelete(null);
          router.refresh();
        }}
        botName={botDelete?.name || ""}
        botId={botDelete?.id}
      />
    </div>
  );
};

export default BotsPage;
