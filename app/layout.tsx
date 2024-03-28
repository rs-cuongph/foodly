import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { type DefaultTheme } from "styled-components";
import StyledComponentsRegistry from "../lib/registry";
import { Providers } from "./providers";
import ToastLayout from "@/components/atoms/Toast";
import ReduxProvider from "@/provider/redux/redux.provider";
import NextAuthProvider from "@/provider/next-auth/next-auth.provider";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

const theme: DefaultTheme = {
  colors: {
    primary: "#111",
    secondary: "#0070f3",
  },
};
export const metadata: Metadata = {
  title: "Foodly | UIT Team",
  description: "App Order food and drink",
  viewport:
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <html lang="en" suppressHydrationWarning>
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body
          className={clsx(
            inter.className,
            "min-h-screen bg-background antialiased"
          )}
          suppressHydrationWarning
        >
          <StyledComponentsRegistry>
            <Providers
              themeProps={{ attribute: "class", defaultTheme: "light" }}
            >
              <ToastLayout />
              <NextAuthProvider>
                <div className="relative">{children}</div>
              </NextAuthProvider>
            </Providers>
          </StyledComponentsRegistry>
        </body>
      </html>
    </ReduxProvider>
  );
}
