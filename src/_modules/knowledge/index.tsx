"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BotIcon, Plus, Search } from "lucide-react";
import React from "react";
import ModalCreateDataset from "./components/ModalCreateDataset";
import KnowledgeItem from "./components/KnowledgeItem";
import { motion } from "framer-motion";
import { useBots } from "../contexts/BotsContext";

export default function PageKnowledges() {
  const { datasets } = useBots();
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
        <h2 className="font-semibold text-xl">List Dataset</h2>
        <div className="flex items-center gap-7">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 " />
            <Input
              type="text"
              placeholder="Search dataset..."
              className="input px-3 py-2 pl-10 bg-white dark:bg-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className="text-gray-70 border hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 border-gray-700 dark:hover:bg-gray-700 p-2 py-1.5 "
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-1" />
            Create Dataset
          </Button>
        </div>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8"
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
