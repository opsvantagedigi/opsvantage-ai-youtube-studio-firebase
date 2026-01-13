import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt";
import { getToken } from "next-auth/jwt"

const protectedPaths = ["/app", "/dashboard", "/admin"]

  const { pathname } = req.nextUrl;

  const authPaths = ["/app", "/dashboard"];

  const requiresAuth = authPaths.some((path) =>
    pathname === path || pathname.startsWith(path + "/")
  );

   if (!requiresAuth) {
     return NextResponse.next();
   }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/dashboard/:path*"],
};
