"use client";
import React, { useState } from "react";
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  Shield,
  Smartphone,
  Save,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateUserProfile } from "@/app/actions/user";
import { DataTypeFromLocaleFunction } from "@/types";
import { usePathname, useRouter } from "next/navigation";

const SettingsPage: React.FC<{ dictionary: DataTypeFromLocaleFunction }> = ({
  dictionary,
}) => {
  const { theme, toggleTheme } = useTheme();
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedLang, setSelectedLang] = useState("en");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const handleUpdateProfile = async () => {
    if (!password) {
      toast.error("Please enter a full name or a new password.");
      return;
    }

    if (password && confirmPassword !== password) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await updateUserProfile(session.data?.user?.id as string, {
        profileData: {
          password: password || undefined,
        },
      });

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message || "Update failed.");
      }
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err?.message || "An unexpected error occurred.");
    }
  };
  const changeLanguage = (newLang: string) => {
    const segments = pathname.split("/");
    segments[1] = newLang; // thay đổi lang ở index 1
    const newPath = segments.join("/");
    router.push(newPath);
  };

  // useEffect: Đồng bộ giá trị select với URL
  React.useEffect(() => {
    const segments = pathname.split("/");
    if (segments.length > 1) {
      setSelectedLang(segments[1]); // gán lang từ URL
    }
  }, [pathname]);
  const baseCardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700 text-gray-100"
      : "bg-white border-gray-200 text-gray-900";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {dictionary.settings.accountSettings}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appearance */}
        <div className={`${baseCardClasses} border rounded-lg p-6`}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Globe size={18} className="mr-2" />
            {dictionary.settings.appearance}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {dictionary.settings.theme}
              </label>
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <span className="flex items-center">
                  {theme === "dark" ? (
                    <Moon size={16} className="mr-2" />
                  ) : (
                    <Sun size={16} className="mr-2" />
                  )}
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>
                <span
                  className={
                    theme === "dark"
                      ? "text-sm text-gray-400"
                      : "text-sm text-gray-600"
                  }
                >
                  Click to toggle
                </span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {dictionary.settings.language}
              </label>
              <select
                value={selectedLang}
                onChange={(e) => changeLanguage(e.target.value)}
                className={`w-full rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                } border px-3 py-2`}
              >
                <option value="en">English</option>
                <option value="ja">Japan</option>
                <option value="kr">Korean</option>
                <option value="vi">VietNam</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {dictionary.settings.timeZone}
              </label>
              <select
                className={`w-full rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                } border px-3 py-2`}
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (ET)</option>
                <option value="PST">Pacific Time (PT)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
                <option value="JST">Japan Standard Time (JST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {/* <div className={`${baseCardClasses} border rounded-lg p-6`}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Bell size={18} className="mr-2" />
            Notifications
          </h3>

          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Email Notifications</span>
              </label>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } mt-1 ml-6`}
              >
                Receive notifications about important updates and activities
              </p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Push Notifications</span>
              </label>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } mt-1 ml-6`}
              >
                Get real-time notifications in your browser
              </p>
            </div>

            <div className="pt-4">
              <label className="block text-sm font-medium mb-1">
                Notification Frequency
              </label>
              <select
                className={`w-full rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                } border px-3 py-2`}
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly Digest</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* Security */}
        {/* <div className={`${baseCardClasses} border rounded-lg p-6`}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Lock size={18} className="mr-2" />
            Security
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Two-Factor Authentication
              </label>
              <button
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <span className="flex items-center">
                  <Shield size={16} className="mr-2" />
                  Enable 2FA
                </span>
                <span
                  className={
                    theme === "dark"
                      ? "text-sm text-gray-400"
                      : "text-sm text-gray-600"
                  }
                >
                  Not configured
                </span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Session Management
              </label>
              <button
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <span className="flex items-center">
                  <Smartphone size={16} className="mr-2" />
                  Active Sessions
                </span>
                <span
                  className={
                    theme === "dark"
                      ? "text-sm text-gray-400"
                      : "text-sm text-gray-600"
                  }
                >
                  2 devices
                </span>
              </button>
            </div>

            <div>
              <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm hover:underline mt-4">
                Reset Password
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {/* Account Settings */}
      <div className={`${baseCardClasses} border rounded-lg p-6`}>
        <h3 className="font-semibold mb-4">
          {dictionary.settings.accountSettings}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              {dictionary.settings.fullName}
            </label>
            <Input
              type="text"
              defaultValue={session.data?.user?.name || ""}
              disabled
              className={`w-full rounded-md 
                !py-2.5 !px-4 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                } border px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {dictionary.settings.emailAddress}
            </label>
            <Input
              type="email"
              disabled
              defaultValue={session.data?.user?.email || ""}
              className={`w-full rounded-md 
                !py-2.5 !px-4 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                } border px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {dictionary.settings.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              } border px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {dictionary.settings.confirmPassword}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              } border px-3 py-2 bg-opacity-50`}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-amber-600 dark:text-amber-500">
            <AlertCircle size={16} className="mr-2" />
            <span className="text-sm">
              Some settings may require approval from an administrator
            </span>
          </div>

          <button
            className="flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            onClick={handleUpdateProfile}
            disabled={!password || password !== confirmPassword}
          >
            <Save size={16} className="mr-2" />
            {dictionary.common.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
