// app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  const decoded = jwt.verify(token!, process.env.JWT_SECRET!);
  
  return NextResponse.json({ 
    message: 'Welcome to the dashboard', 
    user: decoded 
  });
}
