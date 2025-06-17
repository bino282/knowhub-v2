"use client";
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { DataTypeFromLocaleFunction } from "@/types";

export default function Layout({
  children,
  dictionary,
}: {
  children: React.ReactNode;
  dictionary: DataTypeFromLocaleFunction;
}) {
  const pathname = usePathname();

  return (
    <>
      {pathname.endsWith("/share") ? (
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      ) : (
        <div className="flex h-screen">
          <Sidebar dictionary={dictionary} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header dictionary={dictionary} />
            <main className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
