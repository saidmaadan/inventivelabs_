import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NewsletterVerifiedPage() {
  return (
    <div className="container flex min-h-[600px] flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[400px] flex-col items-center justify-center text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold">Email Verified!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for verifying your email address. You are now subscribed to our newsletter.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
