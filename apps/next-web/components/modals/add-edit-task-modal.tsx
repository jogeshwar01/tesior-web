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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/new-york/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/new-york/popover";
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
import useWorkspace from "@/lib/swr/useWorkspace";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import useUsers from "@/lib/swr/useUsers";

const taskFormSchema = z.object({
  username: z.string({
    required_error: "Please enter github username.",
  }),
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
  showAddEditTaskModal: boolean;
  setShowAddEditTaskModal: Dispatch<SetStateAction<boolean>>;
}

export function AddEditTaskModal({
  showAddEditTaskModal,
  setShowAddEditTaskModal,
}: AddEditTaskModalProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const workspace = useWorkspace();
  const workspaceUsers = useUsers();
  const [saving, setSaving] = useState(false);

  const saveTask = async (data: any) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/task?workspaceId=${workspace.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        await response.json();
        setShowAddEditTaskModal(false);
        toast.success("Task successfully created!");

        mutate(`/api/task?workspaceId=${workspace.id}`);
      } else {
        toast.error("Failed to create task!", {
          description: response.text(),
        });
      }
    } catch (error: any) {
      console.error("Failed to create task");
      toast.error("Failed to create task!", {
        description: error?.message ?? error,
      });
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
      className="p-8 max-h-[90vh] overflow-y-auto bg-custom-black-100 border-custom-black-100"
      showModal={showAddEditTaskModal}
      setShowModal={setShowAddEditTaskModal}
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Github Username</FormLabel>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? workspaceUsers?.users?.find(
                                (user) => user?.name === field.value
                              )?.name
                            : "Select user"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search user..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {workspaceUsers?.users?.map((user) => (
                              <CommandItem
                                value={user.name}
                                key={user.name}
                                onSelect={() => {
                                  form.setValue("username", user.name);
                                }}
                                className="hover:bg-accent-3 cursor-pointer"
                              >
                                {user.name}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    user.name === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </FormItem>
            )}
          />
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
                <FormLabel>Amount (SOL) </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
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

          <Button
            type="submit"
            disabled={saving}
            className="bg-accent-2 hover:bg-accent-1 w-full"
          >
            <div className="text-white">
              {saving ? "Saving..." : "Save Task"}{" "}
            </div>
          </Button>
        </form>
      </Form>
    </Modal>
  );
}

export function useAddEditTaskModal() {
  const [showAddEditTaskModal, setShowAddEditTaskModal] = useState(false);

  const AddEditTaskModalCallback = useCallback(
    () => (
      <AddEditTaskModal
        showAddEditTaskModal={showAddEditTaskModal}
        setShowAddEditTaskModal={setShowAddEditTaskModal}
      />
    ),
    [showAddEditTaskModal, setShowAddEditTaskModal]
  );

  return useMemo(
    () => ({
      setShowAddEditTaskModal,
      AddEditTaskModal: AddEditTaskModalCallback,
    }),
    [setShowAddEditTaskModal, AddEditTaskModalCallback]
  );
}
