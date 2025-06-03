"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Database, DatasetInfo } from "@/types/database.type";
import { createNewBot, getAllBots } from "@/app/actions/bots";
import { toast } from "sonner";
import { createDataset, getAllDatasets } from "@/app/actions/datasets";
import { useRouter } from "next/navigation";

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
    dataSetId: string
  ) => Promise<void>;
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

  // Load bots, documents, and messages
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const resDataset = await getAllDatasets();

        if (!resDataset.success) {
          toast.error(resDataset.message || "Failed to fetch datasets");
          return;
        }

        const datasets = resDataset.data as Dataset[];
        setDatasets(datasets);
        // Load bots
        const resBots = await getAllBots(user.id);

        if (resBots.success) {
          const bots = resBots.data as Bot[];

          const datasetById = new Map(
            datasets.map((ds) => [ds.id, ds] as const)
          );

          const botsWithDataset = bots.map((bot) => ({
            ...bot,
            dataset: datasetById.get(bot.dataSetId) ?? null,
          }));

          setBots(botsWithDataset);

          // Load documents and messages for each bot
          const docsMap: Record<string, Document[]> = {};
          const msgsMap: Record<string, Message[]> = {};
          for (const bot of bots || []) {
            // Load documents
            // const { data: documents, error: docsError } = await supabase
            //   .from("documents")
            //   .select("*")
            //   .eq("bot_id", bot.id)
            //   .order("created_at", { ascending: false });
            // if (docsError) throw docsError;
            // docsMap[bot.id] = documents || [];
            // Load messages
            // const { data: messages, error: msgsError } = await supabase
            //   .from("messages")
            //   .select("*")
            //   .eq("bot_id", bot.id)
            //   .order("created_at", { ascending: true });
            // if (msgsError) throw msgsError;
            // msgsMap[bot.id] = messages || [];
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

    loadData();

    // Subscribe to realtime changes
    //   const botsSubscription = supabase
    //     .channel("bots_channel")
    //     .on(
    //       "postgres_changes",
    //       { event: "*", schema: "public", table: "bots" },
    //       (payload) => {
    //         if (payload.eventType === "INSERT") {
    //           setBots((prev) => [payload.new as Bot, ...prev]);
    //         } else if (payload.eventType === "UPDATE") {
    //           setBots((prev) =>
    //             prev.map((bot) =>
    //               bot.id === payload.new.id ? (payload.new as Bot) : bot
    //             )
    //           );
    //           if (selectedBot?.id === payload.new.id) {
    //             setSelectedBot(payload.new as Bot);
    //           }
    //         } else if (payload.eventType === "DELETE") {
    //           setBots((prev) => prev.filter((bot) => bot.id !== payload.old.id));
    //           if (selectedBot?.id === payload.old.id) {
    //             setSelectedBot(null);
    //           }
    //         }
    //       }
    //     )
    //     .subscribe();

    //   return () => {
    //     botsSubscription.unsubscribe();
    //   };
  }, [user]);

  const createBot = async (
    name: string,
    description: string,
    settings: Record<string, any>,
    dataSetId: string
  ) => {
    if (!user) throw new Error("User not authenticated");

    const data = {
      name,
      description,
      user_id: user.id,
      avatar_url: "",
      settings: settings,
      data_set_id: dataSetId,
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

  // const uploadDocument = async (botId: string, file: File) => {
  //   if (!user) throw new Error("User not authenticated");

  //   try {
  //     // Upload file to storage
  //     const fileExt = file.name.split(".").pop();
  //     const filePath = `${user.id}/${botId}/${Date.now()}.${fileExt}`;

  //     const { error: uploadError, data } = await supabase.storage
  //       .from("documents")
  //       .upload(filePath, file);

  //     if (uploadError) throw uploadError;

  //     // Create document record
  //     const { data: document, error: dbError } = await supabase
  //       .from("documents")
  //       .insert([
  //         {
  //           name: file.name,
  //           type: file.type,
  //           size: file.size,
  //           url: data.path,
  //           bot_id: botId,
  //           user_id: user.id,
  //           status: "processing",
  //         },
  //       ])
  //       .select()
  //       .single();

  //     if (dbError) throw dbError;

  //     setDocumentsByBot((prev) => ({
  //       ...prev,
  //       [botId]: [document, ...(prev[botId] || [])],
  //     }));
  //   } catch (error) {
  //     console.error("Error uploading document:", error);
  //     throw error;
  //   }
  // };

  // const deleteDocument = async (botId: string, documentId: string) => {
  //   const document = documentsByBot[botId]?.find((d) => d.id === documentId);
  //   if (!document) return;

  //   try {
  //     // Delete file from storage
  //     const { error: storageError } = await supabase.storage
  //       .from("documents")
  //       .remove([document.url]);

  //     if (storageError) throw storageError;

  //     // Delete document record
  //     const { error: dbError } = await supabase
  //       .from("documents")
  //       .delete()
  //       .eq("id", documentId);

  //     if (dbError) throw dbError;

  //     setDocumentsByBot((prev) => ({
  //       ...prev,
  //       [botId]: prev[botId].filter((d) => d.id !== documentId),
  //     }));
  //   } catch (error) {
  //     console.error("Error deleting document:", error);
  //     throw error;
  //   }
  // };

  // const sendMessage = async (botId: string, content: string) => {
  //   if (!user) throw new Error("User not authenticated");

  //   try {
  //     // Add user message
  //     const { data: userMessage, error: userMsgError } = await supabase
  //       .from("messages")
  //       .insert([
  //         {
  //           role: "user",
  //           content,
  //           bot_id: botId,
  //           user_id: user.id,
  //         },
  //       ])
  //       .select()
  //       .single();

  //     if (userMsgError) throw userMsgError;

  //     setMessagesByBot((prev) => ({
  //       ...prev,
  //       [botId]: [...(prev[botId] || []), userMessage],
  //     }));

  //     // TODO: Process message with AI and get response
  //     const botResponse =
  //       "I've received your message and am processing it based on the available documents.";

  //     // Add bot response
  //     const { data: botMessage, error: botMsgError } = await supabase
  //       .from("messages")
  //       .insert([
  //         {
  //           role: "bot",
  //           content: botResponse,
  //           bot_id: botId,
  //           user_id: user.id,
  //         },
  //       ])
  //       .select()
  //       .single();

  //     if (botMsgError) throw botMsgError;

  //     setMessagesByBot((prev) => ({
  //       ...prev,
  //       [botId]: [...(prev[botId] || []), botMessage],
  //     }));
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //     throw error;
  //   }
  // };
  const createDatasetFunction = async (name: string, description?: string) => {
    const res = await createDataset(name, description);
    if (res.success) {
      setDatasets((prev) => [...prev, res.data as Dataset]);
      toast.success("Dataset created successfully");
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
      lastActivity: new Date(bot.updatedAt),
    }));
  };

  const getTotalDocuments = (): number => {
    const datasetMap = new Map(
      datasets.map((ds) => [ds.id, ds.document_count])
    );

    const uniqueDatasetIds = new Set(bots.map((bot) => bot.dataSetId));

    const totalChunkCount = Array.from(uniqueDatasetIds).reduce((sum, id) => {
      const chunkCount = datasetMap.get(id) || 0;
      return sum + chunkCount;
    }, 0);
    return totalChunkCount;
  };

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
        createBot,
        // updateBot,
        // deleteBot,
        selectBot,
        selectKnowledge,
        // uploadDocument,
        // deleteDocument,
        // sendMessage,
        getBotSummaries,
        getTotalDocuments,
        getTotalMessages,
        getRecentActivity,
        createDatasetFunction,
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
