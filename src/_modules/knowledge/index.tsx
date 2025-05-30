"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BotIcon,
  ChevronDownIcon,
  Plus,
  Search,
  Settings2Icon,
} from "lucide-react";
import React from "react";
import ModalCreateDataset from "./components/ModalCreateDataset";
import KnowledgeItem from "./components/KnowledgeItem";
import { motion } from "framer-motion";
import { useBots } from "../contexts/BotsContext";
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

export default function PageKnowledges() {
  const { datasets } = useBots();
  const [category, setCategory] = React.useState<string>("");
  const [timeRange, setTimeRange] = React.useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] =
    React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const filteredBots =
    datasets && datasets.length > 0
      ? datasets.filter((bot) =>
          bot.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
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
    <div>
      <div className="flex items-center justify-between mb-10">
        <div className="w-full">
          <div className="flex items-center justify-between w-full gap-4">
            <h2 className="font-semibold text-xl">Knowledge Bases</h2>
            <div className="flex items-center gap-7">
              <Button
                className="text-gray-70  px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 "
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-5 w-5 mr-1" />
                Create Knowledge Base
              </Button>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 " />
              <Input
                type="text"
                placeholder="Search knowledge bases..."
                className="input px-10 py-2 pl-10 bg-white dark:bg-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  <label className="text-sm font-medium">Category</label>
                  <Select onValueChange={setCategory}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
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
        className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-8"
      >
        {filteredBots.length > 0 ? (
          filteredBots.map((dataset) => (
            <motion.div
              key={dataset.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="card cursor-pointer overflow-hidden"
            >
              <KnowledgeItem key={dataset.id} data={dataset} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BotIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              No datasets found
            </h3>
            {searchQuery ? (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No datasets match your search
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating your first dataset
              </p>
            )}
            <Button
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mt-4"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create dataset
            </Button>
          </div>
        )}
      </motion.div>
      <ModalCreateDataset
        open={isCreateModalOpen}
        close={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
