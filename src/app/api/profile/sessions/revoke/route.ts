import { getServerSession } from 'next-auth/next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { sessionId } = await req.json()

    // Verify the session belongs to the user
    const targetSession = await prisma.session.findFirst({
      where: {
        id: sessionId,
        user: {
          email: session.user.email,
        },
      },
    })

    if (!targetSession) {
      return new NextResponse('Session not found', { status: 404 })
    }

    // Delete the session
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    })

    return NextResponse.json({ message: 'Session revoked successfully' })
  } catch (error) {
    console.error('Revoke session error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
