"use client";
import { JSX, ReactNode } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

export function Messages({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="flex w-full flex-1 flex-col overflow-hidden ">
      <ScrollToBottom
        className={`custom-scroll h-full`}
        followButtonClassName="hidden"
        initialScrollBehavior="auto"
        mode="bottom"
      >
        {children}
      </ScrollToBottom>
    </div>
  );
}
