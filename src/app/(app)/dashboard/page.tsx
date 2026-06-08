'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addMessages } from '@/store/slices/MessageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, RefreshCwIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const page = () => {
  const dispatch = useDispatch();

  const [isAcceptingSwitchLoading, setIsAcceptingSwitchLoading] = useState(false);
  const [isMessageRefreshing, setIsMessageRefreshing] = useState(false);


  const messagesArr = useSelector((state: any) => {
    return state.messages
  })


  const messageAcceptingSchema = z.object({
    isAcceptingMessage: z.boolean(),
  })
  type messageAcceptingType = z.infer<typeof messageAcceptingSchema>
  const form = useForm<messageAcceptingType>({
    resolver: zodResolver(messageAcceptingSchema)
  });

  const {
    register,  // connect input field to form
    watch,     // read value live
    setValue  // change value manually
  } = form;
  const acceptMessageStatus: any = watch("isAcceptingMessage"); // where watch read value and set in this variable


  useEffect(() => {
    const fetchMessageAcceptingStatus = async () => {
      setIsAcceptingSwitchLoading(true);
      try {
        const { data } = await axios.get('/api/accept-messages');
        if (data.success) {
          setValue("isAcceptingMessage", data.isAcceptingMessage); // this fun require two filed
        }
      } catch (error) {
        const apiErr: any = error as AxiosError
        console.log(apiErr.response, 'error')
      } finally {
        setIsAcceptingSwitchLoading(false);
      }
    }
    fetchMessageAcceptingStatus();
  }, [])


  const handleAcceptingMessageChange = async () => {
    if (isAcceptingSwitchLoading) {
      return
    }
    setIsAcceptingSwitchLoading(true);
    try {
      const { data } = await axios.post('/api/accept-messages', {
        acceptMessages: !acceptMessageStatus
      });
      if (data.success) {
        setValue("isAcceptingMessage", data.updatedUser.isAcceptingMessage);
        toast.success(data.message);
      }
    } catch (error) {
      const apiErr: any = error as AxiosError;
      console.log(apiErr.response, 'error')
      toast.error(apiErr.response?.data.message ?? "Accepting message status not update.");
    } finally {
      setIsAcceptingSwitchLoading(false);
    }
  }

  const handleMessageRefreshing = async () => {
    if (isMessageRefreshing) {
      return;
    }
    setIsMessageRefreshing(true);
    try {
      const { data } = await axios.get('/api/get-messages');
      if (data.success) {
        toast.success(data.message);
        console.log(data.messages);
        dispatch(addMessages(data.messages))

      }
    } catch (error) {
      const apiErr: any = error as AxiosError;
      console.log(apiErr, 'error')
      toast.error(apiErr.response?.data.message ?? "User message not get");
    } finally {
      setIsMessageRefreshing(false);
    }
  }

  useEffect(() => {
    handleMessageRefreshing();
  }, [])

  const [copyUrl, setCopyUrl] = useState("");

  const { data: session } = useSession();
  const user = session?.user.username;

  useEffect(() => {
    if (user) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setCopyUrl(`${baseUrl}/u/${user}`);
    }
  }, [user]);


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyUrl);
      toast.success("Url Copied!");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };


  return (
    <div className='w-full flex items-center justify-center'>
      <div className='max-w-400 w-full mt-12 px-4 md:px-40 pt-4 md:pt-10 md:pb-20 flex flex-col border-0'>
        <h1 className='text-2xl font-bold mb-4'>User Dashboard</h1>
        <h1 className='text-lg mb-4'>Copy Your Message Receive Link</h1>

        <div className='w-full md:w-[50%] flex mb-4 border-0'>
          <Input disabled value={copyUrl} className='mr-5 text-gray-950 ' />
          <Button onClick={() => handleCopy()} className='cursor-pointer'>Copy</Button>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Switch className='cursor-pointer'
            {...register("isAcceptingMessage")} // this is the connection between swatch with form
            id="airplane-mode border"
            checked={acceptMessageStatus} // this value read and update by use watch
            disabled={isAcceptingSwitchLoading} // when loading switch disable
            onCheckedChange={handleAcceptingMessageChange}
          />
          <Label htmlFor="airplane-mode" className='text-lg'>
            Accept Message: {acceptMessageStatus ? "On" : "Off"} {isAcceptingSwitchLoading && <Loader2 className='w-5 h-5 ml-2 mt-1 animate-spin' />}
          </Label>
        </div>

        <div className='w-full md:w-[50%] flex mb-6 mt-3 md:mt-6 border-0'>
          <h1 className='text-lg '>Your Message Inbox</h1>
          <Button
            disabled={isMessageRefreshing}
            onClick={handleMessageRefreshing}
            className=' h-8 w-8 ml-3 bg-black text-white rounded-lg border-gray-400 border flex items-center justify-center hover:bg-gray-700 cursor-pointer'
          >
            <RefreshCwIcon className={`h-5 w-5 ${isMessageRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className=' flex justify-start items-start gap-4 flex-wrap'>

          {messagesArr.length > 0 ?
            messagesArr.map((message: any, i: number) => {
              return <MessageCard key={i} messageObj={message} />
            })
            :
            <div className="text-gray-400 mt-20 w-full flex justify-center ">
              {isMessageRefreshing ? (
                <h1 className='flex gap-2 text-center'>
                  Loading <Loader2 className='animate-spin' />
                </h1>
              ) : (
                "No inbox messages."
              )}
            </div>

          }

        </div>

      </div>
    </div >
  )
}

export default page