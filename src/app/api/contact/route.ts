import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/types/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    // Send email notification
    await resend.emails.send({
      from: "contact@sales.inventivelabs.co",
      to: "saydmaadan@gmail.com", // Replace with your email
      subject: `New Contact Form Submission: ${validatedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ""}
        ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ""}
        ${validatedData.services?.length ? `<p><strong>Interested Services:</strong> ${validatedData.services.join(", ")}</p>` : ""}
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `,
    });

    // Send auto-reply to the user
    await resend.emails.send({
      from: "contact@sales.inventivelabs.co",
      to: validatedData.email,
      subject: "Thank you for contacting InventiveLabs",
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Dear ${validatedData.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Here's a copy of your message:</p>
        <hr />
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
        <hr />
        <p>Best regards,</p>
        <p>The InventiveLabs Team</p>
      `,
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}
