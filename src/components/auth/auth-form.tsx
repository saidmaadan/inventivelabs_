'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import { toast } from "sonner"

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'signin' | 'signup'
}

export function AuthForm({ type, className, ...props }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const from = searchParams.get('from') || '/'

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    const target = event.target as typeof event.target & {
      email: { value: string }
      password: { value: string }
    }

    try {
      if (type === 'signin') {
        const result = await signIn('credentials', {
          email: target.email.value,
          password: target.password.value,
          redirect: false,
          callbackUrl: from,
        })

        if (result?.error) {
          toast.error('Invalid credentials')
          return
        }

        router.push(from)
      } else {
        // Handle signup
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: target.email.value,
            password: target.password.value,
          }),
        })

        if (!res.ok) {
          const error = await res.text()
          throw new Error(error)
        }

        const result = await signIn('credentials', {
          email: target.email.value,
          password: target.password.value,
          redirect: false,
          callbackUrl: from,
        })

        if (result?.error) {
          throw new Error(result.error)
        }

        router.push(from)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              required
              minLength={8}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {type === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={async () => {
          try {
            setIsLoading(true)
            const result = await signIn('github', {
              callbackUrl: from,
              redirect: true,
            })
          } catch (error: any) {
            toast.error('Failed to sign in with GitHub')
          } finally {
            setIsLoading(false)
          }
        }}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}
        GitHub
      </Button>
    </div>
  )
}
