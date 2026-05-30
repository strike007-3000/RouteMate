import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as jose from 'jose';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const jwtSecret = process.env.JWT_SECRET;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!resendApiKey) {
      return NextResponse.json({ error: 'Resend API key is not configured' }, { status: 500 });
    }
    if (!jwtSecret) {
      return NextResponse.json({ error: 'JWT Secret is not configured' }, { status: 500 });
    }

    // Sign the token with jose (HS256)
    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new jose.SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secret);

    const magicLink = `${appUrl}/auth/verify?token=${token}`;

    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: 'RouteMate <onboarding@resend.dev>',
      to: email,
      subject: 'Sign in to RouteMate',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px; background: #000; color: #fff; border-radius: 16px;">
          <h2 style="font-size: 24px; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 8px;">RouteMate</h2>
          <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">Your pocket intelligence for travel. Click below to sign in instantly.</p>
          <a href="${magicLink}" style="display: inline-block; background: #fff; color: #000; padding: 14px 24px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Verify & Sign In</a>
          <p style="color: #52525b; font-size: 10px; margin-top: 32px; line-height: 1.5;">If you didn't request this link, you can safely ignore this email. Link expires in 15 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Send magic link error:', err);
    return NextResponse.json({ error: 'Failed to send magic link' }, { status: 500 });
  }
}
