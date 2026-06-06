'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { toast } from "sonner"
import axios, { AxiosError } from 'axios';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';


/// route : 3000/sign-in
const page = () => {
 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const signInSchema = z.object({
    identifier: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be 6 character")
  });
  type formSchema = z.infer<typeof signInSchema>;
  const form = useForm<formSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  });

  

  const onSubmit = async (data: formSchema) => {
    if (isSubmitting) {
        return;
    }
    setIsSubmitting(true);
    try {
        const res = await signIn('credentials', {
            redirect: false, // this mean after login next-auth not redirect to any route
            identifier: data.identifier, // where we send email name as identifier
            password: data.password  // password send
        });
        if(res?.error){
            toast.error(res.error);
            // console.log(res.error);
        }
        if(res?.url){ // mean sign in successful by next-auth
            toast.success("Sign in successfully.");
            setTimeout(() => {
                router.replace("/dashboard");
            }, 500);
        }
    } catch (error) {
      const apiError: any = error as AxiosError;
      console.log("User name checking error", apiError.response?.data.message ?? "error");
      toast.success( apiError.response?.data.message ?? "error");
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className='w-full h-screen flex items-center justify-center'>
        <div className='w-full h-screen md:h-auto max-w-md border rounded-2xl p-6 shadow-xl'>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <h1 className='mb-4 text-2xl font-bold text-center'>Login</h1>
            <FieldSet>
              <FieldLegend>Please signin</FieldLegend>
              <FieldDescription>Enter all the details for login</FieldDescription>

              <FieldGroup>

                <Controller name='identifier' control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='email'>Enter email</FieldLabel>
                      <Input {...field} id='email' placeholder='susanta@gmail.com' aria-invalid={fieldState.invalid} />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                    </Field>
                  )}
                />


                <Controller name='password' control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='password'>Password</FieldLabel>
                      <Input {...field} type='password' id='password' placeholder='•••••••' aria-invalid={fieldState.invalid} />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
            <Field>
              <Button type='submit' className={`my-6 w-full py-5 ${isSubmitting ? "bg-gray-600" : " bg-black"}`}>
                {isSubmitting && <Loader2 className='animate-spin' />}Login
              </Button>
            </Field>

            <p className='text-center text-sm'>Don't have account
              <Link href={'/sign-up'} className='text-blue-700'> sign-up</Link>
            </p>

          </form>


        </div>
      </div >

    </>
  )
}

export default page