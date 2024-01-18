import { UserButton } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
      <p>
        this is dashboard
        </p>
        <UserButton afterSignOutUrl='/'/>
        </div>

  )
}

export default page