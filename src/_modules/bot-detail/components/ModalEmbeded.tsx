import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Database } from "@/types/database.type";
import { Bot, Code, Copy, ExternalLink, X } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

interface Props {
  showEmbedModal: boolean;
  setShowEmbedModal: (value: boolean) => void;
  bot: Database["public"]["Tables"]["bots"]["Row"];
}
export default function ModalEmbeded({
  showEmbedModal,
  setShowEmbedModal,
  bot,
}: Props) {
  const { theme } = useTheme();
  const [embedTheme, setEmbedTheme] = React.useState(theme);
  const [embedPosition, setEmbedPosition] = React.useState("right");
  const baseCardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  console.log(theme);
  const getEmbedCode = () => {
    return `<!-- KMSHub Chatbot Widget -->
    <script>
      window.kmshubConfig = {
        chatbotId: "${bot}",
        theme: "${embedTheme}",
        position: "${embedPosition}",
        title: "${bot.name}",
        greeting: "Hello! How can I help you today?"
      };
    </script>
    <script async src="https://cdn.kmshub.com/widget.js"></script>`;
  };
  return (
    <Dialog open={showEmbedModal} onOpenChange={setShowEmbedModal}>
      <DialogContent
        className={`${baseCardClasses} bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg p-0 max-w-3xl w-full`}
      >
        <DialogHeader className="p-6">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold flex items-center">
              <Code size={20} className="mr-2" />
              Embed Chatbot
            </DialogTitle>
          </div>
        </DialogHeader>

        <div
          className="space-y-6  overflow-y-auto"
          style={{ maxHeight: "70vh" }}
        >
          <div className="px-6">
            <h4 className="font-medium mb-2">Preview</h4>
            <div
              className={`bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 border rounded-lg p-4 h-64 relative`}
            >
              <div className={` border rounded-lg shadow-lg`}>
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <Bot size={18} className="mr-2 text-blue-500" />
                  <span className="font-medium">{bot.name}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hello! How can I help you today?
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
              <select
                value={embedTheme}
                onChange={(e) => setEmbedTheme(e.target.value)}
                className={`w-full rounded-md bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 border px-3 py-2`}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System (Auto)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <select
                value={embedPosition}
                onChange={(e) => setEmbedPosition(e.target.value)}
                className={`w-full rounded-md bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 border px-3 py-2`}
              >
                <option value="right">Bottom Right</option>
                <option value="left">Bottom Left</option>
              </select>
            </div>
          </div>

          <div className="px-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Embed Code</h4>
              <button
                onClick={() => navigator.clipboard.writeText(getEmbedCode())}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
              >
                <Copy size={14} className="mr-1" />
                Copy Code
              </button>
            </div>
            <pre
              className={`bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg p-4 overflow-x-auto border border-gray-200`}
            >
              <code className="text-sm">{getEmbedCode()}</code>
            </pre>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 px-6 pb-6">
          <a
            href="https://docs.kmshub.com/chatbot-embedding"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-sm"
          >
            <ExternalLink size={14} className="mr-1" />
            View Documentation
          </a>
          <button
            onClick={() => setShowEmbedModal(false)}
            className={`px-4 py-2 rounded-md dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors`}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
