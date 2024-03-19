import NextAuth, { DefaultSession } from "next-auth";

interface DefaultUser {
  access_token: string;
  refresh_token: string;
  error?: string;
  authenticated_data?: any;
}
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultUser & DefaultSession["user"];
  }
  interface User extends DefaultUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultUser {}
}
