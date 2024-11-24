import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'InventiveLabs <subscriptions@sales.inventivelabs.co>'
// const FROM_EMAIL = 'InventiveLabs <onboarding@resend.dev>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      if (existingSubscriber.active) {
        return NextResponse.json(
          { message: 'This email is already subscribed to our newsletter' },
          { status: 400 }
        )
      }

      // Generate new activation token
      const activationToken = generateToken()
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      try {
        // Update subscriber with new token
        await prisma.newsletter.update({
          where: { email },
          data: {
            activationToken,
            tokenExpiry,
          },
        })

        // Send verification email
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: 'Verify Your Newsletter Subscription',
          html: `
            <h1>Verify Your Email Address</h1>
            <p>Thank you for subscribing to the InventiveLabs Newsletter! Please verify your email address by clicking the link below:</p>
            <p><a href="${APP_URL}/api/newsletter/verify?token=${activationToken}">Verify Email Address</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
          `,
        })

        return NextResponse.json({
          message: 'Please check your email to verify your subscription'
        })
      } catch (error) {
        console.error('Error processing reactivation:', error)
        throw new Error('Failed to process subscription reactivation')
      }
    }

    try {
      // Generate activation token for new subscriber
      const activationToken = generateToken()
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Create new subscriber
      await prisma.newsletter.create({
        data: {
          email,
          activationToken,
          tokenExpiry,
          active: false,
        },
      })

      // Send verification email
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Verify Your Newsletter Subscription',
        html: `
          <h1>Welcome to InventiveLabs Newsletter!</h1>
          <p>Thank you for subscribing to our newsletter. Please verify your email address by clicking the link below:</p>
          <p><a href="${APP_URL}/api/newsletter/verify?token=${activationToken}">Verify Email Address</a></p>
          <p>After verification, you'll receive regular updates about:</p>
          <ul>
            <li>Latest AI technology trends</li>
            <li>Industry insights and best practices</li>
            <li>Company news and updates</li>
            <li>Exclusive content and resources</li>
          </ul>
          <p>This verification link will expire in 24 hours.</p>
          <p>If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
        `,
      })

      return NextResponse.json({
        message: 'Please check your email to verify your subscription'
      })
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw new Error('Failed to create subscription')
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
