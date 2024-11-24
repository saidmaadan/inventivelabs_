import { Metadata } from 'next'
import { Icons } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Verify Email | Inventivelabs',
  description: 'Verify your email address',
}

export default function VerifyPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.email className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            A sign in link has been sent to your email address.
          </p>
        </div>
      </div>
    </div>
  )
}
