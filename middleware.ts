import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'

export async function middleware(req: NextRequest) {
  // Determine if this is a protected route
  const isStudioRoute = req.nextUrl.pathname.startsWith('/studio')

  // Load the session using the new Next.js 16 proxy middleware pattern
  const session = await auth(req)

  // If user is not authenticated and tries to access /studio, redirect to sign-in
  if (isStudioRoute && !session) {
    const signInUrl = new URL('/auth/signin', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Allow request to continue
  return NextResponse.next()
}

export const config = {
  matcher: ['/studio/:path*'],
}
