"use client";
import { Avatar } from "@nextui-org/react";
import styled from "styled-components";

const HeaderWrapper = styled.div``;

const AvatarWrapper = styled(Avatar)``;

export default function Header() {
  return (
    <HeaderWrapper className="absolute top-[10px] right-[10px] cursor-pointer flex flex-row items-center gap-3">
      <h3 className="m-0 text-white font-bold text-[14px]">CuongPH</h3>
      <AvatarWrapper
        isBordered
        color="primary"
        src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
      />
    </HeaderWrapper>
  );
}
