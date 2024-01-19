import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
    <div className='text-white'>Landing page</div>
    <Link href="/sign-in">
      <Button>Login</Button>
    </Link>
    <Link href="/sign-up">
      <Button>Sign up</Button>
    </Link>
    </>
  )
}

export default page