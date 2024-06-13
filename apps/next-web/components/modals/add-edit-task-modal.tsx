"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/new-york/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/new-york/form";
import { Input } from "@/components/ui/new-york/input";
import { toast } from "sonner";
import { mutate } from "swr";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Modal } from "@/components/shared";

const taskFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(30, {
      message: "Title must not be longer than 30 characters.",
    }),
  contact: z.string({
    required_error: "Please enter contact.",
  }),
  proof: z.string({
    required_error: "Please enter proof.",
  }),
  amount: z.number({
    required_error: "Please enter amount.",
  }),
});

type ProfileFormValues = z.infer<typeof taskFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  title: "Github PR",
};

interface AddEditTaskModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export function AddEditTaskModal({
  showModal,
  setShowModal,
}: AddEditTaskModalProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const [saving, setSaving] = useState(false);

  const saveTask = async (data: any) => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await response.json();
      setShowModal(false);
      toast.success("Task successfully created!");

      mutate("/api/user/task");
    } catch (error) {
      console.error("Failed to create task", error);
      toast.error("Failed to create task!");
    } finally {
      setSaving(false);
    }
  };

  function onSubmit(data: ProfileFormValues) {
    // set expand={true} in Toaster
    // toast.custom((t) => (
    //   <div>
    //     You submitted the following data:
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   </div>
    // ));
    saveTask(data);
  }

  return (
    <Modal
      className="p-8 max-h-[90vh] overflow-y-auto"
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <h3 className="text-lg font-medium">Add Task</h3>
      <p className="text-sm text-muted-foreground pb-4">
        Fill out the form below to add a task.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 overflow-y-auto transform scale-90"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  Describe the task you have completed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input placeholder="9876543210" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your contact information.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="proof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proof</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github/com/code100x/cms/pulls/1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Give a link to the proof of your work.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount ($) </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    {...field}
                    onChange={(event) =>
                      field.onChange(+event.target.valueAsNumber)
                    }
                  />
                  {/* by default input returns "string" type unless read as valueAsNumber so need onChange */}
                </FormControl>
                <FormDescription>Expected amount for the task.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Task"}
          </Button>
        </form>
      </Form>
    </Modal>
  );
}

export function useAddEditTaskModal() {
  const [showModal, setShowModal] = useState(false);

  const AddEditTaskModalCallback = useCallback(
    () => (
      <AddEditTaskModal showModal={showModal} setShowModal={setShowModal} />
    ),
    [showModal, setShowModal]
  );

  return useMemo(
    () => ({
      setShowModal,
      AddEditTaskModal: AddEditTaskModalCallback,
    }),
    [setShowModal, AddEditTaskModalCallback]
  );
}
