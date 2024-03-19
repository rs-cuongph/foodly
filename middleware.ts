import type { NextRequest } from "next/server";
import { STORAGE_KEYS } from "./shared/axios";

export function middleware(request: NextRequest) {
  //   const session = request.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value;
  //   if (!session && !request.nextUrl.pathname.startsWith("/auth/")) {
  //     return Response.redirect(new URL("/auth/login", request.url));
  //   }
  //   if (session && request.nextUrl.pathname === "/") {
  //     return Response.redirect(new URL("/search", request.url));
  //   }
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
