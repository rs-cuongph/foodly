"use client";

import Header from "@/components/molecules/Header";
import Main from "@/components/molecules/Main";
import ModalLogin from "@/components/molecules/ModalLogin";
import Sidebar from "@/components/molecules/Sidebar";
import { useAppDispatch } from "@/hooks/stores.hook";
import { getCurrentUser } from "@/provider/redux/thunk/auth.thunk";
import authenticationSession from "@/shared/authenticationSession";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef } from "react";
import "driver.js/dist/driver.css";
import { useTour } from "@/hooks/useTour";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const [driverObj] = useTour();
  const dispatch = useAppDispatch();
  const isFirstLogin = useRef<string | null>(null);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      if (localStorage.hasOwnProperty("isFirstLogin")) {
        isFirstLogin.current = localStorage.getItem("isFirstLogin") ?? null;
      }
    }
  }, []);

  useEffect(() => {
    if (session.status === "loading") {
      authenticationSession.initial();
      return;
    }
    authenticationSession.setAuthentication(session.data);

    if (session.status === "authenticated") {
      dispatch(getCurrentUser());
      if (isFirstLogin.current) return;
      driverObj.drive();
    }
  }, [session]);

  return (
    <Main className="h-screen p-2 flex flex-row gap-4">
      {session.status === "loading" ? (
        <></>
      ) : (
        <>
          <Header />
          <Sidebar />
          <div className="content overscroll-y-auto">{children}</div>
          <ModalLogin />
        </>
      )}
    </Main>
  );
}
