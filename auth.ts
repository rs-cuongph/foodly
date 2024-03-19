import NextAuth, { User } from "next-auth";
import { authConfig } from "./auth.config";
import { request } from "./shared/axios";
import CredentialsProvider from "next-auth/providers/credentials";
import authenticationSession from "./shared/authenticationSession";
import { STORAGE_KEYS } from "./shared/constants";

function prepareHeaders(headers?: Record<string, string>) {
  if (!headers) {
    return;
  }
  return {
    cookie: headers.cookie,
    "accept-encoding": headers["accept-encoding"],
    "accept-language": headers["accept-language"],
    "user-agent": headers["user-agent"],
    lang: "ja",
  };
}

interface AuthenticatedData {
  deleted_at: string | null;
  email: string;
  username: string;
  password: string;
  role: string;
  block_to: any;
  created_at: string;
  updated_at: string;
  current_refresh_token: string;
  id: string;
}

interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
  authenticated_data: AuthenticatedData;
}

const parseAuthenticationInfo = (res: AuthenticationResponse) => {
  return {
    access_token: res.access_token,
    refresh_token: res.refresh_token,
    authenticated_data: res.authenticated_data,
  };
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      authorize: async (credentials, req) => {
        let accessToken: string = "";
        let refreshToken: string = "";
        if (!credentials) {
          throw new Error("Missing params");
        }

        await request({
          url: "auth/sign-in",
          method: "POST",
          headers: prepareHeaders(req?.headers as any),
          data: {
            email: credentials.email,
            password: credentials.password,
          },
        }).then((res: any) => {
          accessToken = res.access_token;
          refreshToken = res.refresh_token;
        });

        if (!accessToken) return null;

        return await request({
          url: "auth/user-info",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((res: any) => {
            return parseAuthenticationInfo({
              authenticated_data: res.info,
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          })
          .catch(() => null);
      },
    }),
  ],
});
