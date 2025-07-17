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
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ModalEmbeded from "./components/ModalEmbeded";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ModalShare from "./components/ModalShare";
import { DataTypeFromLocaleFunction } from "@/types";
import { getBotById } from "@/app/actions/bots";
import { SkeletonText3Lines } from "../components/skeleton";
import { useBots } from "../contexts/BotsContext";

interface Props {
  dictionary: DataTypeFromLocaleFunction;
  id: string;
}
export default function PageBotDetail({ dictionary, id }: Props) {
  const params = useParams();

  const [botDetail, setBotDetail] =
    React.useState<Database["public"]["Tables"]["bots"]["Row"]>();
  const { bots } = useBots();
  const [isLoading, setIsLoading] = React.useState(true);
  const [prompt, setPrompt] = React.useState<string>("");
  const [similarityThreshold, setSimilarityThreshold] =
    React.useState<number>(0.7);
  const [topN, setTopN] = React.useState<number>(5);
  const [emptyResponse, setEmptyResponse] = React.useState<string>("");
  const [model, setModel] = React.useState<string>("");
  const [temperature, setTemperature] = React.useState<number>(0.7);
  const [topP, setTopP] = React.useState<number>(0.7);
  const [frequencyPenalty, setFrequencyPenalty] = React.useState<number>(0.7);
  const [presencePenalty, setPresencePenalty] = React.useState<number>(0.7);
  React.useEffect(() => {
    if (bots.length === 0) return;
    const createdById = bots.find((bot) => bot.id === params.id)?.dataset
      ?.createdById;
    const fetchBotDetail = async () => {
      const response = await getBotById(id, createdById);
      if (response.success && response.data) {
        setBotDetail(
          response.data as Database["public"]["Tables"]["bots"]["Row"]
        );
        setPrompt(response.data.chatInfo[0].prompt.prompt);
        setSimilarityThreshold(
          response.data.chatInfo[0].prompt.similarity_threshold
        );
        setTopN(response.data.chatInfo[0].prompt.top_n);
        setEmptyResponse(response.data.chatInfo[0].prompt.empty_response);
        setIsLoading(false);
        setModel(response.data.chatInfo[0].llm.model_name);
        setTemperature(response.data.chatInfo[0].llm.temperature);
        setTopP(response.data.chatInfo[0].llm.top_p);
        setFrequencyPenalty(response.data.chatInfo[0].llm.frequency_penalty);
        setPresencePenalty(response.data.chatInfo[0].llm.presence_penalty);
      }
    };
    fetchBotDetail();
  }, [id, bots]);
  const { theme } = useTheme();
  const router = useRouter();
  const [showEmbedModal, setShowEmbedModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  if (isLoading) {
    return <SkeletonText3Lines />;
  }
  if (!botDetail) {
    return <div>Bot not found</div>;
  }
  return (
    <main className="space-y-6">
      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
        <Link
          href={`/${params.lang}/bots`}
          className="hover:text-blue-600 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />{" "}
          {dictionary.chatbots.chatbots}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">
          {botDetail.name}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">{botDetail.name}</h2>
            <div className="ml-3 ">
              {botDetail?.isActive === true ? (
                <Badge variant={"success"}>
                  <CheckCircle2 size={12} />
                  {dictionary.chatbots.active}
                </Badge>
              ) : (
                <Badge variant={"warning"}>
                  <CircleOff size={12} />
                  {dictionary.chatbots.deactivate}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {botDetail.description}
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
            {dictionary.chatbots.share}
          </Button>

          <Button
            onClick={() => {
              router.push(`/${params.lang}/bots/${botDetail.id}/test`);
            }}
            className={`flex items-center px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800"
            } transition-colors`}
          >
            <HelpCircle size={16} className="mr-2" />
            {dictionary.chatbots.testChatbot}
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
            {dictionary.chatbots.embed}
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
            {dictionary.chatbots.settings}
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
            {dictionary.chatbots.training}
          </TabsTrigger>
        </TabsList>

        {/* <TabsContent value="overview">
          <TabOverview />
        </TabsContent> */}
        <TabsContent value="settings">
          {botDetail && (
            <TabSetting
              bot={botDetail}
              dictionary={dictionary}
              prompt={prompt}
              similarityThreshold={similarityThreshold}
              topN={topN}
              emptyResponse={emptyResponse}
              setPrompt={setPrompt}
              setSimilarityThreshold={setSimilarityThreshold}
              setTopN={setTopN}
              setEmptyResponse={setEmptyResponse}
              model={model}
              setModel={setModel}
              temperature={temperature}
              setTemperature={setTemperature}
              topP={topP}
              setTopP={setTopP}
              frequencyPenalty={frequencyPenalty}
              setFrequencyPenalty={setFrequencyPenalty}
              presencePenalty={presencePenalty}
              setPresencePenalty={setPresencePenalty}
            />
          )}
        </TabsContent>
        <TabsContent value="training">
          <TabTraining dictionary={dictionary} />
        </TabsContent>
      </Tabs>
      {showEmbedModal && (
        <ModalEmbeded
          bot={botDetail}
          showEmbedModal={showEmbedModal}
          setShowEmbedModal={() => setShowEmbedModal(false)}
        />
      )}
      {showShareModal && (
        <ModalShare
          dataBotId={botDetail.id}
          open={showShareModal}
          setOpen={setShowShareModal}
        />
      )}
    </main>
  );
}
