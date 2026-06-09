'use client'
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";

const page = () => {

    const signUpSchema = z.object({
        sender: z.string().optional(),
        username: z.string().min(3, "Minimum 3 character require"),
        content: z.string().min(3, "Minimum 3 character require").max(500, "Maximum 500 character require"),
    });
    type formSchema = z.infer<typeof signUpSchema>;
    const form = useForm<formSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            sender: '',
            content: '',
            username: '',
        }
    });

    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [username, SetUsername] = useState('');
    const debounced = useDebounceCallback(SetUsername, 2000); /// for using debounceCallback setUsername get it's value after 2sc. Using debounced('value'). on every change in debounced setUsername get it's value in 2sc delay
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);


    useEffect(() => {
        const checkUserNameUnique = async () => {
            if (username.length < 3) {
                return
            }
            setIsCheckingUsername(true);
            const expectedPrefix = `${window.location.origin}/u/`;
            const enteredUrl = username;
            console.log(expectedPrefix)
            if (!enteredUrl.startsWith(expectedPrefix)) {
                setUsernameMessage('This username is available.');
                setIsUsernameAvailable(false);
                setIsCheckingUsername(false);
                return
            }

            setUsernameMessage('');
            try {
                const { data } = await axios.get(`/api/check-username-unique?username=${username.split("/u/")[1]}`);
                if (data.success) {
                    setUsernameMessage(data.message);
                    setIsUsernameAvailable(false);
                }
            } catch (error) {
                const apiError: any = error as AxiosError;
                console.log("User name checking error", apiError.response?.data.message ?? "error");
                setUsernameMessage(apiError.response?.data.message ?? "Unknown error")
                setIsUsernameAvailable(true);
            } finally {
                setIsCheckingUsername(false);
            }
        }
        checkUserNameUnique();
    }, [username])


    const handleSendMessage = async (data: formSchema) => {
        if (!isUsernameAvailable) {
            return toast.warning("User name is not available change now")
        }
        if (isCheckingUsername) {
            return toast.warning("wait")
        }
        if (isSendingMessage) {
            return toast.warning("wait")
        }
        setIsSendingMessage(true);

        try {
            const res = await axios.post('/api/send-message', {
                username: username.split("/u/")[1],
                content: data.content,
                sender: data.sender,
            })
            console.log(res)
            if (res.data.success) {
                toast.success(res.data.message);
                // form.reset();
                form.setValue("content", "");
            }
        } catch (error) {
            const apiErr: any = error as AxiosError
            console.log(apiErr.response?.data.message);
            toast.error(apiErr.response?.data.message ?? "Api error")
        }
        finally {
            setIsSendingMessage(false);
        }
    }





    return (
        <main className="min-h-full bg-background px-4">
            <div className="mx-auto max-w-2xl mt-18 border-0">
                {/* Heading */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold ">
                        Send Anonymous Message
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Share your thoughts honestly. Your identity will remain private.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border bg-card p-4 shadow-sm md:py-6 md:px-8">
                    {/* <form > */}
                    <form onSubmit={form.handleSubmit(handleSendMessage)}>
                        <FieldSet>
                            <div className="space-y-4 md:space-y-2">
                                {/* Sender Name */}
                                <Controller name='sender' control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-0">
                                            <FieldLabel htmlFor="sender"
                                                className="text-sm font-medium">Sender Name
                                            </FieldLabel>
                                            <Input {...field}
                                                id='sender'
                                                type="text"
                                                placeholder='Your name (optional)'
                                                aria-invalid={fieldState.invalid}
                                                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                                                onChange={(e) => {
                                                    field.onChange(e); // this use for fill the text field 
                                                }}
                                            />
                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />
                                {/* Sending message to */}
                                <Controller name='username' control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-0">
                                            {/* Sender Name */}
                                            <FieldLabel htmlFor="username"
                                                className="text-sm font-medium">Message sending link
                                            </FieldLabel>
                                            <Input {...field}
                                                id='username'
                                                type="text"
                                                placeholder='Enter a valid link: http://localhost:3000/u/Susanat'
                                                aria-invalid={fieldState.invalid}
                                                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                                                onChange={(e) => {
                                                    setUsernameMessage('');
                                                    field.onChange(e); // this use for fill the text field 
                                                    debounced(e.target.value); // this debounced set setUsername value after 2sc
                                                }}
                                            />
                                            <div className='flex gap-2'>
                                                {isCheckingUsername && <p className='inline-block'>
                                                    <Loader2 className='animate-spin' /></p>
                                                }
                                                {usernameMessage &&
                                                    <p className={`text-[14px] tracking-tight ${usernameMessage === "This username is already taken." ? "text-green-400" : "text-red-600"}`}>
                                                        {usernameMessage === "This username is already taken." ? "Valid link" : "No user found. Invalid link"}
                                                        {/* {
                                                            usernameMessage === "Invalid url" &&
                                                            <span>Invalid url</span>
                                                        }
                                                        {
                                                            usernameMessage === "This username is already taken." &&
                                                            <span>User found</span>
                                                        }
                                                        {
                                                            usernameMessage === "This username is available." &&
                                                            <span>User not found</span>
                                                        } */}

                                                    </p>
                                                }
                                            </div>
                                            {!usernameMessage &&
                                                fieldState.invalid && <FieldError errors={[fieldState.error]} />
                                            }
                                        </Field>
                                    )}
                                />
                                {/* Message */}
                                <Controller name='content' control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-0">
                                            <FieldLabel htmlFor="content"
                                                className="text-sm font-medium">Message
                                            </FieldLabel>
                                            <textarea {...field}
                                                id="content"
                                                rows={6}
                                                placeholder="Write your message here..."
                                                className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:ring-2"
                                                aria-invalid={fieldState.invalid}
                                                onChange={(e) => {
                                                    field.onChange(e); // this use for fill the text field 
                                                }}
                                            />

                                            <div className="flex justify-between items-center mb-1">
                                                <FieldError errors={[fieldState.error]} />
                                                {/* <span className="text-xs text-muted-foreground">
                                                    0 / 500
                                                </span> */}
                                            </div>
                                        </Field>
                                    )}
                                />

                            </div>
                        </FieldSet>

                        {/* Button */}
                        <Field>
                            <Button
                                type="submit"
                                className="w-full h-10 rounded-lg bg-black py-3 font-medium text-white transition hover:opacity-90"
                            >
                                Send Message
                            </Button>
                        </Field>
                    </form>
                </div>

                {/* Privacy Notice */}
                <div className="mt-4 rounded-xl border p-3 text-sm text-muted-foreground">
                    🔒 Your message will be delivered anonymously.
                    Please be respectful and avoid abusive content.
                </div>
            </div >
        </main >
    );
}

export default page