'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/signin')
    }
  }, [session, router])

  if (!session?.user) {
    return (
      <div className="container max-w-2xl py-8 flex justify-center">
        <Icons.spinner className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const { name, email, image } = session.user

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    const target = event.target as typeof event.target & {
      name: { value: string }
    }

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: target.name.value }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Update the session with new data
      await update({ name: target.name.value })
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={image || undefined} />
              <AvatarFallback>
                {name?.charAt(0) || email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{name || 'No name set'}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={name || ''}
                placeholder="Enter your name"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email || ''}
                disabled
                readOnly
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update profile
            </Button>
          </form>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Your email address is used for authentication and cannot be changed.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
