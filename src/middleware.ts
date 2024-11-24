import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Define public API routes
  const publicApiRoutes = [
    '/api/auth',
    '/api/newsletter/subscribe',
    '/api/contact',
  ]

  // Protect API routes except public ones
  if (pathname.startsWith('/api/')) {
    const isPublicRoute = publicApiRoutes.some(route => pathname.startsWith(route))
    if (!isPublicRoute && !session) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('callbackUrl', encodeURIComponent(pathname))
      return NextResponse.redirect(url)
    }

    if (session.user.role !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      )
    }
  }

  // Allow public routes and authenticated requests
  return NextResponse.next()
}

// Configure which routes to protect
export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
  ]
}
