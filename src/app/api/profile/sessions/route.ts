import { getServerSession } from 'next-auth/next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get all sessions for the user
    const sessions = await prisma.session.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      select: {
        id: true,
        expires: true,
        sessionToken: true,
        userAgent: true,
      },
    })

    // Transform sessions data
    const formattedSessions = sessions.map((s) => ({
      id: s.id,
      device: s.userAgent || 'Unknown device',
      lastActive: s.expires.toISOString(),
      isCurrent: s.sessionToken === session.user.sessionToken,
    }))

    return NextResponse.json(formattedSessions)
  } catch (error) {
    console.error('Get sessions error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
