import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      )
    }

    const subscriber = await prisma.newsletter.findFirst({
      where: {
        activationToken: token,
        tokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!subscriber) {
      return NextResponse.json(
        { message: 'Invalid or expired verification link' },
        { status: 400 }
      )
    }

    await prisma.newsletter.update({
      where: { id: subscriber.id },
      data: {
        active: true,
        activationToken: null,
        tokenExpiry: null,
      },
    })

    // Redirect to a success page
    return NextResponse.redirect(new URL('/newsletter/verified', req.url))
  } catch (error) {
    console.error('Newsletter verification error:', error)
    return NextResponse.json(
      { message: 'Failed to verify email subscription' },
      { status: 500 }
    )
  }
}
