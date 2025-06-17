import React from "react";
import { Search, Bell, Sun, Moon, Menu, HelpCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { DataTypeFromLocaleFunction } from "@/types";

const Header: React.FC<{ dictionary: DataTypeFromLocaleFunction }> = ({
  dictionary,
}) => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  // Get the current page title based on the route
  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return dictionary.common.dashboard;

    if (pathname.includes("/bots")) return dictionary.common.chatbots;
    if (pathname.includes("/knowledge")) return dictionary.common.knowledge;
    if (pathname.includes("/team")) return dictionary.common.team;
    if (pathname.includes("/files")) return "Manage Files";
    if (pathname.includes("/workspace")) return "Workspace";
    if (pathname.includes("/settings")) return dictionary.common.settings;

    return "KnowHub";
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="block">
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* <div className="relative hidden md:block"> */}
          {/* <Input
              type="text"
              placeholder="Search..."
              className="input py-1.5 pl-9 pr-4 bg-white dark:bg-gray-700"
            /> */}
          <Button className="text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 p-2 relative">
            <Search className="size-5 text-gray-700 dark:text-gray-200" />

            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary-600"></span>
          </Button>
          {/* </div> */}

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
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
