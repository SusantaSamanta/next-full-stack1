'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addMessages } from '@/store/slices/MessageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, RefreshCcwDot, RefreshCcwIcon, RefreshCwIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

const page = () => {
  const dispatch = useDispatch();
  const [isAcceptingSwitchLoading, setIsAcceptingSwitchLoading] = useState(false);


  const obj = {
    date: new Date,
    message: "Hello this is first message."
  }

  // dispatch(addMessages(obj));

  // console.log(useSelector((state: any) => {
  //   return state.messages
  // }));

  const messageAcceptingSchema = z.object({
    isAcceptingMessage: z.boolean
  })
  type messageAcceptingType = z.infer<typeof messageAcceptingSchema>
  const form = useForm<messageAcceptingType>({
    resolver: zodResolver(messageAcceptingSchema)
  });

  const {
    register,  // connect input field to form
    watch,     // read value live
    setValues  // change value manually
  } = form;
  const acceptMessageStatus: any = watch("isAcceptingMessage"); // where watch read value and set in this variable


  useEffect(() => {
    const fetchMessageAcceptingStatus = async () => {
      setIsAcceptingSwitchLoading(true);
      try {
        const { data } = await axios.get('/api/accepting-messages');
        console.log(data)
        if (data.success) {
          setValues(data.isAcceptingMessage);
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



  return (
    <div className='w-full flex items-center justify-center'>
      <div className='max-w-400 w-full mt-12 px-4 md:px-40 pt-4 md:pt-10 flex flex-col '>
        <h1 className='text-2xl font-bold mb-4'>User Dashboard</h1>
        <h1 className='text-lg mb-4'>Copy Your Message Receive Link</h1>

        <div className='w-full md:w-[50%] flex mb-4 border-0'>
          <Input disabled value={"https://localhost/u/susanta"} className='mr-5' />
          <Button>Copy</Button>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Switch
            {...register("isAcceptingMessage")} // this is the connection between swatch with form
            id="airplane-mode border"
            checked={acceptMessageStatus} // this value read and update by use watch
            disabled={isAcceptingSwitchLoading} // when loading switch disable
          />
          <Label htmlFor="airplane-mode" className='text-lg'>
            Accept Message: On {isAcceptingSwitchLoading && <Loader2 className='w-5 h-5 ml-2 mt-1 animate-spin' />}
          </Label>
        </div>

        <div className='w-full md:w-[50%] flex mb-4 mt-3 md:mt-6 border-0'>
          <h1 className='text-lg '>Your Message Inbox</h1>
          <div className=' h-8 w-8 ml-3 bg-black text-white rounded-lg border-gray-400 border flex items-center justify-center hover:bg-gray-700'>

            <RefreshCwIcon className='animate-spin h-5 w-5' />
          </div>
        </div>

        <div className=' flex items-end justify-center gap-4 flex-wrap border-0'>
          <MessageCard />
          <MessageCard />
          <MessageCard />
          <MessageCard />
          <MessageCard />
          <MessageCard />
          <MessageCard />
          <MessageCard />
          <MessageCard />
        </div>

      </div>
    </div>
  )
}

export default page