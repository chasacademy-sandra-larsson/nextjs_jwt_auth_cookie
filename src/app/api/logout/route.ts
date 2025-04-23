// app/api/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    
  // Delete the token from the cookie
  (await cookies()).set('authToken', '', {
    path: '/',
    maxAge: 0,
  });

  return NextResponse.json({ message: 'Logged out' });
}
