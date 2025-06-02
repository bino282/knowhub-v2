import React from "react";
import { Search, Bell, Settings, Sun, Moon, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const Header: React.FC = () => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user || null;
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  // Get the current page title based on the route
  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/bots") && pathname.split("/").length > 2) {
      return "Bot Detail";
    }

    if (pathname.includes("/bots")) return "Manage Bots";
    if (pathname.includes("/knowledge") && pathname.split("/").length > 2) {
      return "Dataset Detail";
    }
    if (pathname.includes("/knowledge")) return "KnowLedge";

    if (pathname.includes("/files")) return "Manage Files";
    if (pathname.includes("/workspace")) return "Workspace";
    if (pathname.includes("/settings")) return "Settings";

    return "KnowHub";
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4 md:hidden">
          <Button className="btn-secondary p-2">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>

        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search..."
              className="input py-1.5 pl-9 pr-4"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>

          <Button
            className="text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 p-2"
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <Button className="text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 p-2 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary-600"></span>
          </Button>

          <Button
            className="text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 p-2"
            onClick={() => router.push("/settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>

          <div className="ml-2 flex items-center">
            <Button className="flex items-center space-x-2 text-gray-700  dark:text-gray-200 cursor-default">
              <div className="relative">
                <Image
                  src={user?.image || "https://i.pravatar.cc/150?img=68"}
                  alt="User avatar"
                  className="h-8 w-8 rounded-full object-cover"
                  width={32}
                  height={32}
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success-500 border-2 border-white dark:border-gray-800"></span>
              </div>
              <span className="hidden md:block text-sm font-medium">
                {user?.name || "User"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
