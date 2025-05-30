"use client";

import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { FileText, ExternalLink } from "lucide-react";

interface DocumentCardProps {
  filename: string;
  size: number;
  timeAgo: string;
  uploaderName: string;
  uploaderInitials: string;
}

export function DocumentCard({
  filename,
  size,
  timeAgo,
  uploaderName,
  uploaderInitials,
}: DocumentCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4 space-y-3">
        <div className="w-8 h-8 bg-muted-foreground/10 rounded-md flex items-center justify-center">
          <FileText className="text-red-500 w-5 h-5" />
        </div>

        <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">
          {filename}
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatFileSize(size)}</span>
          <span> {format(timeAgo, "EEEE, MMMM d, yyyy")}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-800 dark:text-gray-200">
            <div className="bg-blue-600  w-6 h-6 rounded-full flex items-center justify-center text-[10px] ">
              {uploaderInitials}
            </div>
            {uploaderName}
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
function formatFileSize(kb: number): string {
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}
