"use client";

import Image from "next/image";
import {
  ButtonWrapper,
  CardWrapper,
  Money,
  OrderDescription,
  OrderId,
  OrderTitle,
  RemainingTime,
  TotalOrder,
} from "./styled";
import {
  ClockIcon,
  HashtagIcon,
  PencilIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/16/solid";

export default function OrderItem() {
  return (
    <CardWrapper className="relative">
      <Image
        className="rounded-[15px] h-[165px] object-cover"
        src={
          "https://s3-alpha-sig.figma.com/img/8f9e/fa1d/92b682e1f929d355479e5fa033320028?Expires=1705276800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GsPlu0nL4fRNJFP0IRQG5xjtM3fA0rtY5tOM0cx7kFWPBSHi811mKpK59MYsUotQ7iK7UwJic0aLppsJe~9T~p06-v9y~XMftn~OezPfCymnl8PYdTWzTr42DIUltX8851oW3v-bHTSHH6Bd1B0aIWfKBPos3jnu31EPGDqY2q6qrBUoHPVcFxqhSV5s9PsWwxVMICTtQObz3thM2-dho8Y7gn5bmznBqYu1rheryovvac5ift8MuPQjPFyhchk6Bp1lL0h89Wrwx4OkCibRYpv5GmvPLed0I8cE6~p9oUWA~8UHmtLFNbyFFXfJ6YaL-L2PdQ5sE8W9h-j4ABtxIA__"
        }
        width={323}
        height={165}
        alt=""
      />
      <Money className="absolute top-[10px] left-3">
        <span className="unit">$</span>
        25.000
      </Money>
      <div className="absolute top-[150px] left-3 flex flex-row gap-2">
        <OrderId className="flex flex-row gap-[2px]">
          <HashtagIcon className="h-4 w-4 text-primary" />
          000000001
        </OrderId>
        <TotalOrder className="flex flex-row gap-[2px]">
          <UserGroupIcon className="h-4 w-4 text-primary" />
          16
        </TotalOrder>
        <RemainingTime className="flex flex-row gap-[2px]">
          <ClockIcon className="h-4 w-4 text-primary" />
          30&apos;
        </RemainingTime>
      </div>
      <div className="px-[22px] py-4">
        <OrderTitle>Chicken Hawaiian</OrderTitle>
        <OrderDescription className="mt-[10px] line-clamp-2">
          Chicken, Cheese and pineapple
        </OrderDescription>
        <div className="mt-[10px] flex flex-row gap-1 items-center">
          <UserIcon className="h-4 w-4 text-primary" />
          <h5 className="m-0 text-[13px] font-[500]">Cuong Phan</h5>
        </div>
        <div className="mt-[20px] flex flex-row gap-2">
          <ButtonWrapper color="primary">
            <PencilIcon className="h-4 w-4 text-white" />
            Edit
          </ButtonWrapper>

          <ButtonWrapper color="primary" variant="bordered">
            <ShoppingCartIcon className="h-4 w-4 text-primary" />
            Order
          </ButtonWrapper>
        </div>
      </div>
    </CardWrapper>
  );
}
