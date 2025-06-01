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
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const COLLAPSED_WIDTH = 80; // px (Tailwind w-20)
const EXPANDED_WIDTH = 256; // px (Tailwind w-64)

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  const navItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      to: "/knowledge",
      icon: <DatabaseIcon className="h-5 w-5" />,
      label: "Knowledge",
    },
    { to: "/bots", icon: <Bot className="h-5 w-5" />, label: "Chatbots" },
    {
      to: "/user-management",
      icon: <UsersIcon className="h-5 w-5" />,
      label: "User Management",
    },
    {
      to: "/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
  ];

  return (
    <motion.aside
      // Disable the initial animation flash
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="flex flex-col h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-xl font-bold whitespace-nowrap">
            <span className="text-blue-600">KMS</span>
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
      <nav className="flex-1 px-2 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.to}
              href={item.to}
              className={`relative flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors          ${
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
              }
              ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 ${
            collapsed ? "justify-center" : "gap-x-3"
          }`}
          onClick={() => {
            /* Help function */
          }}
          title={collapsed ? "Help & Support" : undefined}
        >
          <HelpCircle className="h-5 w-5" />
          {!collapsed && <span>Help & Support</span>}
        </button>

        <button
          className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 ${
            collapsed ? "justify-center" : "gap-x-3"
          }`}
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
