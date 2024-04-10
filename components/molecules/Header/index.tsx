"use client";
import { useAppSelector } from "@/hooks/stores.hook";
import { Avatar } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import styled from "styled-components";
import logo from "@/public/images/logo.webp";
import { useWindowSize } from "@/hooks/window-size";
import clsx from "clsx";
const HeaderWrapper = styled.div``;

const AvatarWrapper = styled(Avatar)``;

export default function Header() {
  const session = useSession();
  const { isMobile } = useWindowSize();

  return (
    <HeaderWrapper
      className={clsx(
        "absolute top-[10px] right-[0px] flex flex-row w-full pl-4 pr-4 header-wrapper",
        isMobile ? "justify-center" : "justify-between"
      )}
    >
      {/* bg-[#ffffff14] */}
      <div className="flex flex-row items-center gap-2 backdrop:blur-md px-2 py-1 backdrop-blur-md bg-[#fe724c91] rounded-[30px]">
        <Image
          width={40}
          height={40}
          src={logo.src}
          alt="foodly booking"
          className="rounded-[30px]"
        />
        <span className="font-bold text-[18px] text-white">FOODLY BOOKING</span>
      </div>
      {session.status === "authenticated" && !isMobile && (
        <div className="flex flex-row  items-center gap-3 ">
          {!isMobile && (
            <h3 className="m-0 text-white font-bold text-[14px]">
              {session.data.user.authenticated_data?.email}
            </h3>
          )}

          <AvatarWrapper
            isBordered
            color="primary"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          />
        </div>
      )}
    </HeaderWrapper>
  );
}
