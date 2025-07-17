"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  use,
} from "react";
import { useSession } from "next-auth/react";
import { Database, DatasetInfo } from "@/types/database.type";
import { createNewBot, getAllBots } from "@/app/actions/bots";
import { toast } from "sonner";
import { createDataset, getDatasets } from "@/app/actions/datasets";
import { useParams, usePathname, useRouter } from "next/navigation";

type Bot = Database["public"]["Tables"]["bots"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];
type Dataset = DatasetInfo;

interface BotSummary {
  id: string;
  name: string;
  documentsCount: number;
  messagesCount: number;
  lastActivity: Date;
  totalMessages?: number; // Optional, if not available
}

interface BotsContextType {
  bots: Bot[];
  datasets: Dataset[];
  selectedBot: Bot | null;
  selectedDataset: Dataset | null;
  documentsByBot: Record<string, Document[]>;
  messagesByBot: Record<string, Message[]>;
  createBot: (
    name: string,
    description: string,
    settings: Record<string, any>,
    dataSetId: string,
    createdById: string | undefined
  ) => Promise<void>;
  setSelectedBot: React.Dispatch<React.SetStateAction<Bot | null>>;
  setBots: React.Dispatch<React.SetStateAction<Bot[]>>;
  setDatasets: React.Dispatch<React.SetStateAction<Dataset[]>>;
  // updateBot: (id: string, data: Partial<Bot>) => Promise<void>;
  // deleteBot: (id: string) => Promise<void>;
  selectBot: (id: string) => void;
  selectKnowledge: (id: string) => void;
  // uploadDocument: (botId: string, file: File) => Promise<void>;
  // deleteDocument: (botId: string, documentId: string) => Promise<void>;
  // sendMessage: (botId: string, content: string) => Promise<void>;
  getBotSummaries: () => BotSummary[];
  getTotalDocuments: () => number;
  getTotalMessages: () => number;
  getRecentActivity: () => Message[];
  refetchData: () => Promise<void>;
  createDatasetFunction: (
    name: string,
    description?: string
  ) => Promise<{ success: boolean; message: string }>;
}

const BotsContext = createContext<BotsContextType | undefined>(undefined);

export const BotsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [bots, setBots] = useState<Bot[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [documentsByBot, setDocumentsByBot] = useState<
    Record<string, Document[]>
  >({});
  const [messagesByBot, setMessagesByBot] = useState<Record<string, Message[]>>(
    {}
  );
  const session = useSession();
  const user = session.data?.user;

  const refetchData = async () => {
    if (!user) return;
    try {
      const resDataset = await getDatasets();
      if (!resDataset.success) {
        toast.error(resDataset.message || "Failed to fetch datasets");
        return;
      }
      const datasets = resDataset.data as Dataset[];
      setDatasets(datasets);
      // Load bots
      const resBots = await getAllBots(user.id);

      if (resBots.success && resBots.data) {
        const bots = resBots.data;

        const datasetById = new Map(datasets.map((ds) => [ds.id, ds] as const));

        const botsWithDataset = bots.map((bot) => ({
          ...bot,
          dataset: datasetById.get(bot.dataSetId) ?? null,
          chatInfo: null,
        })) as Bot[];

        setBots(botsWithDataset);

        // Load documents and messages for each bot
        const docsMap: Record<string, Document[]> = {};
        const msgsMap: Record<string, Message[]> = {};
        for (const bot of bots || []) {
        }
        setDocumentsByBot(docsMap);
        setMessagesByBot(msgsMap);
      } else {
        toast.error(resBots.error);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  // Load bots, documents, and messages
  useEffect(() => {
    refetchData();
  }, [user]);
  const createBot = async (
    name: string,
    description: string,
    settings: Record<string, any>,
    dataSetId: string,
    createdById: string | undefined
  ) => {
    if (!user) throw new Error("User not authenticated");

    const data = {
      name,
      description,
      user_id: user.id,
      avatar_url: "",
      settings: settings,
      data_set_id: dataSetId,
      created_by_id: createdById,
    };
    const res = await createNewBot(data);

    if (res.success) {
      const bot = res.data as Bot;
      const matchedDataset = datasets.find((ds) => ds.id === bot.dataSetId);
      const botWithDataset = {
        ...bot,
        dataset: matchedDataset ?? undefined,
      } as Bot & { dataset?: Dataset };

      // push to state
      setBots((prev) => [botWithDataset, ...prev]);
      setDocumentsByBot((prev) => ({ ...prev, [bot.id]: [] }));
      setMessagesByBot((prev) => ({ ...prev, [bot.id]: [] }));
      setSelectedBot(bot);
      toast.success("Bot created successfully");
    } else {
      toast.error(res.error || "Failed to create bot:");
    }
  };

  const selectBot = (id: string) => {
    const bot = bots.find((b) => b.id === id) || null;
    setSelectedBot(bot);
  };
  const selectKnowledge = (id: string) => {
    const dataset = datasets.find((d) => d.id === id) || null;
    setSelectedDataset(dataset);
  };
  const createDatasetFunction = async (name: string, description?: string) => {
    const res = await createDataset(name, description);
    if (res.success) {
      setDatasets((prev) => [...prev, res.data as Dataset]);
      router.refresh();
      return { success: true, message: "Dataset created successfully" };
    } else {
      toast.error(res.message || "Failed to create dataset");
      return {
        success: false,
        message: "Failed to create dataset",
      };
    }
  };
  const getBotSummaries = (): BotSummary[] => {
    return bots.map((bot) => ({
      id: bot.id,
      name: bot.name,
      documentsCount: bot.dataset?.document_count || 0,
      messagesCount: messagesByBot[bot.id]?.length || 0,
      totalMessages: bot?.totalMessages || 0,
      lastActivity: new Date(bot.updatedAt),
    }));
  };

  const getTotalDocuments = (): number =>
    datasets.reduce((sum, d) => sum + (d.document_count || 0), 0);

  const getTotalMessages = (): number => {
    return Object.values(messagesByBot).reduce(
      (total, msgs) => total + (msgs?.length || 0),
      0
    );
  };

  const getRecentActivity = (): Message[] => {
    const allMessages = Object.entries(messagesByBot).flatMap(
      ([botId, messages]) =>
        (messages || []).map((msg) => ({
          ...msg,
          botName: bots.find((b) => b.id === botId)?.name,
        }))
    );

    return allMessages
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  };

  return (
    <BotsContext.Provider
      value={{
        bots,
        datasets,
        selectedBot,
        selectedDataset,
        documentsByBot,
        messagesByBot,
        setBots,
        setDatasets,
        createBot,
        setSelectedBot,
        selectBot,
        selectKnowledge,
        getBotSummaries,
        getTotalDocuments,
        getTotalMessages,
        getRecentActivity,
        createDatasetFunction,
        refetchData,
      }}
    >
      {children}
    </BotsContext.Provider>
  );
};

export const useBots = () => {
  const context = useContext(BotsContext);
  if (context === undefined) {
    throw new Error("useBots must be used within a BotsProvider");
  }
  return context;
};
