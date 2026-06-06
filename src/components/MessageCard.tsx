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




const MessageCard = () => {
    return (
        <>
            <Card className="w-70">
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                    <CardAction>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="bg-[#ffffff00]">
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
                                    <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </CardAction>
                </CardHeader>
                <CardContent>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum facilis velit ullam minus voluptatem reprehenderit aliquid error et quod saepe.</p>
                </CardContent>
                {/* <CardFooter>
                    <p>Card Footer</p>
                </CardFooter> */}
            </Card>
        </>
    )
}

export default MessageCard
