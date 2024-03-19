import type { NextAuthConfig, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authConfig = {
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // const isLoggedIn = !!auth?.user;
      // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }
      return true;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<any> {
      if (!token?.access_token) {
        return null;
      }
      return {
        ...session,
        user: {
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          authenticated_data: token.authenticated_data,
        },
      };
    },
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user && user.access_token) {
        return {
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          authenticated_data: user.authenticated_data,
        };
      }

      return token;
    },
  },
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.NEXTAUTH_SECRET,
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
