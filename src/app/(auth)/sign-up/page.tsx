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


/// route : 3000/sign-in
const page = () => {
  const [username, SetUsername] = useState('');
  const debounced = useDebounceCallback(SetUsername, 2000); /// for using debounceCallback setUsername get it's value after 2sc. Using debounced('value'). on every change in debounced setUsername get it's value in 2sc delay
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const router = useRouter();

  const signUpSchema = z.object({
    username: z.string().min(3, "Minimum 3 character require"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be 6 character")
  });
  type formSchema = z.infer<typeof signUpSchema>;
  const form = useForm<formSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (username.length < 3) {
        return
      }
      setIsCheckingUsername(true);
      setUsernameMessage('');
      try {
        const { data } = await axios.get(`/api/check-username-unique?username=${username}`);
        if (data.success) {
          console.log(data.message);
          setUsernameMessage(data.message);
          setIsUsernameAvailable(true);
        }
      } catch (error) {
        const apiError: any = error as AxiosError;
        console.log("User name checking error", apiError.response?.data.message ?? "error");
        setUsernameMessage(apiError.response?.data.message ?? "Unknown error")
        setIsUsernameAvailable(false);
      } finally {
        setIsCheckingUsername(false);
      }
    }
    checkUserNameUnique();
  }, [username])



  const onSubmit = async (data: formSchema) => {
    if (!isUsernameAvailable) {
      return toast.warning("User name is not available change now")
    }
    if (isSubmitting) {
      return toast.warning("wait")
    }
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/sign-up', data);
      if (res.data.success) {
        toast.success(res.data.message);
        router.replace(`/verify/${data.email}`)
      }
      console.log(res.data)
    } catch (error) {
      const apiError: any = error as AxiosError;
      console.log("User name checking error", apiError.response?.data.message ?? "error");
      toast.success( apiError.response?.data.message ?? "error");
    } finally {
      setIsSubmitting(false);
    }
    console.log(data)
  }

  return (
    <>
      <div className='w-full h-screen flex items-center justify-center'>
        <div className='w-full h-screen md:h-auto max-w-md border rounded-2xl p-6 shadow-xl'>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <h1 className='mb-4 text-2xl font-bold text-center'>Sign up</h1>
            <FieldSet>
              <FieldLegend>Please signup</FieldLegend>
              <FieldDescription>Enter all the details for registration</FieldDescription>

              <FieldGroup>


                {/* <Controller name='username' control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='name'>Enter username</FieldLabel>
                      <Input {...field} id='username' placeholder='Susanta' aria-invalid={fieldState.invalid} />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                    </Field>
                  )}
                /> */}

                <Controller name='username' control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='name'>Enter username</FieldLabel>
                      <Input {...field} id='username'
                        placeholder='Susanta'
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => {
                          setUsernameMessage('')
                          field.onChange(e); // this use for fill the text field 
                          debounced(e.target.value); // this debounced set setUsername value after 2sc
                        }}
                      />
                      <div className='flex gap-2'>
                        {isCheckingUsername && <p className='inline-block'>
                          <Loader2 className='animate-spin' /></p>
                        }
                        {usernameMessage &&
                          <p className={`text-[14px] tracking-tight ${usernameMessage === "This username is already taken." ? "text-red-600" : "text-green-400"}`}>
                            {usernameMessage}
                          </p>
                        }
                      </div>
                      {!usernameMessage &&
                        fieldState.invalid && <FieldError errors={[fieldState.error]} />
                      }

                    </Field>
                  )}
                />


                <Controller name='email' control={form.control}
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
                {isSubmitting && <Loader2 className='animate-spin' />}Sign up
              </Button>
            </Field>

            <p className='text-center text-sm'>Already have account
              <Link href={'/sign-in'} className='text-blue-700'> sign-in</Link>
            </p>

          </form>


        </div>
      </div >

    </>
  )
}

export default page