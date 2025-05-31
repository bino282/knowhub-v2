"use client";

import { Button } from "@/components/ui/button";
import {
  BotIcon,
  ChevronDown,
  Grid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import React from "react";
import ModalCreateDataset from "./components/ModalCreateDataset";
import KnowledgeItem from "./components/KnowledgeItem";
import { motion } from "framer-motion";
import { useBots } from "../contexts/BotsContext";

import { useRouter } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import Link from "next/link";
import { formatDate } from "date-fns";
import { Input } from "@/components/ui/input";

export default function PageKnowledges() {
  const { theme } = useTheme();
  const { datasets, selectBot, selectKnowledge } = useBots();
  const router = useRouter();
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [category, setCategory] = React.useState<string>("");
  const [timeRange, setTimeRange] = React.useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] =
    React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const filterDataset =
    datasets && datasets.length > 0
      ? datasets.filter((bot) =>
          bot.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
  const handleClick = (id: string) => {
    selectKnowledge(id);
    router.push(`/knowledge/${id}`);
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
  const baseCardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Knowledge Bases</h2>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className={`flex items-center px-4 py-2 rounded-md ${
            theme === "dark"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white transition-colors`}
        >
          <Plus size={18} className="mr-2" />
          Create New Knowledge Base
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
        <div className="relative flex-grow max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge bases..."
            className={`w-full pl-10 pr-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center px-3 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-colors`}
            >
              <SlidersHorizontal size={16} className="mr-2" />
              Filters
              <ChevronDown size={16} className="ml-2" />
            </button>

            {filterOpen && (
              <div
                className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg z-10 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border`}
              >
                <div className="p-4">
                  <h4 className="font-medium mb-3">Filter by</h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Category
                      </label>
                      <select
                        className={`w-full rounded-md ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        } border px-3 py-1.5`}
                      >
                        <option value="">All Categories</option>
                        <option value="marketing">Marketing</option>
                        <option value="engineering">Engineering</option>
                        <option value="hr">Human Resources</option>
                        <option value="sales">Sales</option>
                        <option value="support">Support</option>
                        <option value="finance">Finance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Last updated
                      </label>
                      <select
                        className={`w-full rounded-md ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        } border px-3 py-1.5`}
                      >
                        <option value="">Any time</option>
                        <option value="today">Today</option>
                        <option value="week">This week</option>
                        <option value="month">This month</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 pt-3 border-t">
                    <button className="text-sm text-gray-600 dark:text-gray-400">
                      Reset
                    </button>
                    <button className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={`flex rounded-md ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-l-md ${
                viewMode === "grid"
                  ? theme === "dark"
                    ? "bg-gray-600"
                    : "bg-gray-300"
                  : ""
              } transition-colors`}
              aria-label="Grid view"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-r-md ${
                viewMode === "list"
                  ? theme === "dark"
                    ? "bg-gray-600"
                    : "bg-gray-300"
                  : ""
              } transition-colors`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        {viewMode === "grid" ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-8"
          >
            {filterDataset.length > 0 ? (
              filterDataset.map((dataset) => (
                <motion.div
                  key={dataset.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="card cursor-pointer overflow-hidden"
                >
                  <div key={dataset.id} onClick={() => handleClick(dataset.id)}>
                    <KnowledgeItem data={dataset} />
                  </div>
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
        ) : (
          <div
            className={`${baseCardClasses} border rounded-lg overflow-hidden`}
          >
            <table className="w-full">
              <thead
                className={
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50 border-b"
                }
              >
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {filterDataset.map((kb, idx) => (
                  <tr
                    key={kb.id}
                    className={`${
                      idx !== filterDataset.length - 1
                        ? theme === "dark"
                          ? "border-b border-gray-700"
                          : "border-b border-gray-200"
                        : ""
                    } hover:${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 ">
                      <Link
                        href={`/knowledge-bases/${kb.id}`}
                        className="font-medium hover:text-blue-600"
                      >
                        {kb.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-600 dark:text-gray-400">
                      {kb.language}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-gray-600 dark:text-gray-400">
                      {kb.document_count}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-600 dark:text-gray-400">
                      {kb.created_by}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {formatDate(kb.create_time, "EEEE, MMMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ModalCreateDataset
        open={isCreateModalOpen}
        close={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
