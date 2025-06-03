"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabOverview from "./components/TabOverview";
import TabSetting from "./components/TabSetting";
import { Database } from "@/types/database.type";
import TabTraining from "./components/TabTraining";
import { CheckCircle2, HelpCircle, PanelLeft, Share2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useRouter } from "next/navigation";
import React from "react";
import ModalEmbeded from "./components/ModalEmbeded";

interface Props {
  bot: Database["public"]["Tables"]["bots"]["Row"];
}
export default function PageBotDetail({ bot }: Props) {
  const { theme } = useTheme();
  const router = useRouter();
  const [showEmbedModal, setShowEmbedModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const handleOpenPageTestChatbot = async () => {
    router.push(`/bots/${bot.id}/test`);
  };
  return (
    <main className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">{bot.name}</h2>
            <div className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center">
              <CheckCircle2 size={12} className="mr-1" />
              Active
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {bot.description}
          </p>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={() => setShowShareModal(true)}
            className={`flex items-center px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800"
            } transition-colors`}
          >
            <Share2 size={16} className="mr-2" />
            Share
          </Button>

          <Button
            onClick={handleOpenPageTestChatbot}
            className={`flex items-center px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800"
            } transition-colors`}
          >
            <HelpCircle size={16} className="mr-2" />
            Test Chatbot
          </Button>

          <Button
            onClick={() => setShowEmbedModal(true)}
            className={`flex items-center px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white transition-colors`}
          >
            <PanelLeft size={16} className="mr-2" />
            Embed
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <TabOverview />
        </TabsContent>
        <TabsContent value="settings">
          <TabSetting bot={bot} />
        </TabsContent>
        <TabsContent value="training">
          <TabTraining />
        </TabsContent>
      </Tabs>
      {showEmbedModal && (
        <ModalEmbeded
          bot={bot}
          showEmbedModal={showEmbedModal}
          setShowEmbedModal={() => setShowEmbedModal(false)}
        />
      )}
    </main>
  );
}
