import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordSetupEmail(
  email: string,
  name: string,
  token: string
) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/set-password?token=${token}`

  await resend.emails.send({
    from: 'InventiveLabs! <password-reset@sales.inventivelabs.co>',
    to: email,
    subject: 'Set up your password',
    html: `
      <h2>Welcome to InventiveLabs!</h2>
      <p>Hello ${name},</p>
      <p>An administrator has created an account for you. Please click the link below to set up your password:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  })
}
