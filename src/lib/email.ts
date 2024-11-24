import { Resend } from 'resend'
import { render } from '@react-email/render'
import { VerificationEmail } from '@/emails/verification-email'
import { ResetPasswordEmail } from '@/emails/reset-password-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`
  
  const emailHtml = render(
    VerificationEmail({ verificationLink })
  )

  try {
    await resend.emails.send({
      from: 'Inventivelabs <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your email address',
      html: emailHtml,
    })
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
  
  const emailHtml = render(
    ResetPasswordEmail({ resetLink })
  )

  try {
    await resend.emails.send({
      from: 'Inventivelabs <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your password',
      html: emailHtml,
    })
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

interface SendNewsletterOptions {
  to: string[]
  subject: string
  html: string
  campaignId?: string
}

export async function sendNewsletter({ to, subject, html, campaignId }: SendNewsletterOptions) {
  try {
    const responses = await Promise.all(
      to.map(async (email) => {
        try {
          const response = await resend.emails.send({
            from: 'Inventivelabs Newsletter <newsletter@resend.dev>',
            to: email,
            subject,
            html,
            tags: campaignId ? [{ name: 'campaign_id', value: campaignId }] : undefined,
          })
          return { email, success: true, id: response.id }
        } catch (error) {
          console.error(`Error sending newsletter to ${email}:`, error)
          return { email, success: false, error }
        }
      })
    )

    const successCount = responses.filter((r) => r.success).length
    const failureCount = responses.filter((r) => !r.success).length

    return {
      success: true,
      total: to.length,
      sent: successCount,
      failed: failureCount,
      details: responses,
    }
  } catch (error) {
    console.error('Error sending newsletter:', error)
    throw error
  }
}

export async function sendTestNewsletter(to: string, subject: string, html: string) {
  try {
    await resend.emails.send({
      from: 'Inventivelabs Newsletter <newsletter@resend.dev>',
      to,
      subject: `[Test] ${subject}`,
      html,
      tags: [{ name: 'type', value: 'test' }],
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending test newsletter:', error)
    throw error
  }
}
