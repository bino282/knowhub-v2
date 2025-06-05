"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BotIcon,
  Check,
  Copy,
  MessageSquare,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useParams } from "next/navigation";
import { createSessionIdWithBotID } from "@/app/actions/chat";
import { Reference } from "@/types/database.type";
import { toast } from "sonner";
import { Messages } from "../components/messages";
import Markdown from "react-markdown";
import { MarkdownComponents } from "../components/mark-down";
import remarkGfm from "remark-gfm";
import { MarkdownWithReferences } from "../chat/renderMesssage";
import { ReferenceDocuments } from "./renderDocs";
import Loading from "../components/loading";

type Message = {
  id: number;
  sender: "user" | "bot";
  content: string;
};

export default function Chat() {
  const params = useParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<
    Array<{
      role: string;
      content: string;
      isRendered: boolean;
      reference?: Reference;
    }>
  >([]);
  const [content, setContent] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
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
  const handleSend = () => {
    if (!content.trim()) {
      toast.error("Please enter a message");
      return;
    }
    if (!sessionId) {
      toast.error("Session ID is not available");
      return;
    }
    getMessage(sessionId, content);
  };
  async function getMessage(sessionId: string, content: string): Promise<void> {
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
          session_id: sessionId,
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
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    const fetchSessionId = async () => {
      const response = await createSessionIdWithBotID(
        params.id as string,
        "Session " + new Date().toLocaleString()
      );
      if (response.success) {
        setSessionId(response.data.id);
      } else {
        console.error("Error creating session:", response.message);
      }
    };

    fetchSessionId();
  }, [params.id]);

  return (
    <div className="flex flex-col h-screen w-full mx-auto p-6 overflow-hidden">
      <div className="flex flex-col space-y-2 flex-1 overflow-auto">
        <div
          className={`flex-1 dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200 rounded-lg border p-4 overflow-y-auto mb-4`}
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
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="p-4 border-t flex gap-2">
        <Input
          placeholder="Nhập tin nhắn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="px-2 py-2 flex-1"
        />
        <Button onClick={handleSend} className="px-3 py-2 bg-blue-400">
          {loading ? <Loading /> : <Send className="text-white size-4" />}
        </Button>
      </div>
    </div>
  );
}
