import { DeleteBotModal } from "@/_modules/components/ModalDeleteBot";
import { useBots } from "@/_modules/contexts/BotsContext";
import { useTheme } from "@/_modules/contexts/ThemeContext";
import { updateChatBot } from "@/app/actions/bots";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database } from "@/types/database.type";
import { CircleOff, Play, Save, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  bot: Database["public"]["Tables"]["bots"]["Row"];
}
type FormValues = {
  name: string;
  description: string;
  dataSetId: string;
};
export default function TabSetting({ bot }: Props) {
  const { theme } = useTheme();
  const { datasets } = useBots();
  const params = useParams();
  const router = useRouter();
  const listOptionDatasets = datasets.map((dataset) => ({
    value: dataset.id,
    label: dataset.name,
  }));
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const baseCardClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: bot.name,
      description: bot.description,
      dataSetId: bot.dataSetId,
    },
  });
  const onSubmit = async (data: FormValues) => {
    const res = await updateChatBot(params.id as string, data);
    if (!res.success) {
      toast.error(res.message);
    }
    toast.success(res.message);
    router.refresh();
  };

  const inputStyle = `w-full rounded-md ${
    theme === "dark"
      ? "bg-gray-700 border-gray-600"
      : "bg-white border-gray-300"
  } border px-3 py-2 focus:ring-blue-500 focus:border-blue-500`;
  return (
    <div className="space-y-6">
      <div className={`${baseCardClasses} rounded-lg border p-6`}>
        <h3 className="font-semibold mb-4">Chatbot Settings</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">
              Chatbot Name
            </Label>
            <Input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={inputStyle}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1">
              Description
            </Label>
            <textarea
              {...register("description")}
              rows={3}
              className={inputStyle}
            ></textarea>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1">
              Linked Knowledge Base
            </Label>
            <select {...register("dataSetId")} className={inputStyle}>
              {listOptionDatasets.map((dataset) => (
                <option key={dataset.value} value={dataset.value}>
                  {dataset.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Label className="flex items-center">
              <Input
                type="checkbox"
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Active</span>
            </Label>

            <button
              type="submit"
              className={`flex items-center px-4 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-colors`}
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${baseCardClasses} rounded-lg border p-6`}>
          <h3 className="font-semibold mb-4">Response Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Response Style
              </label>
              <select
                className={`w-full rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } border px-3 py-2`}
              >
                <option>Friendly and Helpful</option>
                <option>Concise and Direct</option>
                <option>Technical and Detailed</option>
                <option>Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Maximum Response Length
              </label>
              <input
                type="number"
                defaultValue={150}
                className={`w-full rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } border px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of words in a response
              </p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Include citations in responses</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Allow follow-up questions</span>
              </label>
            </div>
          </div>
        </div>

        <div className={`${baseCardClasses} rounded-lg border p-6`}>
          <h3 className="font-semibold mb-4">Training Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Training Frequency
              </label>
              <select
                className={`w-full rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } border px-3 py-2`}
              >
                <option>Manual only</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>When knowledge base updates</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Model Type
              </label>
              <select
                className={`w-full rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } border px-3 py-2`}
              >
                <option>Standard</option>
                <option>Advanced</option>
                <option>Enterprise</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Advanced and Enterprise models require additional credits
              </p>
            </div>

            <div className="pt-4">
              <button
                className={`flex items-center px-4 py-2 rounded-md ${
                  theme === "dark"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white transition-colors w-full justify-center`}
              >
                <Play size={16} className="mr-2" />
                Start Training
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Last trained: 3 days ago
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${baseCardClasses} rounded-lg border p-6`}>
        <h3 className="font-semibold text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Deactivate Chatbot</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Temporarily disable this chatbot
              </p>
            </div>
            <button
              className={`px-4 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors flex items-center`}
            >
              <CircleOff size={16} className="mr-2" />
              Deactivate
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h4 className="font-medium">Delete Chatbot</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Permanently delete this chatbot and all its data
              </p>
            </div>
            <button
              onClick={() => setOpenDeleteModal(true)}
              className="px-4 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors flex items-center"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
      <DeleteBotModal
        open={openDeleteModal}
        close={() => setOpenDeleteModal(false)}
        botId={bot.id}
        botName={bot.name}
      />
    </div>
  );
}
