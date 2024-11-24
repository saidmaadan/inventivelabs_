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

    const { name } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Profile update error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
