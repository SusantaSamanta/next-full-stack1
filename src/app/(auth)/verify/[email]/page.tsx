"use client"
import { useState } from 'react'
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useParams, useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'



const page = () => {
    const [otp, setOtp] = useState('');
    const [isWrongOtp, setIsWrongOtp] = useState(false);
    const [isCheckingOtp, setIsCheckingOtp] = useState(false);
    const [style, setStyle] = useState('');

    const router = useRouter();
    const params = useParams<{ email: string }>();
    const email = decodeURIComponent(params.email);


    const handleSubmit = async (code: string) => {
        console.log(params.email);
        if (isCheckingOtp) {
            return;
        }
        setIsCheckingOtp(true);
        try {
            const res = await axios.post('/api/verify-otp',
                {
                    email,
                    verifyCode: code,
                }
            );
            if (res.data.success) {
                console.log(res.data.message);
                toast.success(res.data.message);
                setIsWrongOtp(false);
                setStyle("border-green-600");
                setTimeout(() => {
                    router.replace('/sign-in');
                }, 500);
            }
        } catch (error) {
            setIsWrongOtp(true);
            setStyle("border-red-600");
            const axiosErr: any = error as AxiosError;
            toast.error(axiosErr.response?.data.message ?? "error");
            console.log(axiosErr)
        } finally {
            setIsCheckingOtp(false);
        }
    }


    return (
        <>
            <div className='w-full h-screen flex items-center justify-center'>
                <div className='max-w-90 h-screen md:h-auto  border rounded-2xl px-10 py-8 shadow-xl'>


                    <h1 className='text-center mb-8'>Otp verification</h1>
                    <p className='text-sm mb-4'>Check your {"Susanta@gamil.com"} one 6 digit pin sended from captainofdev@gmail.com</p>
                    <Field className="w-full">
                        <FieldLabel htmlFor="digits-only">Enter 6 digit verification code where</FieldLabel>
                        <InputOTP id="digits-only" maxLength={6} pattern={REGEXP_ONLY_DIGITS}
                            value={otp}
                            onChange={(e) => {
                                setOtp(e);
                                setIsWrongOtp(false)
                                if (e.length === 6) {
                                    handleSubmit(e)
                                }
                            }}
                        >
                            <InputOTPGroup className='w-full flex items-center'>
                                <div className='w-full flex items-center justify-center'>
                                    <InputOTPSlot index={0} className={`w-10 h-10 ${style}`} />
                                    <InputOTPSlot index={1} className={`w-10 h-10 ${style}`} />
                                    <InputOTPSlot index={2} className={`w-10 h-10 ${style}`} />
                                    <InputOTPSlot index={3} className={`w-10 h-10 ${style}`} />
                                    <InputOTPSlot index={4} className={`w-10 h-10 ${style}`} />
                                    <InputOTPSlot index={5} className={`w-10 h-10 ${style}`} />
                                </div>
                            </InputOTPGroup>
                        </InputOTP>
                    </Field>


                    {isWrongOtp &&
                        <p className={`text-[14px] mt-2 text-center tracking-tight text-red-600`}>
                            {"This verification code is invalid or expire"}
                        </p>
                    }
                </div>
            </div>
        </>
    )
}

export default page