import { CustomSlider } from "@/_modules/components/custom-slider";
import Loading from "@/_modules/components/loading";
import { DeleteBotModal } from "@/_modules/components/ModalDeleteBot";
import { useBots } from "@/_modules/contexts/BotsContext";
import { useTheme } from "@/_modules/contexts/ThemeContext";
import { activeBot, settingPrompt, updateChatBot } from "@/app/actions/bots";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DataTypeFromLocaleFunction, OPENAI_MODELS } from "@/types";
import { Database } from "@/types/database.type";
import { CheckCircle, CircleOff, Play, Save, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  bot: Database["public"]["Tables"]["bots"]["Row"];
  dictionary: DataTypeFromLocaleFunction;
  prompt: string;
  similarityThreshold: number;
  topN: number;
  emptyResponse: string;
  setPrompt: (prompt: string) => void;
  setSimilarityThreshold: (similarityThreshold: number) => void;
  setTopN: (topN: number) => void;
  setEmptyResponse: (emptyResponse: string) => void;
  model: string;
  setModel: (model: string) => void;
  temperature: number;
  setTemperature: (temperature: number) => void;
  topP: number;
  setTopP: (topP: number) => void;
  frequencyPenalty: number;
  setFrequencyPenalty: (frequencyPenalty: number) => void;
  presencePenalty: number;
  setPresencePenalty: (presencePenalty: number) => void;
}
type FormValues = {
  name: string;
  description: string;
  dataSetId: string;
};
export default function TabSetting({
  bot,
  dictionary,
  prompt,
  similarityThreshold,
  topN,
  emptyResponse,
  setPrompt,
  setSimilarityThreshold,
  setTopN,
  setEmptyResponse,
  model,
  setModel,
  temperature,
  setTemperature,
  topP,
  setTopP,
  frequencyPenalty,
  setFrequencyPenalty,
  presencePenalty,
  setPresencePenalty,
}: Props) {
  const { theme } = useTheme();
  const { datasets, setBots } = useBots();
  const params = useParams();
  const router = useRouter();
  const [isLoadingChangeBot, setIsLoadingChangeBot] =
    React.useState<boolean>(false);
  const [isSavePrompt, setIsSavePrompt] = React.useState<boolean>(false);
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
    setIsLoadingChangeBot(true);
    try {
      const res = await updateChatBot(params.id as string, data);
      if (!res.success) {
        toast.error(res.message);
      }
      setBots((prev) => {
        const updatedBots = prev.map((b) => {
          if (b.id === bot.id) {
            return { ...b, ...data };
          }
          return b;
        });
        return updatedBots;
      });
      toast.success(res.message);
      router.refresh();
    } catch (error) {
      console.error("Error updating bot:", error);
      toast.error("Failed to update bot. Please try again.");
    } finally {
      setIsLoadingChangeBot(false);
    }
  };
  const inputStyle = `w-full rounded-md ${
    theme === "dark"
      ? "bg-gray-700 border-gray-600"
      : "bg-white border-gray-300"
  } border px-3 py-2 focus:ring-blue-500 focus:border-blue-500`;
  const handleSetStatusBot = async () => {
    const res = await activeBot(params.id as string, !bot.isActive);
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      router.refresh();
    }
  };
  const handleSettingPrompt = async () => {
    setIsSavePrompt(true);
    const createdById = datasets.find(
      (dataset) => dataset.id === bot.dataSetId
    )?.createdById;
    try {
      const res = await settingPrompt(
        params.id as string,
        {
          prompt: prompt,
          similarity_threshold: similarityThreshold,
          top_n: topN,
          empty_response: emptyResponse,
        },
        {
          model_name: model,
          temperature: temperature,
          top_p: topP,
          frequency_penalty: frequencyPenalty,
          presence_penalty: presencePenalty,
        },

        createdById
      );
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.refresh();
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast.error("Failed to save prompt. Please try again.");
    } finally {
      setIsSavePrompt(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className={`${baseCardClasses} rounded-lg border p-6`}>
        <h3 className="font-semibold mb-4">
          {dictionary.chatbots.chatbotSettings}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">
              {dictionary.chatbots.chatbotName}
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
              {dictionary.common.description}
            </Label>
            <textarea
              {...register("description")}
              rows={3}
              className={inputStyle}
            ></textarea>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1">
              {dictionary.chatbots.linkedKnowledgeBase}
            </Label>
            <select {...register("dataSetId")} className={inputStyle}>
              {listOptionDatasets.map((dataset) => (
                <option key={dataset.value} value={dataset.value}>
                  {dataset.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className={`flex items-center px-4 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-colors`}
            >
              {isLoadingChangeBot ? (
                <Loading />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {dictionary.common.saveChanges}
            </button>
          </div>
        </form>
      </div>
      <div className={`${baseCardClasses} rounded-lg border p-6`}>
        <h3 className="font-semibold mb-4">
          {dictionary.chatbots.settingsPrompt}
        </h3>
        <div>
          <p className="text-sm font-semibold mb-1.5">
            {dictionary.chatbots.prompt}
          </p>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={`w-full rounded-md ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            } border px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
            rows={12}
            placeholder="Enter your prompt here..."
          />
        </div>
        <div className="mt-6">
          <p className="font-medium text-sm mb-3">
            {dictionary.chatbots.similarityThreshold}
          </p>
          <CustomSlider
            className="w-xl"
            value={[similarityThreshold]}
            onChange={(value) => setSimilarityThreshold(value[0])}
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <div className="mt-6">
          <p className="font-medium text-sm mb-3">Top N</p>
          <CustomSlider
            className="w-xl"
            value={[topN]}
            onChange={(value) => setTopN(value[0])}
            min={0}
            max={30}
            step={1}
          />
        </div>
        <div className="mt-6">
          <p className="font-medium text-sm mb-3">
            {dictionary.chatbots.emptyResponse}
          </p>
          <Textarea
            value={emptyResponse}
            onChange={(e) => setEmptyResponse(e.target.value)}
            className={`w-full rounded-md ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            } border px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
            rows={4}
            placeholder="Enter your empty response here..."
          />
        </div>
        <h3 className="font-semibold mb-4 mt-6">Setting model</h3>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Chọn mô hình OpenAI" />
          </SelectTrigger>
          <SelectContent>
            {OPENAI_MODELS.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-6">
          <p className="font-medium text-sm mb-3">Temperature</p>
          <CustomSlider
            className="w-xl"
            value={[temperature]}
            onChange={(value) => setTemperature(value[0])}
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <div className="mt-6">
          <p className="font-medium text-sm mb-3">Top P</p>
          <CustomSlider
            className="w-xl"
            value={[topP]}
            onChange={(value) => setTopP(value[0])}
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <div className="mt-6">
          <p className="font-medium text-sm mb-3">Frequency Penalty</p>
          <CustomSlider
            className="w-xl"
            value={[frequencyPenalty]}
            onChange={(value) => setFrequencyPenalty(value[0])}
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <div className="mt-6">
          <p className="font-medium text-sm mb-3">Presence Penalty</p>
          <CustomSlider
            className="w-xl"
            value={[presencePenalty]}
            onChange={(value) => setPresencePenalty(value[0])}
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <button
          type="submit"
          className={`flex items-center px-4 py-2 rounded-md mt-6 ${
            theme === "dark"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white transition-colors`}
          onClick={handleSettingPrompt}
        >
          {isSavePrompt ? <Loading /> : <Play size={16} className="mr-2" />}
          {dictionary.common.saveChanges}
        </button>
      </div>

      <div className={`${baseCardClasses} rounded-lg border p-6`}>
        <h3 className="font-semibold text-red-600 dark:text-red-400 mb-4">
          {dictionary.chatbots.dangerZone}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Deactivate Chatbot</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {dictionary.chatbots.temporarilyDisableThisChatbot}
              </p>
            </div>
            <button
              className={`px-4 py-2 rounded-md  ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-200 border border-gray-200"
              } 
              ${
                bot.isActive === true
                  ? "text-yellow-600 hover:text-yellow-700 "
                  : "text-green-600 hover:text-green-700 "
              } transition-colors flex items-center`}
              onClick={handleSetStatusBot}
            >
              {bot.isActive === true ? (
                <CircleOff size={16} className="mr-2" />
              ) : (
                <CheckCircle size={16} className="mr-2" />
              )}
              {bot.isActive === true
                ? dictionary.chatbots.deactivate
                : dictionary.chatbots.active}
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                {dictionary.chatbots.deleteChatbot}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {dictionary.chatbots.permanentlyDeleteThisChatbotAndAllItsData}
              </p>
            </div>
            <button
              onClick={() => setOpenDeleteModal(true)}
              className="px-4 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors flex items-center"
            >
              <Trash2 size={16} className="mr-2" />
              {dictionary.common.delete}
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
