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

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const baseCardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700 text-gray-100"
      : "bg-white border-gray-200 text-gray-900";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appearance */}
        <div className={`${baseCardClasses} border rounded-lg p-6`}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Globe size={18} className="mr-2" />
            Appearance
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
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
              <label className="block text-sm font-medium mb-1">Language</label>
              <select
                className={`w-full rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                } border px-3 py-2`}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Time Zone
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
        <h3 className="font-semibold mb-4">Account Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className={`w-full rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              } border px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              className={`w-full rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              } border px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              className={`w-full rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              } border px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className={`w-full rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              } border px-3 py-2 bg-opacity-50 cursor-not-allowed`}
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

          <button className="flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors">
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
