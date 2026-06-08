'use client'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Trash2Icon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { deleteMessage } from "@/store/slices/MessageSlice";


const MessageCard = ({ messageObj }: any) => {

    const dispatch = useDispatch();

    const [messageOpen, setMessageOpen] = useState(false);
    const { data: session, status } = useSession();
    let name = session?.user.username;

    if (!name) return;

    const handleMessageDelete = async (_id: string) => {
        try {
            const { data } = await axios.delete('/api/delete-message', {
                data: {
                    username: name,
                    messageId: _id,
                },
            });
            if (data.success) {
                toast.success(data.message);
                dispatch(deleteMessage(_id));
            }
        } catch (error) {
            const apiErr: any = error as AxiosError;
            console.log(apiErr, 'error')
            toast.error(apiErr.response?.data.message ?? "User message not get");
        }
    }





    return (
        <>
            <Card className="w-full md:w-70 h-36">
                <CardHeader>
                    <CardTitle className="text-base">{messageObj.sender}</CardTitle>
                    <CardDescription className="text-[12px]">
                        {new Date(messageObj.createdAt).toLocaleString()}
                    </CardDescription>
                    <CardAction>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="bg-[#ffffff00] cursor-pointer">
                                    <Trash2Icon className="w-5 h-5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                        <Trash2Icon />
                                    </AlertDialogMedia>
                                    <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete this message.
                                        {/* View{" "} <a href="#">Settings</a> delete any memories saved during this chat. */}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                                    <AlertDialogAction variant="destructive" onClick={() => handleMessageDelete(messageObj._id)} >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </CardAction>
                </CardHeader>
                <CardContent className="text-base" onClick={() => {
                    setMessageOpen(true)
                }}>
                    <p className="line-clamp-2 cursor-pointer">
                        {messageObj.content}
                    </p>
                </CardContent>
                <AlertDialog open={messageOpen} onOpenChange={setMessageOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{messageObj.sender}</AlertDialogTitle>
                            <AlertDialogDescription asChild>
                                <div className="whitespace-pre-wrap text-foreground">
                                    {messageObj.content}
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            {/* <AlertDialogAction variant="destructive" className="hidden">Delete</AlertDialogAction> */}
                            <AlertDialogCancel className="">Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Card>
        </>
    )
}

export default MessageCard
