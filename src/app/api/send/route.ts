import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let name, email, phone, message, subject, type, extraData: any = {};
    let attachments: any[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = formData.get('name') as string;
      email = formData.get('email') as string;
      phone = formData.get('phone') as string;
      message = formData.get('message') as string;
      subject = formData.get('subject') as string || formData.get('_subject') as string;
      type = formData.get('type') as string || 'Career Application';

      // Handle file attachment
      const file = formData.get('attachment') as File;
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: file.name,
          content: buffer,
        });
      }

      // Collect other fields
      formData.forEach((value, key) => {
        if (!['name', 'email', 'phone', 'message', 'subject', '_subject', 'type', 'attachment', '_captcha', '_template'].includes(key)) {
          extraData[key] = value;
        }
      });
    } else {
      const body = await request.json();
      ({ name, email, phone, message, subject, type, ...extraData } = body);
    }

    // Default recipient
    const to = 'banderson@eaglerevolution.com';

    // Construct email HTML
    let html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">🦅 Eagle Revolution - New Submission</h2>
        <p><strong>Type:</strong> ${type || 'General Inquiry'}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
    `;

    // Add extra data if any
    if (Object.keys(extraData).length > 0) {
      html += `<div style="margin-top: 20px; border-top: 1px solid #eee; pt-10px;">
        <p><strong>Additional Details:</strong></p>
        <ul style="list-style: none; padding: 0;">`;

      for (const [key, value] of Object.entries(extraData)) {
        if (value && typeof value !== 'object') {
          html += `<li style="margin-bottom: 5px;"><strong>${key.replace('_', ' ').toUpperCase()}:</strong> ${value}</li>`;
        }
      }

      html += `</ul></div>`;
    }

    html += `
        <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
          ⏱️ Submitted: ${new Date().toLocaleString()}<br>
          🇺🇸 Veteran Owned & Operated
        </p>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Eagle Revolution <onboarding@resend.dev>',
      to: [to],
      subject: subject || `New Form Submission from ${name}`,
      html: html,
      replyTo: email,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Resend Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
