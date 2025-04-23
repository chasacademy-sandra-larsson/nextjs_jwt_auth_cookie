import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that require authentication
const protectedPaths = ['/dashboard'];
const protectedApiPaths = ['/api/dashboard'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if the path requires authentication
  if (protectedPaths.some(p => path.startsWith(p)) || 
      protectedApiPaths.some(p => path.startsWith(p))) {
    
    // Read the token from the cookie
    const token = request.cookies.get('authToken')?.value;
    console.log('Middleware - Token found:', !!token);
    console.log('Middleware - Path:', path);

    if (!token) {
      console.log('Middleware - No token found');
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    try {
      // Verify token
      console.log('Middleware - Verifying token...');
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      console.log('Middleware - Token verified successfully');
    } catch (err) {
      console.log('Middleware - Token verification failed:', err);
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/dashboard/:path*'
  ],
}; 