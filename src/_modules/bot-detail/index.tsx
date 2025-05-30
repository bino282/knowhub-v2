"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CheckCircle,
  Clock3,
  MessageSquare,
  User,
  ZapIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const conversations = [
  {
    name: "John Smith",
    initials: "JS",
    message: "How do I reset my password?",
    time: "10 minutes ago",
    status: "Resolved",
  },
  {
    name: "Emily Davis",
    initials: "ED",
    message: "What is your refund policy?",
    time: "32 minutes ago",
    status: "Resolved",
  },
  {
    name: "Michael Wong",
    initials: "MW",
    message: "I can’t access my account after the latest update",
    time: "1 hour ago",
    status: "Pending",
  },
  {
    name: "Sarah Johnson",
    initials: "SJ",
    message: "When will my order be shipped?",
    time: "2 hours ago",
    status: "Resolved",
  },
  {
    name: "David Kim",
    initials: "DK",
    message: "How do I cancel my subscription?",
    time: "3 hours ago",
    status: "Resolved",
  },
];
const data = [
  { name: "Mon", interactions: 300 },
  { name: "Tue", interactions: 500 },
  { name: "Wed", interactions: 350 },
  { name: "Thu", interactions: 600 },
  { name: "Fri", interactions: 250 },
  { name: "Sat", interactions: 400 },
  { name: "Sun", interactions: 450 },
];
const dataPieChart = [
  { name: "Resolved", value: 76 },
  { name: "Unresolved", value: 24 },
];
const COLORS = ["#a855f7", "#6b7280"];
export default function PageBotDetail() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Support Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Handles common customer questions and support tickets
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white dark:bg-gray-800">
            Test Chatbot
          </Button>
          <Button
            variant="outline"
            className="bg-blue-500 text-white font-semibold"
          >
            Embeded
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon={<MessageSquare />}
              title="Total Interactions"
              value="2,456"
              change="+18%"
            />
            <StatCard
              icon={<User />}
              title="Users"
              value="1,876"
              change="+5%"
            />
            <StatCard
              icon={<ZapIcon />}
              title="Avg. Response Time"
              value="1.2s"
              change="-15%"
            />
            <StatCard
              icon={<CheckCircle />}
              title="Accuracy"
              value="87%"
              change="+2%"
            />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-8">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Daily Interactions</h2>
                  <select className="bg-white dark:bg-gray-600 border-gray-500 border rounded px-2 py-1 text-sm">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data}>
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Bar
                      dataKey="interactions"
                      fill="#a855f7"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6 flex flex-col justify-center items-center text-center">
                <div className="w-full h-64 flex flex-col items-center justify-center">
                  <h2 className="text-lg font-semibold mb-4">
                    Query Resolution
                  </h2>
                  <div className="relative w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dataPieChart}
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="value"
                          stroke="none"
                        >
                          {dataPieChart.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-bold">76%</p>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground text-center flex items-center gap-6">
                    <p>
                      <span className="text-purple-500 font-bold">●</span>{" "}
                      Resolved (76%)
                    </p>
                    <p>
                      <span className="text-gray-500 font-bold">●</span>{" "}
                      Unresolved (24%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-white dark:bg-gray-800 mt-8">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Conversations</h2>
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  View all
                </a>
              </div>
              <div className="space-y-4">
                {conversations.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b border-gray-700 pb-3"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm">
                        {c.initials}
                      </div>
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {c.message}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">{c.time}</p>
                      <div
                        className={cn("flex items-center justify-end gap-1", {
                          "text-green-400": c.status === "Resolved",
                          "text-yellow-400": c.status === "Pending",
                        })}
                      >
                        {c.status === "Resolved" ? (
                          <CheckCircle size={14} />
                        ) : (
                          <Clock3 size={14} />
                        )}
                        <span>{c.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">aaa</TabsContent>
      </Tabs>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  change,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}) {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-green-500">{change} vs last month</p>
      </CardContent>
    </Card>
  );
}
