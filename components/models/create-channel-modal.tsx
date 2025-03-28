"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChannelType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";
import {
    Dialog,
    DialogContent,
    DialogFooter,
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { use, useEffect } from "react";

const formSchema = z.object({
    name: z.string()
        .min(1, { message: "Channel name is required" })
        .refine(
            name => name.toLowerCase() !== "general",
            { message: "Channel name cannot be 'general'" }
        ),
    type: z.nativeEnum(ChannelType)
});

type FormValues = z.infer<typeof formSchema>;

export const CreateChannelModal = () => {
    const { isOpen, closeModal, type, data } = useModal();
    const router = useRouter();
    const params = useParams();
    const isModalOpen = isOpen && type === "createChannel";
    const { channelType } = data;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channelType || ChannelType.TEXT
        }
    });

    useEffect(() => {
        if (channelType) {
            form.setValue("type", channelType);
        } else {
            form.setValue("type", ChannelType.TEXT);
        }
    }, [channelType, form]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: FormValues) => {
        try {
            console.log("Submitting channel with type:", values.type); // Debug log

            const serverId = params?.serverId;
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: serverId
                }
            });

            // Ensure we're explicitly setting the type in the request
            const response = await axios.post(url, {
                name: values.name,
                type: values.type
            });

            console.log("Channel created:", response.data); // Debug log

            form.reset();
            router.refresh();
            closeModal();
        } catch (error) {
            console.error("Error creating channel:", error);
        }
    };

    // Handle type change explicitly
    const handleTypeChange = (value: ChannelType) => {
        console.log("Channel type changed to:", value); // Debug log
        form.setValue("type", value);
    };

    const handleClose = () => {
        form.reset();
        closeModal();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create Channel
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-6 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                                            Channel name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isLoading}
                                                placeholder="Enter channel name"
                                                className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                                            Channel Type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={handleTypeChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="border-0 bg-zinc-300/50 text-black capitalize outline-none focus:ring-0 focus:ring-offset-0"
                                                >
                                                    <SelectValue placeholder="Select channel type">
                                                        {field.value.toLowerCase()}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className="capitalize"
                                                    >
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="px-6 py-4 bg-gray-100">
                            <div className="flex items-center justify-between w-full gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    className="hover:bg-zinc-300/50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isLoading}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white"
                                >
                                    Create Channel
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
