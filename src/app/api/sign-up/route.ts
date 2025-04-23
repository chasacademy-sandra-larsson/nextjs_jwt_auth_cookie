// app/api/sign-up/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // TODO: Store the new user in your DB here (hash password, etc.)
  console.log('Registering new user:', email);

  return NextResponse.json({ message: 'User registered successfully' });
}
