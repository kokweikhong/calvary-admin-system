import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthFromRequest } from "./actions/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const auth = await getAuthFromRequest(request);
  console.log("isAuth", auth);
  console.log("request.url", request.url);
  const pathname = request.nextUrl.pathname;
  console.log("pathname", pathname);

  if (!auth) {
    return NextResponse.redirect(new URL('/auth/signin?callback=' + pathname, request.url))
  }

  return NextResponse.next()

}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/inventory/:path*",
    "/teams/:path*",
  ],
}
