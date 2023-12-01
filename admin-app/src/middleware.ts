import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "./actions/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const isAuth = await isAuthenticated(request);
  console.log("isAuth", isAuth);
  console.log("request.url", request.url);
  const pathname = request.nextUrl.pathname;
  console.log("pathname", pathname);

  if (!isAuth) {
    return NextResponse.redirect(new URL('/auth/signin?callback=' + pathname, request.url))
  }

  return NextResponse.next()

}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/teams/:path*"],
}
