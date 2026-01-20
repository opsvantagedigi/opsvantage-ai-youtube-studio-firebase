import { NextRequest, NextResponse } from 'next/server'
import { auth } from 'apps/firebase-app/lib/auth/config'

export async function middleware(req: NextRequest) {
  // Determine if this is a protected route
  const { pathname } = req.nextUrl

  // if (pathname.startsWith('/studio')) {
  //   const session = await auth()
  //   if (!session) {
  //     return NextResponse.redirect(new URL('/auth/signin', req.url))
  //   }
  // }

  return NextResponse.next()
}
