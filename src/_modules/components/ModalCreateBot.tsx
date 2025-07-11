"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useBots } from "../contexts/BotsContext";
import { DataTypeFromLocaleFunction } from "@/types";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate: (
    name: string,
    description: string,
    settings: Record<string, any>,
    dataSetId: string,
    createdById: string | undefined
  ) => Promise<void>;
  dictionary: DataTypeFromLocaleFunction;
}
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  model: z.enum(["gpt-3.5-turbo", "nxchat-internal", "gpt-4.0"]),
  dataSetId: z.string().min(1, "Dataset is required"),
});

type FormValues = z.infer<typeof schema>;

export default function ModalCreateBot({
  open,
  setOpen,
  onCreate,
  dictionary,
}: Props) {
  const { datasets } = useBots();
  const [isLoading, setIsLoading] = React.useState(false);
  const listOptionDatasets = datasets.map((dataset) => ({
    value: dataset.id,
    label: dataset.name,
  }));
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      model: "nxchat-internal",
      dataSetId: "",
    },
  });
  React.useEffect(() => {
    if (datasets.length > 0) {
      form.setValue("dataSetId", datasets[0].id);
    }
  }, [datasets, form]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const createdById = datasets.find(
      (dataset) => dataset.id === data.dataSetId
    )?.createdById;
    try {
      await onCreate(
        data.name,
        data.description,
        { model: data.model },
        data.dataSetId,
        createdById
      );
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating bot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg dark:bg-gray-900">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-5">
          <DialogTitle>{dictionary.chatbots.createNewChatbot}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-0.5">
                    {dictionary.chatbots.chatbotName}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={dictionary.chatbots.chatbotName}
                      {...field}
                      className="px-3.5 py-2.5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-0.5">
                    {dictionary.common.description}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short summary of the bot’s purpose"
                      rows={3}
                      {...field}
                      className="px-3.5 py-2.5 bg-white dark:bg-gray-900"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Model (Radio Group) */}
            {/* <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2.5">Model</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex gap-4"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {["gpt-3.5-turbo", "nxchat-internal", "gpt-4.0"].map(
                        (model) => (
                          <div
                            key={model}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={model} id={model} />
                            <FormLabel htmlFor={model} className="capitalize">
                              {model}
                            </FormLabel>
                          </div>
                        )
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Max Tokens (Select) */}
            {listOptionDatasets.length > 0 && (
              <FormField
                control={form.control}
                name="dataSetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2.5">
                      {dictionary.knowledge.datasetName}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select dataset" />
                        </SelectTrigger>
                        <SelectContent>
                          {listOptionDatasets.map((item, index) => (
                            <SelectItem key={index} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                {dictionary.common.cancel}
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-gray-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {dictionary.common.create}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
