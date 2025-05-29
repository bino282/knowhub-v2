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

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate: (
    name: string,
    description: string,
    settings: Record<string, any>
  ) => Promise<void>;
}
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  model: z.enum(["gpt-3.5-turbo", "nxchat", "gpt-4.0"]),
  maxTokens: z.enum(["600", "1024", "2000"]),
});

type FormValues = z.infer<typeof schema>;

export default function ModalCreateBot({ open, setOpen, onCreate }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      model: "gpt-3.5-turbo",
      maxTokens: "600",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await onCreate(data.name, data.description, {
      model: data.model,
      maxTokens: parseInt(data.maxTokens, 10),
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg dark:bg-gray-900">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-5">
          <DialogTitle>Create a new bot</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-0.5">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Bot name..."
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
                  <FormLabel className="mb-0.5">Description</FormLabel>
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
            <FormField
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
                      {["gpt-3.5-turbo", "nxchat", "gpt-4.0"].map((model) => (
                        <div
                          key={model}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={model} id={model} />
                          <FormLabel htmlFor={model} className="capitalize">
                            {model}
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max Tokens (Select) */}
            <FormField
              control={form.control}
              name="maxTokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2.5">Max Tokens</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select max tokens" />
                      </SelectTrigger>
                      <SelectContent>
                        {["600", "1024", "2000"].map((token) => (
                          <SelectItem key={token} value={token}>
                            {token}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-gray-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
