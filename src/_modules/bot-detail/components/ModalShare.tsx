"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { LinkIcon, Share } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import React from "react";
import CopyCodeButton from "@/_modules/components/copy-code";

export default function ModalShare({
  dataBotId,
  open,
  setOpen,
}: {
  dataBotId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogContent className="max-w-3xl gap-0 dark:bg-gray-800">
          <DialogTitle className="text-lg font-bold">
            <p className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
              Share
            </p>
          </DialogTitle>
          <div className="relative mx-auto flex size-full max-w-7xl flex-col gap-6">
            <p className="text-sm text-muted-foreground">
              To share the chatbot, scan this QR code or copy the following link
            </p>
            <Card className="flex flex-col overflow-hidden rounded-sm border shadow-xl dark:border-none dark:bg-gray-800">
              <CardContent className="flex flex-col gap-8 pt-4">
                <div
                  className={
                    "inline-flex max-w-2xl flex-col items-center justify-center gap-4 md:justify-start"
                  }
                >
                  <QRCodeSVG value={`${origin}/bot/share/${dataBotId}`} />
                  <div className="inline-flex w-fit items-center rounded-sm border border-blue-300 bg-blue-100 px-2.5 py-2  text-blue-500">
                    <div className="flex items-center gap-1 flex-1">
                      <LinkIcon size={14} className="mr-2 cursor-pointer" />
                      <Link
                        target="_blank"
                        href={`${origin}/bot/share/${dataBotId}`}
                        className="hover:underline"
                      >{`${origin}/bot/share/${dataBotId}`}</Link>
                    </div>
                    <CopyCodeButton
                      content={`${origin}/bot/share/${dataBotId}`}
                    ></CopyCodeButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
