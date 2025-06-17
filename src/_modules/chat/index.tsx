"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Settings,
  HelpCircle,
  X,
  BotIcon,
  Plus,
  Clock,
  ChevronUp,
  ChevronDown,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Messages } from "../components/messages";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "../components/mark-down";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  createMessages,
  createSessionId,
  createSessionMessage,
  deleteChatHistory,
  getListChat,
  getListMessages,
} from "@/app/actions/chat";
import { formatGmtDate, toGmtDateString } from "@/lib/format-date";
// import { renderTextWithReferences } from "./renderMesssage";
import { ReferenceDocuments } from "./renderDocs";
import { set } from "date-fns";
import { DeleteChatHistoryModal } from "./components/ModalDeleteChatHistory";
import { MarkdownWithReferences } from "./renderMesssage";
import { Reference } from "@/types/database.type";
import { DataTypeFromLocaleFunction } from "@/types";
import { useBots } from "../contexts/BotsContext";
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  botId: string;
}
const TestChatbot: React.FC<{ dictionary: DataTypeFromLocaleFunction }> = ({
  dictionary,
}) => {
  const { theme } = useTheme();
  const { bots } = useBots();

  const params = useParams();
  const router = useRouter();
  const baseCardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const [messages, setMessages] = React.useState<
    Array<{
      role: string;
      content: string;
      isRendered: boolean;
      reference?: Reference;
    }>
  >([]);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  // get list chat history
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [selectedChatHistory, setSelectedChatHistory] =
    useState<ChatHistory | null>(null);
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [content, setContent] = React.useState<string>("");
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [sessionDeleteId, setSessionDeleteId] = React.useState<string>("");
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isCopied) return;
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setIsCopied(true);
        toast.success("Message copied to clipboard");
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy message");
      });
  };
  React.useEffect(() => {
    getListChat(params.id as string)
      .then((res) => {
        if (res.success) {
          const dataFormat = res.data.map((chat) => ({
            ...chat,
            createdAt: toGmtDateString(chat.createdAt),
            updatedAt: toGmtDateString(chat.updatedAt),
          }));
          setChatHistory(dataFormat);
        } else {
          setChatHistory([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching chat history:", error);
        toast.error("An error occurred while fetching chat history");
      });
  }, []);

  // selected chat history

  React.useEffect(() => {
    if (isSending) return;
    if (!selectedChatHistory && chatHistory.length > 0) {
      const firstHistory = chatHistory[0];
      setSelectedChatHistory(firstHistory);
      getListMessageSession(firstHistory.id);
    }
    if (selectedChatHistory) {
      getListMessageSession(selectedChatHistory.id);
    }
  }, [selectedChatHistory, chatHistory]);
  const handleNewConversation = () => {
    const hasEmptyIdChat = chatHistory.some((chat) => chat.id === "");
    if (hasEmptyIdChat) return;
    const now = new Date();

    const dateStr = now.toUTCString();

    const newChat: ChatHistory = {
      id: "",
      botId: params.id as string,
      name: "new conversation",
      createdAt: dateStr,
      updatedAt: dateStr,
    };

    // Append to existing history
    setChatHistory((prev) => [newChat, ...prev]);
    setSelectedChatHistory(newChat);
  };
  const handleSend = async () => {
    if (chatHistory.length === 0) {
      toast.error("Please create a new conversation");
      return;
    }
    if (!content.trim() || bots.length === 0) return;
    const createdById = bots.find((bot) => bot.id === params.id)?.dataset
      ?.createdById;
    const hasUserMessage = messages.some((msg) => msg.role === "user");

    if (
      hasUserMessage ||
      (selectedChatHistory && selectedChatHistory.id !== "")
    ) {
      getMessage(selectedChatHistory?.id || "", content, createdById);
    } else {
      setIsSending(true);
      try {
        const res = await createSessionId(
          params.id as string,
          content,
          createdById
        );

        if (!res.success) {
          toast.error(res.message || "Failed to create session");
          setIsSending(false); // reset flag nếu lỗi
          return;
        }
        await createSessionMessage(
          res.data.id,
          res.data.name,
          params.id as string
        );

        const updatedSession: ChatHistory = {
          ...selectedChatHistory!,
          id: res.data.id,
          name: res.data.name || "",
          createdAt: res.data.create_date || "",
          updatedAt: res.data.update_date || "",
        };

        setChatHistory((prev) =>
          prev.map((chat) => (chat.id === "" ? updatedSession : chat))
        );
        setSelectedChatHistory(updatedSession);

        await getMessage(res.data.id || "", content, createdById);
      } catch (error) {
        toast.error("Error sending message");
      } finally {
        setIsSending(false); // luôn reset flag dù thành công hay lỗi
      }
    }
  };
  const handleDeleteChatHistory = async () => {
    if (!sessionDeleteId) return;
    try {
      const res = await deleteChatHistory(sessionDeleteId);
      if (!res.success) {
        toast.error(res.message || "Failed to delete chat history");
        return;
      }
      setChatHistory((prev) =>
        prev.filter((chat) => chat.id !== sessionDeleteId)
      );
      toast.success("Chat history deleted successfully");
    } catch (error) {
      console.error("Error deleting chat history:", error);
      toast.error("An error occurred while deleting chat history");
    }
  };
  async function getMessage(
    sessionId: string,
    content: string,
    createdById: string | undefined
  ): Promise<void> {
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    try {
      setLoading(true);

      // Optimistic UI: add user message and placeholder assistant
      setMessages((prev) => [
        ...prev,
        { role: "user", content, isRendered: true },
        { role: "assistant", content: "...", isRendered: false },
      ]);
      setContent("");

      // Optional artificial delay
      await new Promise((res) => setTimeout(res, 1_000));

      const response = await fetch(
        `/api/chat-stream?created_by_id=${createdById}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            stream: true,
            bot_id: params.id,
            session_id: sessionId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 429
            ? "Too many requests, retry later!"
            : "Network response was not ok"
        );
      }

      const reader = response.body!.getReader();

      // Local updated message list
      const updated = [
        ...messages,
        { role: "user", content, isRendered: true },
      ];

      // Assistant message object to update
      const assistant: {
        role: "assistant";
        content: string;
        reference?: any;
        isRendered: boolean;
      } = {
        role: "assistant",
        content: "",
        reference: undefined,
        isRendered: false,
      };

      updated.push(assistant);
      setMessages([...updated]);

      // Stream loop
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          assistant.isRendered = true;
          setMessages([...updated]);
          setLoading(false);
          const messages = [
            { role: "user", content },
            {
              role: "assistant",
              content: assistant.content,
              reference: assistant.reference,
            },
          ];
          try {
            await createMessages(sessionId, messages);
          } catch (e) {
            console.error("Failed to save messages", e);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        let newlineIdx;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          const rawLine = buffer.slice(0, newlineIdx).trim();
          buffer = buffer.slice(newlineIdx + 1);

          if (!rawLine.startsWith("data:")) continue;

          const jsonPart = rawLine.slice(5).trim();
          if (!jsonPart) continue;

          let payload: any;
          try {
            payload = JSON.parse(jsonPart);
          } catch {
            console.warn("Could not JSON-parse:", payload);
            continue;
          }

          // End of stream signal
          if (payload?.data === true) {
            assistant.isRendered = true;
            setMessages([...updated]);
            setLoading(false);
            break;
          }

          // Extract answer fragment
          const fragment = payload?.data?.answer;
          if (typeof fragment === "string") {
            assistant.content = fragment;
            console.log("value done", fragment);
          }

          // Extract reference if present
          const ref = payload?.data?.reference;
          if (ref && Object.keys(ref).length > 0) {
            assistant.reference = ref;
          }

          setMessages([...updated]);
        }
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("An error occurred. Please try again!!");
    }
  }
  async function getListMessageSession(sessionId: string) {
    try {
      const res = await getListMessages(sessionId);
      if (res.success) {
        const formattedMessages = res.data.map((message) => ({
          role: message.role,
          content: message.content,
          reference: message.reference ?? undefined,
          isRendered: true,
        }));
        setMessages(formattedMessages as typeof messages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("An error occurred while fetching messages");
    }
  }
  return (
    <div className="h-[calc(100vh-7.8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
          <button
            onClick={() => router.push(`/${params.lang}/bots/${params.id}`)}
            className="hover:text-blue-600 flex items-center text-base"
          >
            <ArrowLeft size={16} className="mr-1" />{" "}
            {dictionary.chatbots.backToChatbots}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            className="flex items-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            onClick={handleNewConversation}
          >
            <Plus size={16} className="mr-1" />
            {dictionary.chatbots.newChat}
          </Button>
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-md ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <Settings size={20} />
          </button>
          <button
            className={`p-2 rounded-md ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div
          className={`w-64 ${baseCardClasses} rounded-lg border flex flex-col`}
        >
          <div className="flex items-center justify-between p-4">
            <h3 className="font-semibold flex items-center">
              <Clock size={16} className="mr-2" />
              {dictionary.chatbots.chatHistory}
            </h3>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 pr-0"
            >
              {showHistory ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </Button>
          </div>

          {showHistory && (
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`w-full text-left p-3 rounded-md mb-2 ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors group ${
                    selectedChatHistory?.id === chat.id
                      ? "dark:bg-gray-700 bg-gray-100"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedChatHistory(chat);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{chat.name}</span>
                    <div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSessionDeleteId(chat.id);
                      }}
                    >
                      <button className="text-gray-500 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {/* {messages.length > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {messages[messages.length - 1].content || ""}
                    </p>
                  )} */}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatGmtDate(chat.updatedAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div
            className={`flex-1 ${baseCardClasses} rounded-lg border p-4 overflow-y-auto mb-4`}
          >
            <Messages>
              {messages.map((t, i) => (
                <React.Fragment key={i}>
                  {t.role === "user" ? (
                    <div className="mb-4 flex w-full justify-end gap-2">
                      <div className="w-auto flex  text-gray-800 dark:text-white">
                        <div className="rounded-lg px-3.5 py-2.5 bg-blue-500 text-white text-base font-normal flex-1">
                          <Markdown
                            components={MarkdownComponents}
                            remarkPlugins={[remarkGfm]}
                          >
                            {t.content}
                          </Markdown>
                        </div>
                        <div className="p-2 w-fit h-fit rounded-full bg-blue-100 ml-2 ">
                          <MessageSquare className="size-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full items-center justify-start">
                      <div className="mb-10 flex gap-2 rounded-3xl bg-gray-opaque py-2">
                        <div className="relative flex w-full flex-col">
                          <div className="flex flex-col items-start whitespace-pre-wrap break-words">
                            <div className="relative flex w-fit gap-2 whitespace-pre-wrap break-words">
                              <div className="flex justify-center bg-purple-700/20 w-fit h-fit rounded-full p-2">
                                <BotIcon
                                  width={20}
                                  height={20}
                                  className="text-purple-600"
                                />
                              </div>
                              <div className="flex items-start">
                                <div>
                                  <p className="mb-1.5 text-sm font-medium dark:text-gray-200 text-gray-800">
                                    KmsHub
                                  </p>
                                  {t.content === "..." ? (
                                    <div className="loading">
                                      <span className="dot">.</span>
                                      <span className="dot">.</span>
                                      <span className="dot">.</span>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-start">
                                      <div className="rounded-lg border px-3.5 py-2.5 text-sm font-normal dark:text-gray-200 text-gray-800 bg-gray-100 dark:bg-gray-700 ">
                                        {/* {renderTextWithReferences(
                                            t.content,
                                            t.reference
                                          )} */}
                                        <div className=" mx-auto leading-none text-start">
                                          <MarkdownWithReferences
                                            content={t.content}
                                            references={t.reference!}
                                          />
                                        </div>
                                        {t.content && t.isRendered && (
                                          <div className="flex items-center mt-2 space-x-4">
                                            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                              <ThumbsUp size={14} />
                                            </button>
                                            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                              <ThumbsDown size={14} />
                                            </button>
                                            <button
                                              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                              onClick={handleCopy}
                                            >
                                              {isCopied ? (
                                                <Check
                                                  size={14}
                                                  className="text-green-400"
                                                />
                                              ) : (
                                                <Copy size={14} />
                                              )}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      <ReferenceDocuments
                                        reference={t.reference}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </Messages>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className={`w-full rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } border pl-4 pr-12 py-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {loading ? (
                <div className="flex justify-center items-center absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5">
                  <div className="animate-spin rounded-full size-4 border-2 border-gray-300 border-t-blue-500"></div>
                </div>
              ) : (
                <button
                  onClick={handleSend}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md ${
                    theme === "dark"
                      ? content.trim() || !selectedChatHistory?.id
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-gray-500"
                      : content.trim()
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-400"
                  }`}
                  disabled={
                    !content.trim() || !selectedChatHistory?.id || loading
                  }
                >
                  <Send size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className={`w-80 ${baseCardClasses} rounded-lg border p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Chat Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Response Style
                </label>
                <select
                  className={`w-full rounded-md ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } border px-3 py-2`}
                >
                  <option>Friendly and Helpful</option>
                  <option>Professional and Concise</option>
                  <option>Technical and Detailed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Maximum Response Length
                </label>
                <input
                  type="number"
                  defaultValue={150}
                  className={`w-full rounded-md ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } border px-3 py-2`}
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2">Include citations</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2">Allow follow-up questions</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2">Save conversation history</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      <DeleteChatHistoryModal
        onConfirm={handleDeleteChatHistory}
        open={!!sessionDeleteId}
        close={() => setSessionDeleteId("")}
      />
    </div>
  );
};

export default TestChatbot;
