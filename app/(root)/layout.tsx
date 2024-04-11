"use client";

import Header from "@/components/molecules/Header";
import Main from "@/components/molecules/Main";
import ModalLogin from "@/components/molecules/ModalLogin";
import Sidebar from "@/components/molecules/Sidebar";
import Contributors from "@/components/atoms/Contributors"
import { useAppDispatch } from "@/hooks/stores.hook";
import { getCurrentUser } from "@/provider/redux/thunk/auth.thunk";
import authenticationSession from "@/shared/authenticationSession";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (session.status === "loading") {
      authenticationSession.initial();
      return;
    }
    authenticationSession.setAuthentication(session.data);

    if (session.status === "authenticated") {
      dispatch(getCurrentUser());
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
          <Contributors />
        </>
      )}
    </Main>
  );
}
