import { Button } from '@/components/ui/button'
import Link from 'next/link'


const page = () => {
  return (
    <div>landing page
<div>
<Link href="/sign-in">
<Button>Sign in</Button>
</Link>
</div>
    </div>
  )
}

export default page