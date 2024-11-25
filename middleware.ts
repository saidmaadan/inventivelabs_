import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path starts with /admin
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request })
    
    // If no token or not an admin, redirect to signin
    if (!token || token.role !== 'ADMIN') {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('callbackUrl', encodeURI(pathname))
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
    // Match API routes that require protection
    '/api/admin/:path*',
  ],
}
