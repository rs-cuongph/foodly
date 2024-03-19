"use client";
import { ROUTES } from "@/shared/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.push(ROUTES.HOME);
  }, []);

  return <></>;
}
