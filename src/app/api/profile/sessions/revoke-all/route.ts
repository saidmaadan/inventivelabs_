import { getServerSession } from 'next-auth/next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Delete all sessions except the current one
    await prisma.session.deleteMany({
      where: {
        user: {
          email: session.user.email,
        },
        NOT: {
          sessionToken: session.user.sessionToken,
        },
      },
    })

    return NextResponse.json({ message: 'All sessions revoked successfully' })
  } catch (error) {
    console.error('Revoke all sessions error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
