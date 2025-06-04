"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabOverview from "./components/TabOverview";
import TabSetting from "./components/TabSetting";
import { Database } from "@/types/database.type";
import TabTraining from "./components/TabTraining";
import {
  ArrowLeft,
  CheckCircle2,
  CircleOff,
  HelpCircle,
  PanelLeft,
  Share2,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useRouter } from "next/navigation";
import React from "react";
import ModalEmbeded from "./components/ModalEmbeded";
import { ShareModal } from "./components/ModalShare";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
  bot: Database["public"]["Tables"]["bots"]["Row"];
}
export default function PageBotDetail({ bot }: Props) {
  const url = process.env.NEXT_PUBLIC_URL;
  const { theme } = useTheme();
  const router = useRouter();
  const [showEmbedModal, setShowEmbedModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const handleOpenPageTestChatbot = async () => {
    router.push(`/bots/${bot.id}/test`);
  };
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
        <Link href="/bots" className="hover:text-blue-600 flex items-center">
          <ArrowLeft size={16} className="mr-1" /> Chatbots
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">{bot.name}</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">{bot.name}</h2>
            <div className="ml-3 ">
              {bot.isActive === true ? (
                <Badge variant={"success"}>
                  <CheckCircle2 size={12} />
                  Active
                </Badge>
              ) : (
                <Badge variant={"warning"}>
                  <CircleOff size={12} />
                  Deactive
                </Badge>
              )}
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

      <Tabs defaultValue="settings">
        <TabsList className="mb-6 pb-0 bg-transparent border-b border-gray-200 dark:border-gray-700 rounded-none w-full flex items-center justify-start gap-6">
          {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
          <TabsTrigger
            value="settings"
            className="flex-none border-b-2 border-transparent pb-3 cursor-pointer
    text-base font-medium

    hover:border-gray-700 dark:hover:border-gray-300
    hover:text-gray-700 dark:hover:text-gray-300

    data-[state=active]:border-blue-500
    data-[state=active]:text-blue-500 dark:data-[state=active]:text-blue-500

    data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent
    shadow-none"
          >
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="training"
            className="flex-none border-b-2 border-transparent pb-3 cursor-pointer
    text-base font-medium

    hover:border-gray-700 dark:hover:border-gray-300
    hover:text-gray-700 dark:hover:text-gray-300

    data-[state=active]:border-blue-500
    data-[state=active]:text-blue-500 dark:data-[state=active]:text-blue-500

    data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent
    shadow-none"
          >
            Training
          </TabsTrigger>
        </TabsList>

        {/* <TabsContent value="overview">
          <TabOverview />
        </TabsContent> */}
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
      {showShareModal && (
        <ShareModal
          shareLink={`${url}/bots/${bot.id}`}
          theme={theme}
          open={showShareModal}
          setOpen={setShowShareModal}
        />
      )}
    </main>
  );
}
