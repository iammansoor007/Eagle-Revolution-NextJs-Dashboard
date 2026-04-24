import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const validUser = process.env.ADMIN_USERNAME;
    const validPass = process.env.ADMIN_PASSWORD;
    const secret   = process.env.ADMIN_SESSION_SECRET;

    if (!validUser || !validPass || !secret) {
      return NextResponse.json(
        { error: 'Server misconfiguration: admin credentials not set.' },
        { status: 500 }
      );
    }

    if (username === validUser && password === validPass) {
      const response = NextResponse.json({ success: true });
      // httpOnly cookie — not accessible from JS
      response.cookies.set('admin_session', secret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8, // 8 hours
      });
      return response;
    }

    return NextResponse.json(
      { error: 'Invalid username or password.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }
}
