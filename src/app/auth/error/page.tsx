'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = 'An error occurred during authentication.'
  if (error === 'OAuthSignin') {
    errorMessage = 'Error occurred during OAuth sign in process.'
  } else if (error === 'OAuthCallback') {
    errorMessage = 'Error occurred during OAuth callback.'
  } else if (error === 'OAuthCreateAccount') {
    errorMessage = 'Could not create OAuth provider account.'
  } else if (error === 'EmailCreateAccount') {
    errorMessage = 'Could not create email provider account.'
  } else if (error === 'Callback') {
    errorMessage = 'Error occurred during the callback process.'
  } else if (error === 'EmailSignin') {
    errorMessage = 'Error sending the email for sign in.'
  } else if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid credentials. Please check your email and password.'
  } else if (error === 'SessionRequired') {
    errorMessage = 'Please sign in to access this page.'
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>

        <div className="flex flex-col space-y-2 text-center">
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
