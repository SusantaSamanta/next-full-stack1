'use client'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from './ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';


const Navbar = () => {

  const { data: session, status } = useSession();
  // console.log(session?.user.email, status);

  let name = session?.user.username;

  return (
    <div className='w-screen flex items-center justify-center fixed top-0 left-0 shadow-sm z-50 backdrop-blur-sm bg-[#ffffff79]'>
      <div className='max-w-400 w-full h-12 px-4 md:px-40    flex justify-between items-center '>
        <h1 className='font-bold  text-xl'><Link href={'/'}>Connect.Hub</Link></h1>

        <div>
          {
            status == "loading" ?
              <Loader2 className='animate-spin' />
              :
              <div>
                {
                  status == "unauthenticated" ?
                    <Button><Link href={'/sign-in'}>Login</Link></Button>
                    :
                    <div className='flex items-center gap-3' > {/* authenticated */}
                      {/* <Link href={'/dashboard'}>Dashboard</Link> */}
                      <Link href={'/profile'}>Welcome,
                        {
                          " " + name?.slice(0, 1).toUpperCase() + name?.slice(1, name.length)
                        }
                      </Link>
                      <Button onClick={() => signOut()}>Logout</Button>
                    </div>
                }
              </div>
          }
        </div>

      </div>

    </div>
  )
}

export default Navbar