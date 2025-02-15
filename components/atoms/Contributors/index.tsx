"use client";
import styled from "styled-components";
import React from "react";
import {Popover, PopoverTrigger, PopoverContent, Avatar, Button} from "@nextui-org/react";
import UsersIcon from "../UsersIcon";
const ContributorWrapper = styled.main(() => {
  return `
    position: fixed;
    z-index: 9999;
    right: 40px;
    bottom: 40px;
    @media screen and (max-width: 766px) {
      right: 16px;
      bottom: 80px;
    }
  `;
});
const members = [
  {
    name: "Phan Hùng Cường",
    email: "cuongph@runsystem.net",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    name: "Trần Hữu Thục Nguyên",
    email: "nguyentht@runsystem.net",
    image: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  },
  {
    name: "Trương Quang Nhã",
    email: "nhatq@runsystem.net",
    image: "https://i.pravatar.cc/150?u=a04258114e29026302d",
  }
];
export default function Contributor() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <ContributorWrapper 
      className=""
    >
      <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <PopoverTrigger>
          <div className="bg-transparent hover:opacity-80 w-[50px] h-[50px] flex items-center justify-center rounded-[50%] bg-white bg-opacity-80 cursor-pointer shadow-xl"><UsersIcon /></div>
        </PopoverTrigger>
        <PopoverContent className="p-4 translate-x-[-8px] md:translate-x-[-28px] translate-y-[-10px] shadow-2xl bg-white bg-opacity-80">
          <h3 className="font-bold text-sm">Người đóng góp</h3>
          {members.map((item, index) => (
            <div key={index} className={`flex gap-3 px-1 py-2 items-center justify-start min-w-[240px] hover:opacity-80 cursor-pointer ${index < members.length - 1 ? "mt-1" : ""}`}>
              <Avatar src={item.image} className="w-8 h-8 text-tiny" />
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-[#0c2452]">{item.email}</div>
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </ContributorWrapper>
  )
}
