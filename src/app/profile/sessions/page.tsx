'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from "sonner"

interface Session {
  id: string
  device: string
  lastActive: string
  isCurrent: boolean
}

export default function SessionsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])

  if (!session?.user) {
    router.push('/auth/signin')
    return null
  }

  async function revokeSession(sessionId: string) {
    try {
      setIsLoading(true)
      const response = await fetch('/api/profile/sessions/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      if (!response.ok) {
        throw new Error('Failed to revoke session')
      }

      setSessions(sessions.filter((s) => s.id !== sessionId))
      toast({
        title: 'Success',
        description: 'Session revoked successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke session',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function revokeAllSessions() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/profile/sessions/revoke-all', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to revoke all sessions')
      }

      setSessions([])
      toast({
        title: 'Success',
        description: 'All sessions revoked successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke all sessions',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active sessions across different devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={revokeAllSessions}
              disabled={isLoading || sessions.length === 0}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign out all devices
            </Button>
          </div>
          <div className="space-y-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <h4 className="font-medium">{s.device}</h4>
                  <p className="text-sm text-muted-foreground">
                    Last active: {new Date(s.lastActive).toLocaleString()}
                  </p>
                  {s.isCurrent && (
                    <span className="mt-1 inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Current session
                    </span>
                  )}
                </div>
                {!s.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => revokeSession(s.id)}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign out
                  </Button>
                )}
              </div>
            ))}
            {sessions.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No active sessions found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
