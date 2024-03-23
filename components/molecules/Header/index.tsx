"use client";
import { useAppSelector } from "@/hooks/stores.hook";
import { Avatar } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import styled from "styled-components";

const HeaderWrapper = styled.div``;

const AvatarWrapper = styled(Avatar)``;

export default function Header() {
  const session = useSession();
  return session.status === "authenticated" ? (
    <HeaderWrapper className="absolute top-[10px] right-[10px] cursor-pointer flex flex-row items-center gap-3">
      <h3 className="m-0 text-white font-bold text-[14px]">
        {session.data.user.authenticated_data?.email}
      </h3>
      <AvatarWrapper
        isBordered
        color="primary"
        src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
      />
    </HeaderWrapper>
  ) : (
    <></>
  );
}
