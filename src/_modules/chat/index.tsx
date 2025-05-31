"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Send,
  Bot,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Settings,
  HelpCircle,
  X,
  BotIcon,
  CircleAlert,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Messages } from "../components/messages";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "../components/mark-down";
import { toast } from "sonner";
import exactTextFieldString from "@/lib/extractText";
import { useBots } from "../contexts/BotsContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
type Reference = {
  chunks: {
    vector_similarity: number;
    content: string;
    document_name?: string;
  }[];
};

const TestChatbot: React.FC = () => {
  const { theme } = useTheme();
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
  >([
    {
      role: "assistant",
      content:
        "Hello! I'm your Customer Support Assistant. How can I help you today?",
      isRendered: true,
    },
  ]);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [content, setContent] = React.useState<string>("");

  const handleSend = () => {
    if (!content.trim()) return;
    getMessage(content);
  };
  // async function getMessage(content: string): Promise<void> {
  //   // --- setup ---------------------------------------------------------------
  //   const decoder = new TextDecoder("utf-8");
  //   let buffer = ""; // keeps partial text between chunks

  //   try {
  //     setLoading(true);

  //     // optimistic UI: user line + placeholder “...”
  //     setMessages((prev) => [
  //       ...prev,
  //       { role: "user", content, isRendered: true },
  //       { role: "assistant", content: "...", isRendered: false },
  //     ]);
  //     setContent("");

  //     // small artificial delay (optional)
  //     await new Promise((res) => setTimeout(res, 1_000));

  //     const response = await fetch("/api/chat-stream", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         message: content,
  //         stream: true,
  //         bot_id: params.id,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(
  //         response.status === 429
  //           ? "Too many requests, retry later!"
  //           : "Network response was not ok"
  //       );
  //     }

  //     const reader = response.body!.getReader();

  //     // build up our local copy of the messages array
  //     const updated = [
  //       ...messages,
  //       { role: "user", content, isRendered: true },
  //     ];
  //     const assistant = { role: "assistant", content: "", isRendered: false };
  //     updated.push(assistant);
  //     setMessages([...updated]);

  //     // --- read the stream ----------------------------------------------------
  //     while (true) {
  //       const { value, done } = await reader.read();
  //       if (done) {
  //         assistant.isRendered = true;
  //         setMessages([...updated]);
  //         setLoading(false);
  //         break;
  //       }

  //       // 1️⃣ decode this binary chunk to text
  //       buffer += decoder.decode(value, { stream: true });

  //       // 2️⃣ split on *complete* lines that start with "data:"
  //       let newlineIdx;
  //       // process as many complete events as we already have in buffer
  //       while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
  //         const rawLine = buffer.slice(0, newlineIdx).trim(); // inclusive of "data:"
  //         buffer = buffer.slice(newlineIdx + 1); // remainder

  //         if (!rawLine.startsWith("data:")) continue; // skip noise

  //         const jsonPart = rawLine.slice(5).trim(); // remove "data:"
  //         if (!jsonPart) continue;

  //         let payload: any;
  //         try {
  //           payload = JSON.parse(jsonPart);
  //         } catch {
  //           console.warn("Could not JSON-parse:", jsonPart);
  //           continue;
  //         }

  //         if (payload?.data === true) {
  //           assistant.isRendered = true;
  //           setMessages([...updated]);
  //           setLoading(false);
  //           break;
  //         }

  //         const fragment = payload?.data?.answer;
  //         if (typeof fragment === "string") {
  //           assistant.content = fragment;
  //           setMessages([...updated]);
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setLoading(false);
  //     toast.error("An error occurred. Please try again!!");
  //   }
  // }
  async function getMessage(content: string): Promise<void> {
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

      const response = await fetch("/api/chat-stream", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          stream: true,
          bot_id: params.id,
        }),
      });

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
            console.log("payload", payload);
          } catch {
            console.warn("Could not JSON-parse:", jsonPart);
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
  return (
    <div className="h-[calc(100vh-7.8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4 px-4 py-4">
        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
          <button
            onClick={() => router.push(`/bots/${params.id}`)}
            className="hover:text-blue-600 flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Chatbots
          </button>
        </div>

        <div className="flex items-center space-x-2">
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

      {/* Main content */}
      <div className="flex flex-1 gap-6 overflow-hidden px-4 pb-4">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Message list (scrollable) */}
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
                        <div className="p-2 w-fit h-fit rounded-full bg-blue-800/20 ml-2 ">
                          <MessageSquare className="size-4 text-blue-500" />
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
                                    <div className="flex items-center">
                                      <div className="rounded-lg border px-3.5 py-2.5 text-base font-normal dark:text-gray-200 text-gray-800">
                                        <div className="flex items-end p-2 gap-2">
                                          <div>
                                            <Markdown
                                              components={MarkdownComponents}
                                              remarkPlugins={[remarkGfm]}
                                            >
                                              {t.content}
                                            </Markdown>
                                          </div>
                                          {(() => {
                                            const ref = t.reference as
                                              | {
                                                  chunks: {
                                                    vector_similarity: number;
                                                    content: string;
                                                    image_id?: string;
                                                  }[];
                                                }
                                              | undefined;

                                            if (
                                              !ref?.chunks ||
                                              ref.chunks.length === 0
                                            )
                                              return null;

                                            const bestChunk = ref.chunks.reduce(
                                              (max, cur) =>
                                                cur.vector_similarity >
                                                max.vector_similarity
                                                  ? cur
                                                  : max
                                            );

                                            return (
                                              <Tooltip>
                                                <TooltipTrigger>
                                                  <CircleAlert className="size-6 mb-1 text-yellow-500" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs border border-gray-300 dark:border-gray-600 mb-4">
                                                  {bestChunk.image_id ? (
                                                    <Image
                                                      src={bestChunk.image_id}
                                                      alt="Reference"
                                                      className="max-w-full h-auto mb-2 rounded-md"
                                                      width={300}
                                                      height={200}
                                                    />
                                                  ) : (
                                                    <p className="text-sm">
                                                      {bestChunk.content}
                                                    </p>
                                                  )}
                                                </TooltipContent>
                                              </Tooltip>
                                            );
                                          })()}
                                        </div>
                                      </div>
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
            <button
              className={`p-2 rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-colors`}
            >
              <RotateCcw size={20} />
            </button>

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
              <button
                onClick={handleSend}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md ${
                  theme === "dark"
                    ? content.trim()
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-gray-500"
                    : content.trim()
                    ? "text-blue-600 hover:text-blue-700"
                    : "text-gray-400"
                }`}
                disabled={!content.trim()}
              >
                <Send size={18} />
              </button>
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
    </div>
  );
};

export default TestChatbot;
