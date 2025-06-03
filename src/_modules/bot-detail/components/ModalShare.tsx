import { useState } from "react";

import { Copy, Share2, X, LinkIcon, Mail, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ShareModal({
  shareLink,
  theme,
  open,
  setOpen,
}: {
  shareLink: string;
  theme: "light" | "dark";
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [shareEmail, setShareEmail] = useState("");
  const [shareAccess, setShareAccess] = useState("view");
  const [accessSetting, setAccessSetting] = useState("link");

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Share2 size={20} />
              Share Chatbot
            </DialogTitle>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </DialogHeader>

          {/* Share via Link */}
          <div className="space-y-2 my-4">
            <h4 className="font-medium">Share via Link</h4>
            <div className="flex gap-2">
              <Input
                type="text"
                value={shareLink}
                readOnly
                className={`px-3 py-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-100 border-gray-300"
                }`}
              />
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(shareLink)}
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>

          {/* Share via Email */}
          <div className="space-y-2 my-4">
            <h4 className="font-medium">Share via Email</h4>
            <Input
              type="email"
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e: any) => setShareEmail(e.target.value)}
              className={`px-3 py-2 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />
            <Select value={shareAccess} onValueChange={setShareAccess}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">Can view</SelectItem>
                <SelectItem value="edit">Can edit</SelectItem>
                <SelectItem value="admin">Can manage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 my-4">
            <h4 className="font-medium">Access Settings</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="access"
                  checked={accessSetting === "link"}
                  onChange={() => setAccessSetting("link")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center space-x-2">
                  <LinkIcon size={16} />
                  <span>Anyone with the link</span>
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="access"
                  checked={accessSetting === "specific"}
                  onChange={() => setAccessSetting("specific")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>Specific people only</span>
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="access"
                  checked={accessSetting === "public"}
                  onChange={() => setAccessSetting("public")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center space-x-2">
                  <Globe size={16} />
                  <span>Public on the web</span>
                </span>
              </label>
            </div>
          </div>

          <DialogFooter className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="dark:bg-gray-700 bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white "
            >
              <Share2 size={16} />
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
