import React from "react";
import {
  LayoutDashboard,
  Bot,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  HelpCircle,
  BrainCircuit,
  BookUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
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
    { to: "/bots", icon: <Bot className="h-5 w-5" />, label: "Bots" },
    {
      to: "/knowledge",
      icon: <BookUp className="h-5 w-5" />,
      label: "KnowLedge",
    },

    {
      to: "/workspace",
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Workspace",
    },
    {
      to: "/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4 flex items-center gap-2">
        <BrainCircuit className="h-8 w-8 text-primary-600" />
        <h1 className="text-xl font-bold">HCT KnowHub</h1>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={`
              relative flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${
                pathname === item.to
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
              }
            `}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>

            {pathname === item.to && (
              <motion.div
                layoutId="sidebar-indicator"
                className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r"
              />
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
          onClick={() => {
            /* Help function */
          }}
        >
          <HelpCircle className="h-5 w-5 mr-3" />
          <span>Help & Support</span>
        </button>

        <button
          className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
