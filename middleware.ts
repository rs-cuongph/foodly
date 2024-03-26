import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("authjs.session-token")?.value;
  if (!session && !request.nextUrl.pathname.startsWith("/home")) {
    return Response.redirect(new URL("/home", request.url));
  }
  if (session && request.nextUrl.pathname === "/") {
    return Response.redirect(new URL("/home", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
