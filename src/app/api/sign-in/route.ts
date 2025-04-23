import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';

// Replace with DB lookup
const mockUser = {
  email: 'user@example.com',
  passwordHash: await bcrypt.hash('pass123', 10), // hash at signup
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log('Received sign in request for:', email);

    // Fake DB check
    if (email !== mockUser.email) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, mockUser.passwordHash);
    if (!valid) {
      console.log('Invalid password');
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
      .sign(secret);

    console.log('Generated token:', token);

    // Set the token in the cookie
    const response = NextResponse.json({ message: 'Logged in' });
    
    response.cookies.set('authToken', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    });

    console.log('Cookie set in response');
    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 