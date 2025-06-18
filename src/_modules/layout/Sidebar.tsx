import React, { useState } from "react";
import {
  LayoutDashboard,
  Bot,
  Settings,
  LogOut,
  HelpCircle,
  BrainCircuit,
  DatabaseIcon,
  UsersIcon,
  ChevronLeftIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { i18n } from "@/i18n";
import { DataTypeFromLocaleFunction } from "@/types";

const COLLAPSED_WIDTH = 64; // px (Tailwind w-16)
const EXPANDED_WIDTH = 256; // px (Tailwind w-64)

const Sidebar: React.FC<{ dictionary: DataTypeFromLocaleFunction }> = ({
  dictionary,
}) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const session = useSession();
  const { lang } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push(`/${params.lang}/login`);
  };

  const navItems = [
    {
      to: `/${lang}/dashboard`,
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: dictionary.common.dashboard,
    },
    {
      to: `/${lang}/knowledge`,
      icon: <DatabaseIcon className="h-5 w-5" />,
      label: dictionary.common.knowledge,
    },
    {
      to: `/${lang}/bots`,
      icon: <Bot className="h-5 w-5" />,
      label: dictionary.common.chatbots,
    },
    {
      to: `/${lang}/team`,
      icon: <UsersIcon className="h-5 w-5" />,
      label: dictionary.common.team,
    },
    {
      to: `/${lang}/settings`,
      icon: <Settings className="h-5 w-5" />,
      label: dictionary.common.settings,
    },
  ];
  const baseClasses =
    theme === "dark"
      ? "bg-gray-900 border-gray-700 text-gray-200"
      : "bg-white border-gray-200 text-gray-800";
  return (
    <motion.aside
      // Disable the initial animation flash
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`flex flex-col h-full ${baseClasses} border-r`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        } flex items-center justify-between`}
      >
        {!collapsed && (
          <h1 className="text-xl font-bold whitespace-nowrap">
            <span className="text-blue-600">Know</span>
            <span className="text-teal-500">Hub</span>
          </h1>
        )}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className={`hover:cursor-pointer ${
            collapsed ? "flex justify-center w-full" : ""
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeftIcon
            className={`size-5 transition-transform ${
              collapsed ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.to}
              href={item.to}
              className={`relative flex items-center gap-x-3 px-4 py-3 rounded-lg text-base font-normal transition-colors mx-2 ${
                isActive
                  ? `${
                      theme === "dark"
                        ? "bg-gray-800 text-blue-400"
                        : "bg-blue-50 text-blue-700"
                    }`
                  : `${
                      theme === "dark"
                        ? "text-gray-400 hover:bg-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
              }
              ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}

              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className={`p-4 ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        } mt-auto`}
      >
        {!collapsed ? (
          <div className=" flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-700  dark:text-gray-200 cursor-default">
              <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                {session.data?.user?.name?.[0].toUpperCase()}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {session?.data?.user?.name || "User"}
              </span>
            </div>
            <Button
              variant={"default"}
              onClick={handleLogout}
              className="hover:cursor-pointer text-gray-800 dark:text-white hover:text-gray-500"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        ) : (
          <div
            className="size-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs hover:cursor-pointer"
            onClick={handleLogout}
          >
            {session.data?.user?.name?.[0].toUpperCase()}
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
